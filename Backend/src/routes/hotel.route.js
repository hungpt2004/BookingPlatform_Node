const express = require('express');
const HotelRouter = express.Router();
const HotelController = require('../controllers/hotel.controller')

HotelRouter.get("/get-all-hotel", HotelController.getAllHotels);
// HotelRouter.post("/create-hotel", HotelController.createHotel);

module.exports = HotelRouter;