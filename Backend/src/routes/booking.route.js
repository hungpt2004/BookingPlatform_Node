const express = require("express");
const BookingRouter = express.Router();
const authenticateToken = require("../utils/authenticateToken");
const BookingController = require("../controllers/booking.controller");
const {
    restrictTo,
    protect,
} = require("../controllers/authenticate.controller");
const authController = require("./../controllers/authenticate.controller");
const router = express.Router();

router.use(authController.protect);

BookingRouter.post("/create-booking", protect, BookingController.createBooking)

module.exports = BookingRouter;