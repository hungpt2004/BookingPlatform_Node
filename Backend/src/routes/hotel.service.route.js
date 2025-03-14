const express = require("express");
const HotelServiceRouter = express.Router();
const HotelServiceController = require("../controllers/hotel.service.controller");

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
  HotelServiceController.createHotelService
);

HotelServiceRouter.patch(
  "/update-hotel-service/:hotelServiceId",
  HotelServiceController.updateHotelService
);

HotelServiceRouter.delete(
  "/delete-hotel-service/:hotelServiceId",
  HotelServiceController.deleteHotelService
);

module.exports = HotelServiceRouter;
