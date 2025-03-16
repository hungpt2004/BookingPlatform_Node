const asyncHandler = require("../middlewares/asyncHandler");
const Hotel = require("../models/hotel");
const HotelService = require("../models/hotelService");
const Room = require("../models/room");
require("../models/hotelFacility"); 
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
    Hotel.findOne({ _id: hotelId }).populate('services').populate('facilities'),
    Room.find({ hotel: hotelId })
    .populate("bed.bed"),
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
      businessDocuments

      /* Merged code from SON */
      // facilities = [],
      // services = {},
      // rooms = []

    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!hotelName || !description || !address || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin khách sạn và tên công ty"
      });
    }
    //chuyen json sang object
    const parsedBusinessDocuments = JSON.parse(businessDocuments);
    const parsedFacilities = JSON.parse(facilities);
    // Kiểm tra xem mỗi phần tử trong facilities có phải là ObjectId hợp lệ không
    for (const facilityId of parsedFacilities) {
      // 1. Kiểm tra tính hợp lệ của ObjectId
      if (!mongoose.Types.ObjectId.isValid(facilityId)) {
        return res.status(400).json({
          success: false,
          message: `facilities chứa ID không hợp lệ: ${facilityId}`,
        });
      }

      // 2. Kiểm tra sự tồn tại của facilityId trong collection hotelFacility
      const facilityExists = await hotelFacility.exists({ _id: facilityId });
      if (!facilityExists) {
        return res.status(400).json({
          success: false,
          message: `facilities chứa ID không tồn tại: ${facilityId}`,
        });
      }
    }
    // Kiểm tra ảnh
    // if (!req.files || Object.keys(req.files).length === 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Vui lòng tải lên ít nhất một ảnh khách sạn"
    //   });
    // }

    // Lấy các files ảnh từ request
    // const hotelImages = req.files.images
    //   ? Array.isArray(req.files.images)
    //     ? req.files.images
    //     : [req.files.images]
    //   : Object.values(req.files).flat();

    // Tạo đường dẫn thư mục với tên công ty
    // const folderPath = `hotels/${ownerID}`;

    // Upload ảnh lên Cloudinary
    // const imageUrls = await uploadMultipleImages(hotelImages, folderPath, {
    //   width: 800,
    //   crop: "fill",
    //   quality: "auto:good"
    // });

    let imageUrls = [];
    
    if (req.files && Object.keys(req.files).length > 0) {
      // Lấy các files ảnh từ request
      const hotelImages = req.files.images
        ? Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images]
        : [];

      if (hotelImages.length > 0) {
        const folderPath = `hotels/${ownerID}`;
        // Upload ảnh lên Cloudinary
        imageUrls = await uploadMultipleImages(hotelImages, folderPath, {
          width: 800,
          crop: "fill",
          quality: "auto:good"
        });
      }
    }

    // Tạo khách sạn mới
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
      businessDocuments: parsedBusinessDocuments
    });
    await newHotel.save({ session });

    // Create Hotel Services
    const hotelServices = [];
    if (services.serveBreakfast === "Có" && services.includedInPrice === "Không" && services.breakfastPrice) {
      const breakfastService = new HotelService({
        hotel: newHotel._id,
        name: "Breakfast",
        price: parseFloat(services.breakfastPrice)
      });
      await breakfastService.save({ session });
      hotelServices.push(breakfastService);
    }
    if (services.hasParking === "Có, tính phí" && services.parkingFee) {
      const parkingService = new HotelService({
        hotel: newHotel._id,
        name: "Parking",
        price: parseFloat(services.parkingFee)
      });
      await parkingService.save({ session });
      hotelServices.push(parkingService);
    }

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
        bed: roomDetails.bedTypes.map(bed => ({
          bed: bed.bedId,
          quantity: bed.count
        }))
      });
      await newRoom.save({ session });
      createdRooms.push(newRoom);
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Trả về phản hồi thành công
    res.status(201).json({
      success: true,
      message: "Hotel created with services and rooms",
      hotel: newHotel,
      services: hotelServices,
      rooms: createdRooms
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating hotel:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating hotel",
      error: error.message
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
