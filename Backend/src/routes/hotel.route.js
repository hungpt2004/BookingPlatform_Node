const express = require("express");
const router = express.Router();
const HotelRouter = express.Router();
const HotelController = require("../controllers/hotel.controller");
const {
  restrictTo,
  protect,
} = require("../controllers/authenticate.controller");
const CloudinaryZipFile = require("../utils/uploadToCloudinary");

//GET
HotelRouter.get("/get-all-hotel", HotelController.getAllHotels); //customer
HotelRouter.get("/get-owned-hotel", protect, restrictTo("OWNER"), HotelController.getOwnedHotels); //owned
HotelRouter.get("/get-owner-hotel/:ownerId", HotelController.getOwnerHotels);

HotelRouter.get(
  "/total/:hotelId",
  HotelController.getTotalReservationByHotelId
);

HotelRouter.get(
  "/get-hotel-detail/:hotelId",
  HotelController.getHotelDetailById
);
HotelRouter.get("/top-hotel", HotelController.getTopHotel);
HotelRouter.get("/get-images/:hotelId", protect, HotelController.getHotelImg);

//POST
HotelRouter.post("/create", protect, HotelController.createHotel);
HotelRouter.post(
  "/upload-documents",
  protect,
  HotelController.uploadAllDocuments
);
HotelRouter.post("/upload-images", protect, HotelController.uploadAllImages);
HotelRouter.post(
  "/add-img/:hotelId",
  protect,
  restrictTo("OWNER"),
  HotelController.addImg
);

//PUT
HotelRouter.put("/update/:hotelId", protect, HotelController.updateHotel);

//DELETE
HotelRouter.delete(
  "/delete-img/:hotelId",
  protect,
  restrictTo("OWNER"),
  HotelController.deleteImg
);
HotelRouter.delete("/delete/:hotelId", protect, HotelController.deleteHotel);

module.exports = HotelRouter;
