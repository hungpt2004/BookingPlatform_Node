const asyncHandler = require("../middlewares/asyncHandler");
const Hotel = require("../models/hotel");
const clousdinay = require("../utils/cloudinary");
const fs = require("fs");
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
      message: "No hotels found"
    });
  }

  return res.status(200).json({
    error: false,
    hotels,
    message: "Get all owned hotel"
  })

});

exports.uploadImage = asyncHandler(async (req, res) => {
  console.log("Route hit!");
  try {
    const hotelId = req.hotel?.id || req.body.id; // Kiểm tra ID từ token hoặc body
    if (!hotelId) {
      return res.status(404).json({
        error: true,
        message: "Unauthorized: No hotel ID provided"
      });
    }
    const hotel = await Hotel.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "hotel not found"
      });
    }
    // Kiểm tra xem file có được gửi trong request không
    if (!req.files || !req.files.images) {
      return res.status(404).json({
        error: true,
        message: "No file uploaded"
      });
    }
    const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    let uploadedImages = [];
    for (let image of images) {
      const uploadResult = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: `hotel_images + ${hotelId}`,
      });

      uploadedImages.push({
        // public_ID: uploadResult.public_id,
        url: uploadResult.secure_url,
      });
    }
    hotel.images = [...hotel.images, ...uploadedImages]; // Lưu ảnh vào danh sách
    await hotel.save();

    res.json({
      error: false,
      message: "Images uploaded successfully",
      images: uploadedImages
    });

  } catch (error) {

    res.status(500).json({ message: "Server error" });
  }
})