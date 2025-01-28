const express = require('express');

const HotelRouter = express.Router();
const HotelController = require('../controllers/hotelController');

HotelRouter.get('/get-all-hotel', HotelController.getAllHotels);

module.exports = HotelRouter;
