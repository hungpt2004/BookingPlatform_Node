const User = require("../models/user");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

exports.updateAvatar = async (req, res) => {
  console.log("Route hit!");
  try {
    const userId = req.user?.id || req.body.id; // Kiểm tra ID từ token hoặc body
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID provided" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Kiểm tra xem file có được gửi trong request không
    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    // **XÓA AVATAR CŨ TRÊN CLOUDINARY**
    if (user.image && user.image.public_ID) {
      await cloudinary.uploader.destroy(user.image.public_ID);
      console.log("Deleted old avatar:", user.image.public_ID);
    }
    // Lấy file từ  request
    const image = req.files.image;
    // Upload file lên Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "avatar", // Thư mục trên Cloudinary
      width: 150, // Resize ảnh (tùy chỉnh)
      crop: "scale", // Crop ảnh (tùy chỉnh)
    });

    // Cập nhật user với ảnh mới
    user.image = {
      public_ID: uploadResult.public_id, // Sửa đúng biến
      url: uploadResult.secure_url,
    };

    await user.save(); // Lưu cập nhật vào database
    res.json({
      message: "Image updated successfully",
      image: image,
    });
  } catch (error) {
    console.error("Error updating Image:", error);
    res.status(500).json({ message: "Server error" });
  }
};
