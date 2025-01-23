const express = require('express');
const HotelRouter = express.Router();
const HotelController = require('../controllers/hotel.controller')

HotelRouter.get("/get-all-hotel", HotelController.getAllHotels);

module.exports = HotelRouter;