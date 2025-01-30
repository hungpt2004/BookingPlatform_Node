const asyncHandler = require('../middlewares/asyncHandler')
const User = require('../models/user')
const Hotel = require('../models/hotel')

exports.getAllUser = asyncHandler(async (req, res) => {

   const users = await User.find().sort({ createOn: -1 });

   if (users.length === 0) {
      return res.status(404).json({
         error: true,
         message: "No users found"
      });
   }

   return res.status(200).json({
      error: false,
      users,
      message: "Get all user success"
   })

})

exports.createUser = asyncHandler(async (req, res) => {
   const { name, email, password, cmnd, role } = req.body;

   // Validate input
   if (!name || !email || !password || !cmnd || !role) {
      return res.status(400).json({
         error: true,
         message: "Missing required fields"
      });
   }

   // Check if user exists
   const existUser = await User.findOne({ email });

   if (existUser) {
      return res.status(400).json({
         error: true,
         message: "Email already exists",
      })
   }

   const user = new User({
      name,
      email,
      password,
      cmnd,
      role: role,
   })

   await user.save();

   return res.status(200).json({
      error: false,
      message: "User created successfully",
      user: {
         id: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
         cmnd: user.cmnd,
         createOn: user.createOn,
      }
   })
})

// Add a hotel to user's favorites
exports.addFavoriteHotel = asyncHandler(async (req, res) => {
   const { userId, hotelId } = req.body;

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
   const { userId } = req.params;

   console.log(userId);
   // Validate input
   if (!userId) {
      return res.status(400).json({
         error: true,
         message: "Missing required userId",
      });
   }

   // Check if the user exists
   const user = await User.findById(userId).populate("favorites");
   if (!user) {
      return res.status(404).json({
         error: true,
         message: "User not found",
      });
   }

   return res.status(200).json({
      error: false,
      message: "Favorites fetched successfully",
      favorites: user.favorites,
   });
});


// Remove a hotel from user's favorites
exports.removeFavoriteHotel = asyncHandler(async (req, res) => {
   const { userId, hotelId } = req.body;

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
