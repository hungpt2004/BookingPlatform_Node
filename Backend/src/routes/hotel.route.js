const express = require("express");
const router = express.Router();
const HotelRouter = express.Router();
const HotelController = require("../controllers/hotel.controller");
const {
  restrictTo,
  protect,
} = require("../controllers/authenticate.controller");
const CloudinaryZipFile =require("../utils/uploadToCloudinary")


HotelRouter.get("/get-all-hotel", HotelController.getAllHotels); //customer
HotelRouter.get("/get-owned-hotel", protect, HotelController.getOwnedHotels); //owned

HotelRouter.get(
  "/total/:hotelId",
  HotelController.getTotalReservationByHotelId
);

HotelRouter.get(
  "/get-hotel-detail/:hotelId",
  HotelController.getHotelDetailById
);

HotelRouter.get("/top-hotel", HotelController.getTopHotel);
HotelRouter.post("/create", protect, HotelController.createHotel);
HotelRouter.post("/upload-documents", protect, HotelController.uploadAllDocuments);
HotelRouter.post("/upload-images", protect, HotelController.uploadAllImages);
module.exports = HotelRouter;
