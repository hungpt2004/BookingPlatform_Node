const catchAsync = require("../utils/catchAsync.js");
const User = require("../models/user");
const Hotel = require("../models/hotel");
const HotelService = require("../models/hotelService.js");
require("dotenv").config();


// Get all hotel services
exports.getAllHotelServices = catchAsync(async (req, res) => {
  const hotelServices = await HotelService.find();

  if (hotelServices.length === 0) {
    return res.status(404).json({
      message: "No hotel services found",
      error: true,
    });
  }

  return res.status(200).json({
    message: "Get all hotel services success",
    error: false,
    hotelServices,
  });
});

exports.getAllHotelServicesByHotelId = catchAsync(async (req, res) => {

  const { hotelId } = req.params;

  if (!hotelId) {
    return res.status(404).json({
      message: "Bad request",
      error: true,
    });
  }

  const hotelServices = await Hotel.findOne({ _id: hotelId }).populate('services');

  if (hotelServices.length === 0) {
    return res.status(404).json({
      message: "No hotel services found",
      error: true,
    });
  }

  return res.status(200).json({
    message: "Get all hotel services success",
    error: false,
    hotelServices,
  });
});

exports.getHotelServiceById = catchAsync(async (req, res) => {
  const { hotelServiceId } = req.params;

  if (!hotelServiceId) {
    return res.status(404).json({
      message: "Bad request",
      error: true,
    });
  }

  const hotelService = await HotelService.findOne({ _id: hotelServiceId });

  if (!hotelService) {
    return res.status(404).json({
      message: "No hotel service found",
      error: true,
    });
  }

  return res.status(200).json({
    error: false,
    message: "Get hotel service success",
    hotelService,
  });
});

exports.createHotelService = catchAsync(async (req, res) => {
  const { hotelId } = req.params;
  const { name, description, price } = req.body;

  if (!hotelId || !name || !description || !price) {
    return res.status(400).json({
      message: "Bad request",
      error: true,
    });
  }

  const hotel = await Hotel.findOne({ _id: hotelId });

  if (!hotel) {
    return res.status(404).json({
      message: "Hotel not found",
      error: true,
    });
  }

  const newHotelService = new HotelService({
    hotel: hotelId,
    name,
    description,
    price,
  });

  await newHotelService.save();

  return res.status(200).json({
    message: "Create hotel service success",
    error: false,
  });
});

exports.updateHotelService = catchAsync(async (req, res) => {
  const { hotelServiceId } = req.params;
  const { name, description, price } = req.body;

  if (!hotelServiceId || !name || !description || !price) {
    return res.status(400).json({
      message: "Bad request",
      error: true,
    });
  }

  const hotelService = await HotelService.findOne({ _id: hotelServiceId });

  if (!hotelService) {
    return res.status(404).json({
      message: "Hotel service not found",
      error: true,
    });
  }

  hotelService.name = name;
  hotelService.description = description;
  hotelService.price = price;

  await hotelService.save();

  console.log("Update service success")

  return res.status(200).json({
    message: "Update hotel service success",
    error: false,
    hotelService, // Return the updated service object
  });
});

exports.deleteHotelService = catchAsync(async (req, res) => {
  const { hotelServiceId } = req.params;

  if (!hotelServiceId) {
    return res.status(400).json({
      error: true,
      message: "Bad request: hotelServiceId is required",
    });
  }

  const hotelService = await HotelService.findByIdAndDelete(hotelServiceId);

  if (!hotelService) {
    return res.status(404).json({
      error: true,
      message: "Hotel service not found",
    });
  }

  return res.status(200).json({
    error: false,
    message: "Hotel service deleted successfully",
  });
});
