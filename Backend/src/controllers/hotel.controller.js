const asyncHandler = require("../middlewares/asyncHandler");
const Hotel = require("../models/hotel");
const HotelService = require("../models/hotelService");
const Room = require("../models/room");
const Reservation = require("../models/reservation");
const Bed = require("../models/bed");
const { AUTH, GENERAL, HOTEL } = require("../utils/constantMessage");
const { uploadMultipleImages, deleteImages, getPublicIdFromUrl } = require("../utils/uploadToCloudinary");
const hotelFacility = require("../models/hotelFacility");
const mongoose = require("mongoose");
exports.getAllHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find();

  if (hotels.length === 0) {
    return res.status(404).json({
      error: true,
      message: "No hotels found",
    });
  }

  return res.status(200).json({
    error: false,
    hotels,
    message: "Get all hotels success",
  });
});

exports.getOwnedHotels = asyncHandler(async (req, res) => {
  const user = req.user;

  const hotels = await Hotel.find({ owner: user.id });

  if (hotels.length === 0) {
    return res.status(404).json({
      error: true,
      message: "No hotels found",
    });
  }

  return res.status(200).json({
    error: false,
    hotels,
    message: "Get all owned hotel",
  });
});

exports.getHotelDetailById = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;

  if (!hotelId) {
    return res.status(404).json({
      error: true,
      message: GENERAL.BAD_REQUEST,
    });
  }

  const [currentHotel, listCurrentHotelRoom] = await Promise.all([
    Hotel.findOne({ _id: hotelId }),
    Room.find({ hotel: hotelId }).populate("bed.bed"),
  ]);

  if (!currentHotel) {
    return res.status(404).json({
      error: true,
      message: GENERAL.BAD_REQUEST,
    });
  }

  return res.status(200).json({
    error: false,
    hotel: currentHotel,
    rooms: listCurrentHotelRoom,
    message: "Get hotel data success",
  });
});

exports.getTopHotel = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find().sort({ rating: -1 }).limit(10);

  return res.status(200).json({
    error: false,
    hotels,
    message: HOTEL.SUCCESS,
  });
});

exports.getTotalReservationByHotelId = asyncHandler(async (req, res) => {

  const { hotelId } = req.params;

  if (!hotelId) {
    return res.status(500).json({
      error: true,
      message: HOTEL.INVALID_ID,
    });
  }

  const totalReservations = await Reservation.countDocuments({ hotel: hotelId });

  return res.status(200).json({
    error: false,
    totalReservations,
    message: HOTEL.SUCCESS,
  });

});


exports.createHotel = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log(req.body);
    const ownerID = req.user?.id || req.body.id;
    const {
      hotelName,
      description,
      address,
      phoneNumber,
      rating = 0,
      star = 1,
      pricePerNight = 0,
      facilities,
      businessDocuments,
      services = "{}", // Default to an empty JSON string if not provided
      rooms = [],
      roomFacility,
    } = req.body;

    console.log("get from FE", req.body);

    // Validate required fields
    if (!hotelName || !description || !address || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin khách sạn và tên công ty",
      });
    }

    // Parse JSON strings into objects
    const parsedBusinessDocuments = JSON.parse(businessDocuments);
    const parsedFacilities = JSON.parse(facilities);
    const parsedServices = JSON.parse(services); // Parse the services JSON string

    // Upload images
    let imageUrls = [];
    if (req.files && Object.keys(req.files).length > 0) {
      const hotelImages = req.files.images
        ? Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images]
        : [];

      if (hotelImages.length > 0) {
        const folderPath = `hotels/${ownerID}`;
        imageUrls = await uploadMultipleImages(hotelImages, folderPath, {
          width: 800,
          crop: "fill",
          quality: "auto:good",
        });
      }
    }

    // Create new hotel
    const newHotel = new Hotel({
      hotelName,
      description,
      address,
      phoneNumber,
      rating,
      star,
      pricePerNight,
      facilities: parsedFacilities,
      images: imageUrls,
      owner: ownerID,
      businessDocuments: parsedBusinessDocuments,
      services: [], // Initialize services as an empty array
    });

    // Create Hotel Services
    const hotelServices = [];
    if (
      parsedServices.serveBreakfast === "Có" &&
      parsedServices.includedInPrice === "Không" &&
      parsedServices.breakfastPrice
    ) {
      const breakfastService = new HotelService({
        hotel: newHotel._id,
        name: "Breakfast",
        description: `Breakfast types: ${parsedServices.breakfastTypes.join(", ")}`,
        price: parseFloat(parsedServices.breakfastPrice),
      });
      await breakfastService.save({ session });
      hotelServices.push(breakfastService._id); // Save the ObjectId
    }
    if (
      parsedServices.hasParking === "Có, tính phí" &&
      parsedServices.parkingFee
    ) {
      const parkingService = new HotelService({
        hotel: newHotel._id,
        name: "Parking",
        description: `Parking location: ${parsedServices.parkingLocation}, Parking type: ${parsedServices.parkingTypes}`,
        price: parseFloat(parsedServices.parkingFee),
      });
      await parkingService.save({ session });
      hotelServices.push(parkingService._id); // Save the ObjectId
    }
    console.log("hotelServices", hotelServices);

    // Assign the service ObjectIds to the hotel
    newHotel.services = hotelServices;

    // Save the hotel
    await newHotel.save({ session });

    // Create Rooms
    const createdRooms = [];
    for (const roomData of rooms) {
      const { roomDetails, facilities: roomFacilities, ...rest } = roomData;
      const newRoom = new Room({
        ...rest,
        type: roomDetails.roomType,
        price: parseFloat(rest.price),
        capacity: roomDetails.capacity,
        description: roomDetails.description,
        quantity: roomDetails.roomQuantity,
        hotel: newHotel._id,
        facilities: roomFacilities,
        bed: roomDetails.bedTypes.map((bed) => ({
          bed: bed.bedId,
          quantity: bed.count,
        })),
      });
      await newRoom.save({ session });
      createdRooms.push(newRoom._id); // Save the ObjectId
    }
    
    // Assign the room ObjectIds to the hotel
    newHotel.rooms = createdRooms;
    await newHotel.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    console.log("createdRooms", createdRooms);
    // Return success response
    res.status(201).json({
      success: true,
      message: "Hotel created with services and rooms",
      hotel: newHotel,
      services: hotelServices,
      rooms: createdRooms,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating hotel:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating hotel",
      error: error.message,
    });
  }
});

exports.uploadAllDocuments = asyncHandler(async (req, res) => {
  try {
    const ownerID = req.user?.id || req.body.ownerID;
    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];

    let documentTypes = req.body.documentTypes;
    if (typeof documentTypes === "string") {
      documentTypes = documentTypes.split(",");
    }

    if (!Array.isArray(documentTypes) || files.length !== documentTypes.length) {
      return res.status(400).json({ success: false, message: "Số lượng tài liệu không khớp." });
    }

    const folderPath = `hotels/${ownerID}/documents`;

    // Upload tất cả tài liệu cùng một lúc
    const uploadResults = await uploadMultipleImages(files, folderPath, {
      width: 800,
      crop: "fill",
      quality: "auto:good"
    });

    // Lưu đúng định dạng mảng
    const uploadedDocuments = documentTypes.map((type, index) => ({
      title: type,
      url: uploadResults[index]
    }));

    return res.status(200).json({
      success: true,
      message: "Tải tài liệu thành công!",
      documentUrls: uploadedDocuments // Trả về mảng thay vì object
    });
  } catch (error) {
    console.error("Lỗi khi tải tài liệu:", error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ khi tải tài liệu." });
  }
});

