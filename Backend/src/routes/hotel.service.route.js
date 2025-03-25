const express = require("express");
const HotelServiceRouter = express.Router();
const HotelServiceController = require("../controllers/hotel.service.controller");
const authController = require("../controllers/authenticate.controller");
const router = express.Router();

// Áp dụng middleware bảo vệ cho tất cả các route trong router này
router.use(authController.protect);

HotelServiceRouter.get(
  "/get-all-hotel-services",
  HotelServiceController.getAllHotelServices
);

HotelServiceRouter.get(
  "/get-all-hotel-services/:hotelId",
  HotelServiceController.getAllHotelServicesByHotelId
);

HotelServiceRouter.get(
  "/get-hotel-service/:hotelServiceId",
  HotelServiceController.getHotelServiceById
);

HotelServiceRouter.post(
  "/create-hotel-service/:hotelId",
  authController.protect,
  authController.restrictTo("OWNER"),
  HotelServiceController.createHotelService
);

HotelServiceRouter.patch(
  "/update-hotel-service/:hotelServiceId",
  authController.protect,
  authController.restrictTo("OWNER"),
  HotelServiceController.updateHotelService
);

HotelServiceRouter.delete(
  "/delete-hotel-service/:hotelServiceId",
  authController.protect,
  authController.restrictTo("OWNER"),
  HotelServiceController.deleteHotelService
);

module.exports = HotelServiceRouter;
