const asyncHandler = require('../middlewares/asyncHandler')
const User = require('../models/user')

exports.getAllUser = asyncHandler(async (req, res) => {

   const users = await User.find().sort({createOn:-1});

   if(users.length === 0) {
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