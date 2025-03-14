const asyncHandler = require("../middlewares/asyncHandler");
const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Reservation = require("../models/reservation");
const Bed = require("../models/bed");
const { AUTH, GENERAL, HOTEL } = require("../utils/constantMessage");
const { uploadMultipleImages, deleteImages, getPublicIdFromUrl } = require("../utils/uploadToCloudinary");
const PendingHost = require("../models/pendingHost");
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
      facilities = [],

    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!hotelName || !description || !address || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin khách sạn và tên công ty"
      });
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

    // Kiểm tra và xử lý ảnh (nếu có)
    if (req.files && Object.keys(req.files).length > 0) {
      // Lấy các files ảnh từ request
      const hotelImages = req.files.images
        ? Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images]
        : [];

      if (hotelImages.length > 0) {
        // Tạo đường dẫn thư mục với tên công ty
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
    const newHotel = await Hotel.create({
      hotelName,
      description,
      address,
      phoneNumber,
      rating,
      star,
      pricePerNight,
      facilities,
      images: imageUrls,
      owner: ownerID,

    });

    // Trả về phản hồi thành công
    res.status(201).json({
      success: true,
      message: "Tạo khách sạn mới thành công",
      hotel: newHotel,

    });
    console.log(newHotel);
  } catch (error) {
    console.error("Lỗi khi tạo khách sạn:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi tạo khách sạn",
      error: error.message
    });
  }
});

exports.createPendingHotel = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);

    const ownerID = req.user?.id || req.body.id;
    const { businessName, businessDocuments } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!businessName || !businessDocuments || !businessDocuments.length) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tên doanh nghiệp và tài liệu kinh doanh'
      });
    }

    // Kiểm tra xem người dùng đã có yêu cầu đang chờ xử lý chưa
    const existingRequest = await PendingHost.findOne({
      user: ownerID,
      status: 'PENDING'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã có một yêu cầu đang chờ xử lý'
      });
    }

    // Tạo yêu cầu đăng ký mới
    const pendingHost = await PendingHost.create({
      user: ownerID,
      businessName,
      businessDocuments,
      status: 'PENDING',
      createdAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Đã gửi yêu cầu đăng ký thành công',
      pendingHost
    });
  } catch (error) {
    console.error('Lỗi khi tạo yêu cầu đăng ký chủ khách sạn:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi tạo yêu cầu đăng ký',
      error: error.message
    });
  }
});