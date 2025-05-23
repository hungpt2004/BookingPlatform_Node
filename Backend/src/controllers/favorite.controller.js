const User = require("../models/user");
const Hotel = require("../models/hotel");
const asyncHandler = require("../middlewares/asyncHandler");

exports.addFavoriteHotel = asyncHandler(async (req, res) => {
  
  const userId = req.user._id;

  const { hotelId } = req.body;

  // Validate input
  if (!userId || !hotelId) {
    return res.status(400).json({
      error: true,
      message: "Missing required fields",
    });
  }

  // Check if the user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      error: true,
      message: "User not found",
    });
  }

  // console.log(hotelId)
  // Check if the hotel exists
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return res.status(404).json({
      error: true,
      message: "Hotel not found",
    });
  }

  // Add hotel to favorites
  if (!user.favorites.includes(hotelId)) {
    user.favorites.push(hotelId);
    await user.save();

    console.log("Đã tạo favorite thành công !");

    return res.status(200).json({
      error: false,
      message: "Hotel added to favorites successfully",
      favorites: user.favorites,
    });
  }

  return res.status(400).json({
    error: true,
    message: "Hotel is already in favorites",
  });
});

// Get all favorite hotels of a user
exports.getFavoriteHotels = asyncHandler(async (req, res) => {

  const user = req.user;

  console.log(user.id);
  // Validate input
  if (!user.id) {
    return res.status(400).json({
      error: true,
      message: "Missing required userId",
    });
  }

  // Check if the user exists
  try {
    const currentUser = await User.findById(user.id).populate("favorites");

    if (!currentUser) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }
    
    console.log("Đã lấy dữ liệu từ BE")

    return res.status(200).json({
      error: false,
      message: "Favorites fetched successfully",
      favorites: currentUser.favorites,
    });

  } catch (error) {
    return res.status(500).json(error.message);
  }
});

// Remove a hotel from user's favorites
exports.removeFavoriteHotel = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { hotelId } = req.body;

  // Validate input
  if (!userId || !hotelId) {
    return res.status(400).json({
      error: true,
      message: "Missing required fields",
    });
  }

  // Check if the user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      error: true,
      message: "User not found",
    });
  }

  // Remove the hotel from favorites
  user.favorites = user.favorites.filter(
    (favoriteHotel) => favoriteHotel.toString() !== hotelId
  );

  await user.save();

  return res.status(200).json({
    error: false,
    message: "Hotel removed from favorites successfully",
    favorites: user.favorites,
  });
});
