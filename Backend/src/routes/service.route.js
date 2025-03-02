const express = require("express");
const ServiceRouter = express.Router();
const ServiceController = require("../controllers/service.controller");

ServiceRouter.get("/get-all-services", ServiceController.getAllHotelServices);
module.exports = ServiceRouter;