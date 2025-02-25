const Room = require("../models/room.js");
const Hotel = require("../models/hotel.js");
const RoomFacility = require("../models/roomFacility");
const Reservation = require("../models/reservation.js");
const asyncHandler = require("../middlewares/asyncHandler.js");

exports.createRoom = asyncHandler(async (req, res, next) => {
    const { hotelId } = req.params;

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
    const { checkInDate, checkOutDate, numberOfPeople } = req.query;

    // Validate required parameters
    if (!hotelId) {
        return res.status(400).json({
            error: true,
            message: "Missing required hotelId",
        });
    }

    if (!checkInDate || !checkOutDate || !numberOfPeople) {
        return res.status(400).json({
            error: true,
            message: "Missing required query parameters: checkInDate, checkOutDate, or numberOfPeople",
        });
    }

    // Validate date format (optional but recommended)
    const isValidDate = (date) => !isNaN(new Date(date).getTime());
    if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) {
        return res.status(400).json({
            error: true,
            message: "Invalid date format. Please use ISO format (YYYY-MM-DD)",
        });
    }

    // Validate numberOfPeople is a positive number
    if (isNaN(numberOfPeople) || numberOfPeople <= 0) {
        return res.status(400).json({
            error: true,
            message: "Number of people must be a positive number",
        });
    }

    try {
        // Find rooms related to hotelId and filter based on availability
        const rooms = await Room.find({ hotel: hotelId }).populate('hotel');

        if (rooms.length === 0) {
            return res.status(404).json({
                error: true,
                message: "No rooms found for this hotel that meet the criteria",
            });
        }

        // Calculate total hotel capacity
        const totalHotelCapacity = rooms.reduce((total, room) => {
            return total + (room.capacity * room.quantity);
        }, 0);

        if (numberOfPeople > totalHotelCapacity) {
            return res.status(400).json({
                error: true,
                message: `Number of people: (${numberOfPeople}) exceeds the total hotel capacity (${totalHotelCapacity})`,
            })
        }

        // Additional filtering for availability for booking
        const availableRooms = await Promise.all(rooms.map(async (room) => {
            const bookings = await Reservation.find({
                room: room._id,
                $or: [
                    { checkInDate: { $lt: new Date(checkOutDate) } },
                    { checkOutDate: { $gt: new Date(checkInDate) } },
                ],
            });

            // Calculate available quantity
            const bookedQuantity = bookings.reduce((sum, booking) => sum + booking.quantity, 0);
            const availableQuantity = room.quantity - bookedQuantity;

            return {
                ...room.toObject(),
                availableQuantity,
            };
        }));

        // Filter out rooms with no availability
        const filteredRooms = availableRooms.filter(room => room.availableQuantity > 0);

        return res.status(200).json({
            error: false,
            message: "Rooms fetched successfully",
            rooms: filteredRooms,
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
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