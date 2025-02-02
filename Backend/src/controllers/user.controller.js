// const asyncHandler = require('../middlewares/asyncHandler')
// const User = require('../models/user')

// exports.getAllUser = asyncHandler(async (req, res) => {

//    const users = await User.find().sort({createOn:-1});

//    if(users.length === 0) {
//       return res.status(404).json({
//          error: true,
//          message: "No users found"
//       });
//    }

//    return res.status(200).json({
//       error: false,
//       users,
//       message: "Get all user success"
//    })

// })

const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
