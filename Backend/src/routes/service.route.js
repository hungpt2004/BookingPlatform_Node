const express = require("express");
const ServiceRouter = express.Router();
const ServiceController = require("../controllers/service.controller");

ServiceRouter.get("/get-all-services", ServiceController.getAllHotelServices);
ServiceRouter.get("/get-all-services-sort-by-name", ServiceController.getAllHotelServicesSortByName);

module.exports = ServiceRouter;