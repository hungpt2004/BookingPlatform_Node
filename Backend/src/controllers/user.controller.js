const asyncHandler = require('../middlewares/asyncHandler')
const User = require('../models/user')
const { AUTH } = require('../utils/constantMessage')

exports.getAllUser = asyncHandler(async (req, res) => {

   const users = await User.find().sort({createOn:-1});

   if(users.length === 0) {
      return res.status(404).json({
         error: true,
         message: AUTH.USER_NOT_FOUND
      });
   }

   return res.status(200).json({
      error: false,
      users,
      message: AUTH.GET_SUCCESS
   })

})

exports.getCurrentUser = asyncHandler(async(req, res) => {

   const user = req.user;


   if(!user){
      return res.status(403).json({
         error: true, 
         message: AUTH.INVALID_TOKEN
      })
   }

   return res.status(200).json({
      error: false,
      user,
      messsage: AUTH.GET_SUCCESS
   })

})
