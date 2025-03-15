const express = require("express");
const router = express.Router();
const HotelFacilityRouter = express.Router();
const HotelFacilityController = require("../controllers/hotelFacility.controller");
const { restrictTo, protect } = require("../controllers/authenticate.controller");

HotelFacilityRouter.get("/get-hotelfacilities", HotelFacilityController.getAllHotelFacilities);
HotelFacilityRouter.post("/create-hotelfacility", HotelFacilityController.createHotelFacility);
module.exports = HotelFacilityRouter;