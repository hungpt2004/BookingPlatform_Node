const express = require('express');
const RoomRouter = express.Router();
const RoomController = require('../controllers/room.controller');
const { protect } = require('../controllers/authenticate.controller');


RoomRouter.post("/create-room/:hotelId", RoomController.createRoom);
RoomRouter.get("/get-all-room", RoomController.getAllRoom);
RoomRouter.get("/get-room-by-hotel/:hotelId", RoomController.getRoomByHotelId);
RoomRouter.post("/create-facility/:roomId", RoomController.createRoomFacility);
RoomRouter.get("/get-facility/:roomId", RoomController.getRoomFacilitiesByRoomId);
RoomRouter.get("/get-room-owner/:hotelId", RoomController.getRoomByHotelIdOwner);
RoomRouter.get("/get-room-availability/:hotelId", RoomController.getRoomAvailability);
RoomRouter.get("/filter-room-availability/:hotelId", RoomController.filterRoomAvailability);
RoomRouter.get("/get-room-by-id/:roomId", RoomController.getRoomById);

RoomRouter.put('/update/:roomId', protect, RoomController.updateRoom);
RoomRouter.delete('/delete/:roomId', RoomController.deleteRoom);


module.exports = RoomRouter;