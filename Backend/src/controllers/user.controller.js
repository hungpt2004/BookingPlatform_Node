const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/user");
const { AUTH } = require("../utils/constantMessage");
const cloudinary = require("../utils/cloudinary");
exports.getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createOn: -1 });

  if (users.length === 0) {
    return res.status(404).json({
      error: true,
      message: AUTH.USER_NOT_FOUND,
    });
  }

  return res.status(200).json({
    error: false,
    users,
    message: AUTH.GET_SUCCESS,
  });
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({
      error: true,
      message: AUTH.INVALID_TOKEN,
    });
  }

  return res.status(200).json({
    error: false,
    user,
    messsage: AUTH.GET_SUCCESS,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // Chỉ lấy ID từ token, không từ params
  const updates = {};

  if (req.body.phone) {
    updates.phone = req.body.phone;
  }

  if (req.body.address) {
    updates.address = req.body.address;
  }

  if (req.body.name) {
    updates.name = req.body.name;
  }

  if (req.body.cmnd) {
    updates.cmnd = req.body.cmnd;
  }
  
  if (Object.keys(updates).length === 0) {
    return res.status(500).json({
      status: "fail",
      message: "No data provided for update",
    });
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res.status(500).json({
      status: "fail",
      message: "User not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

//update avatar
exports.updateAvatar = asyncHandler(async (req, res) => {
  console.log("Route hit!");
  try {
    const userId = req.user?.id || req.body.id; // Kiểm tra ID từ token hoặc body
    if (!userId) {
      return res.status(404).json({
        error: true,
        message: "Unauthorized: No user ID provided",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
    // Kiểm tra xem file có được gửi trong request không
    if (!req.files || !req.files.image) {
      return res.status(404).json({
        error: true,
        message: "No file uploaded",
      });
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
      error: false,
      message: "Image updated successfully",
      image: image,
    });
  } catch (error) {
    console.error("Error updating Image:", error);
    res.status(500).json({ message: "Server error" });
  }
});

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({
      error: true,
      message: AUTH.INVALID_TOKEN,
    });
  }

  return res.status(200).json({
    error: false,
    user,
    messsage: AUTH.GET_SUCCESS,
  });
});

