const Room = require("../models/room.js");
const Hotel = require("../models/hotel.js");
const RoomFacility = require("../models/roomFacility");
const asyncHandler = require("../middlewares/asyncHandler.js");

exports.createRoom = asyncHandler(async (req, res, next) => {
    const hotelId = req.params.hotelId;

    // Validate if hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
        return next(createError(404, "Hotel not found"));
    }
    // Create and save the room
    const newRoom = new Room({
        ...req.body,
        hotel: hotelId // Add the hotel reference explicitly
    });

    const savedRoom = await newRoom.save();

    res.status(200).json({
        error: false,
        message: "Room created successfully",
        room: savedRoom,
    });

});

exports.getAllRoom = asyncHandler(async (req, res, next) => {
    const rooms = await Room.find();

    if (rooms.length === 0) {
        return next(createError(404, "No rooms found"));
    }

    res.status(200).json({
        error: false,
        rooms,
        message: "Get all rooms success",
    });
}
);

exports.getRoomByHotelId = asyncHandler(async (req, res, next) => {
    const { hotelId } = req.params;

    if (!hotelId) {
        return res.status(400).json({
            error: true,
            message: "Missing required hotelId",
        });
    }

    // Find room related to hotelId
    const rooms = await Room.find({ hotel: hotelId }).populate('hotel');

    //Tong so room capacity * quantity

    if (rooms.length === 0) {
        return res.status(404).json({
            error: true,
            message: "No rooms found for this hotel",
        });
    }

    return res.status(200).json({
        error: false,
        message: "Rooms fetched successfully",
        rooms,
    });
});

// Create a room facility
exports.createRoomFacility = asyncHandler(async (req, res) => {
    const { roomId } = req.params; // Get the room ID from the request
    const { name, description, url, unavailableDates } = req.body;

    // Validate inputs
    if (!roomId || !name || !url) {
        return res.status(400).json({
            error: true,
            message: "Missing required fields (roomId, name, or url).",
        });
    }

    // Check if the room exists
    const room = await Room.findById(roomId);
    if (!room) {
        return res.status(404).json({
            error: true,
            message: "Room not found.",
        });
    }

    // Create the room facility
    const roomFacility = new RoomFacility({
        room: roomId,
        name,
        description,
        url, // Assuming `url` is a Buffer; handle image uploads separately if needed
    });

    await roomFacility.save();

    // Update the room with the new facility reference
    room.facilities.push(roomFacility._id);
    await room.save();

    return res.status(201).json({
        error: false,
        message: "Room facility created successfully.",
        facility: roomFacility,
    });
});



exports.getRoomFacilitiesByRoomId = asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    if (!roomId) {
        return res.status(400).json({
            error: true,
            message: "Missing required roomId",
        });
    }

    // Find all facilities associated with the room
    const facilities = await RoomFacility.find({ room: roomId });

    if (facilities.length === 0) {
        return res.status(404).json({
            error: true,
            message: "No facilities found for this room",
        });
    }

    return res.status(200).json({
        error: false,
        message: "Facilities fetched successfully",
        facilities,
    });
});