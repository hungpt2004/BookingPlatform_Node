const express = require('express');
const router = express.Router();
const HotelRouter = express.Router();
const HotelController = require('../controllers/hotel.controller');
const { restrictTo, protect } = require('../controllers/authenticate.controller');
const authController = require('./../controllers/authenticate.controller');
const { authenticateToken } = require('../utils/authenticateToken');
router.use(authController.protect);

HotelRouter.get("/get-all-hotel", HotelController.getAllHotels); //customer
HotelRouter.get("/get-owned-hotel", protect, HotelController.getOwnedHotels) //owned
HotelRouter.post("/upload-image/:id", authenticateToken, HotelController.uploadImage); //owned
module.exports = HotelRouter;