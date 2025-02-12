const asyncHandler = require("../middlewares/asyncHandler");
const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Bed = require("../models/bed");
const { AUTH, GENERAL, HOTEL } = require("../utils/constantMessage");

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
    Room.find({ hotel: hotelId }).populate("beds.bed"),
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
