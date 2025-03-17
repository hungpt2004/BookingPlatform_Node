const express = require('express');
const RoomFacilityRouter = express.Router();
const RoomFacilityController = require('../controllers/roomFacility.controller')


RoomFacilityRouter.get('/roomFacility', RoomFacilityController.getAllHotelFacilities)
RoomFacilityRouter.get('/roomFacility-by-name', RoomFacilityController.getAllHotelFacilitiesSortByName)

module.exports = RoomFacilityRouter;