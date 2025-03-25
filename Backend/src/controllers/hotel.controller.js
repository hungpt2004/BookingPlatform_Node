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
    message: "Get all owner hotel",
  });
});

exports.getOwnerHotels = asyncHandler(async (req, res) => {
  const { ownerId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const [hotels, total] = await Promise.all([
    Hotel.find({ owner: ownerId })
      .skip(skip)
      .limit(limit),
    Hotel.countDocuments({ owner: ownerId })
  ]);

  if (!hotels.length) {
    return res.status(404).json({
      error: true,
      message: "No hotels found",
    });
  }

  res.status(200).json({
    error: false,
    hotels,
    total,
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
      businessDocuments,
      services = [], // Default to an empty JSON string if not provided
      rooms = [],
      roomFacility,
      imageUrls,
      hotelParent
    } = req.body;

    console.log("get from FE", req.body);

    // Validate required fields
    if (!hotelName || !description || !address || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin khách sạn và tên công ty",
      });
    }

    const parseField = (field, isService = false) => {
      try {
        const parsed = typeof field === 'string' ? JSON.parse(field) : field;

        if (isService) {
          // Xử lý cả 2 trường hợp: array ID hoặc object có hotelServices
          return Array.isArray(parsed)
            ? parsed
            : parsed?.hotelServices?.map(s => s._id) || [];
        }

        return parsed || [];
      } catch (e) {
        return [];
      }
    };

    const parsedServices = parseField(services, true);
    const parsedFacilities = parseField(facilities);
    const parsedBusinessDocuments = parseField(businessDocuments);
    const parsedimageUrls = parseField(imageUrls);

    console.log("Final Data:", {
      services: parsedServices,
      facilities: parsedFacilities,
      businessDocuments: parsedBusinessDocuments,
      imageUrls: parsedimageUrls,
      rooms: rooms.map(r => ({
        bedTypes: r.roomDetails.bedTypes,
        facilities: r.facilities
      }))
    });

    // Create new hotel with service IDs
    const newHotel = new Hotel({
      hotelName,
      description,
      address,
      phoneNumber,
      rating,
      star,
      pricePerNight,
      facilities: parsedFacilities,
      images: parsedimageUrls,
      owner: ownerID,
      businessDocuments: parsedBusinessDocuments,
      services: parsedServices, // Assign array of service IDs
      hotelParent
    });



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

    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    console.log("createdRooms", createdRooms);
    // Return success response
    res.status(201).json({
      success: true,
      message: "Hotel created with services and rooms",
      hotel: newHotel,
      services: parsedServices,
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

// Delete Hotel
exports.deleteHotel = asyncHandler(async (req, res) => {
  const { hotelId } = req.params; // Make sure you're using params not body
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const hotel = await Hotel.findById(hotelId).session(session);
    if (!hotel) {
      await session.abortTransaction();
      return res.status(404).json({
        error: true,
        message: "Hotel not found",
      });
    }

    // Add document deletion logic if needed
    await Room.deleteMany({ hotel: hotelId }).session(session);
    await Reservation.deleteMany({ hotel: hotelId }).session(session);
    await HotelService.deleteMany({ hotel: hotelId }).session(session);

    await Hotel.findByIdAndDelete(hotelId).session(session);
    await session.commitTransaction();

    res.status(200).json({
      error: false,
      message: "Hotel deleted successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("Delete error:", err);
    res.status(500).json({
      error: true,
      message: "Server error during deletion",
    });
  } finally {
    session.endSession();
  }
});

// Update Hotel
exports.updateHotel = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;
  const { phoneNumber, star, ownerStatus } = req.body;

  try {
    const hotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { phoneNumber, star, ownerStatus },
      { new: true, runValidators: true }
    );

    if (!hotel) {
      return res.status(404).json({
        error: true,
        message: "Hotel not found",
      });
    }

    res.status(200).json({
      error: false,
      hotel,
      message: "Hotel updated successfully",
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({
      error: true,
      message: "Server error during update",
    });
  }
});

// Get Hotel Image
exports.getHotelImg = asyncHandler(async (req, res) => {
  try {
    const { hotelId } = req.params;

    const hotel = await Hotel.findById(hotelId).select('images');

    if (!hotel) {
      return res.status(404).json({
        error: true,
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      error: false,
      images: hotel.images
    });

  } catch (err) {
    console.error('Error fetching hotel images:', err);
    res.status(500).json({
      error: true,
      message: 'Server error while fetching images'
    });
  }
});

// Delete Image
exports.deleteImg = asyncHandler(async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { imageUrl } = req.body;

    // Get public ID from Cloudinary URL
    const publicId = getPublicIdFromUrl(imageUrl);

    // Delete from Cloudinary
    await deleteImages([publicId]);

    // Remove from hotel images array
    const hotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { $pull: { images: imageUrl } },
      { new: true }
    );

    res.status(200).json({
      error: false,
      message: 'Image deleted successfully',
      hotel
    });

  } catch (err) {
    console.error('Delete image error:', err);
    res.status(500).json({
      error: true,
      message: 'Server error deleting image'
    });
  }
});

// Add Images
exports.addImg = asyncHandler(async (req, res) => {
  try {
    const { hotelId } = req.params;
    const files = req.files?.images;

    if (!files || files.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'No images provided'
      });
    }

    // Upload to Cloudinary
    const uploadedImages = await uploadMultipleImages(files, `hotels/${hotelId}`);

    // Update hotel with new images
    const hotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { $push: { images: { $each: uploadedImages } } },
      { new: true }
    );

    res.status(200).json({
      error: false,
      message: 'Images added successfully',
      hotel
    });

  } catch (err) {
    console.error('Add image error:', err);
    res.status(500).json({
      error: true,
      message: 'Server error adding images'
    });
  }
});

/**
 * Upload tất cả document từ request lên Cloudinary và trả về URL
 */
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

/**
 * Upload tất cả ảnh từ request lên Cloudinary và trả về URL
 */
exports.uploadAllImages = asyncHandler(async (req, res) => {
  try {
    const ownerID = req.user?.id || req.body.ownerID;

    // Kiểm tra và xử lý tệp hình ảnh
    let imageUrls = [];
    if (req.files && Object.keys(req.files).length > 0) {
      const hotelImages = req.files.images
        ? Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images]
        : [];

      if (hotelImages.length > 0) {
        const folderPath = `hotels/${ownerID}/photos`;
        imageUrls = await uploadMultipleImages(hotelImages, folderPath, {
          width: 800,
          crop: "fill",
          quality: "auto:good",
        });
      }
    }
    // Trả về kết quả chỉ với hình ảnh
    return res.status(200).json({
      success: true,
      message: "Tải hình ảnh thành công!",
      imageUrls: imageUrls, // Chỉ trả về mảng hình ảnh
    });
  } catch (error) {
    console.error("Lỗi khi tải hình ảnh:", error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ khi tải hình ảnh." });
  }
});