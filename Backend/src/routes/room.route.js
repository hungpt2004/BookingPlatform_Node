const express = require('express');
const RoomRouter = express.Router();
const RoomController = require('../controllers/room.controller')


RoomRouter.post("/create-room/:hotelId", RoomController.createRoom);
RoomRouter.get("/get-all-room", RoomController.getAllRoom);
RoomRouter.get("/get-room-by-hotel/:hotelId", RoomController.getRoomByHotelId);
RoomRouter.post("/create-facility/:roomId", RoomController.createRoomFacility);
RoomRouter.get("/get-facility/:roomId", RoomController.getRoomFacilitiesByRoomId);
RoomRouter.get("/get-room-by-id/:roomId", RoomController.getRoomById);

module.exports = RoomRouter;