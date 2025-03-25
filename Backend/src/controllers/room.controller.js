const Room = require("../models/room.js");
const Hotel = require("../models/hotel.js");
const RoomFacility = require("../models/roomFacility.js");
const RoomAvailability = require('../models/roomAvailability.js')
const Reservation = require("../models/reservation.js");
const asyncHandler = require("../middlewares/asyncHandler.js");
const mongoose = require("mongoose");
const Bed = require("../models/bed.js");

exports.createRoom = asyncHandler(async (req, res) => {
  try {
    const { facilities, bed, ...rest } = req.body;
    console.log(req.body);

    // Validate facilities and bed types exist
    const validFacilities = await RoomFacility.find({ _id: { $in: facilities } });
    const validBeds = await Bed.find({ _id: { $in: bed.map(b => b.bed) } });

    if (validFacilities.length !== facilities.length) {
      return res.status(400).json({ error: true, message: "Invalid facilities provided" });
    }

    if (validBeds.length !== bed.length) {
      return res.status(400).json({ error: true, message: "Invalid bed types provided" });
    }

    const newRoom = new Room({
      ...rest,
      facilities,
      bed,
      hotel: req.params.hotelId
    });

    const savedRoom = await newRoom.save();

    // Update hotel's rooms array
    await Hotel.findByIdAndUpdate(
      req.params.hotelId,
      { $push: { rooms: savedRoom._id } },
      { new: true }
    );

    return res.status(201).json({
      error: false,
      message: "Room created successfully",
      room: savedRoom
    });
  } catch (error) {
    console.error("Error in createRoom:", error);
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// Update Room
exports.updateRoom = asyncHandler(async (req, res) => {
  try {
    const { roomId } = req.params;
    const { name, type, capacity, price, quantity, bed, facilities } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

      // Update room
      console.log(req.body);
      const updatedRoom = await Room.findByIdAndUpdate(
        roomId,
        {
          $set: {
            name,
            type,
            capacity,
            price,
            quantity,
            bed: bed.map(b => ({
              bed: b.bed,
              quantity: b.quantity
            })),
            facilities
          }
        },
        { new: true, session }
      )

      if (!updatedRoom) {
        await session.abortTransaction();
        return res.status(404).json({ error: true, message: "Room not found" });
      }

      await session.commitTransaction();
      res.status(200).json({
        error: false,
        message: "Room updated successfully",
        room: updatedRoom
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: true, message: "Failed to update room" });
  }
});

// Delete Room
exports.deleteRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  try {
    // Delete room
    const deletedRoom = await Room.findByIdAndDelete(roomId);

    if (!deletedRoom) {
      return res.status(404).json({ error: true, message: "Room not found" });
    }

    res.status(200).json({
      error: false,
      message: "Room deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: true, message: "Failed to delete room" });
  }
});


exports.getRoomById = asyncHandler(async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId)
      .populate('facilities', 'name description')

    if (!room) {
      return res.status(404).json({ error: true, message: "Room not found" });
    }

    return res.status(200).json({
      error: false,
      room
    });
  } catch (error) {
    console.error("Error in getRoomById:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});

exports.getAllRoom = asyncHandler(async (req, res) => {
  try {
    const rooms = await Room.find();

    if (rooms.length === 0) {
      return res.status(404).json({ error: true, message: "No rooms found" });
    }

    return res.status(200).json({
      error: false,
      rooms,
      message: "Get all rooms success",
    });
  } catch (error) {
    console.error("Error in getAllRoom:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});

exports.getRoomByHotelIdOwner = asyncHandler(async (req, res) => {
  try {
    const { hotelId } = req.params;

    if (!hotelId) {
      return res.status(400).json({ error: true, message: "Hotel ID is required" });
    }
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: true, message: "Hotel not found" });
    }
    const rooms = await Room.find({ hotel: hotelId });

    return res.status(200).json({
      error: false,
      rooms,
      message: "Rooms fetched successfully",
    });
  } catch (error) {
    console.error("Error in getRoomByHotelId:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

exports.getRoomAvailability = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;
  const { checkInDate, checkOutDate, page = 1, limit = 10 } = req.query;

  // Validate inputs
  if (!hotelId || !checkInDate || !checkOutDate) {
    return res.status(400).json({
      error: true,
      message: "Missing required fields (hotelId, checkInDate, or checkOutDate).",
    });
  }

  try {
    const selectedCheckIn = new Date(checkInDate);
    const selectedCheckOut = new Date(checkOutDate);
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch overlapping reservations
    const overlappingReservations = await Reservation.find({
      hotel: hotelId,
      status: { $nin: ["CANCELLED", "COMPLETED"] },
      $and: [
        { checkInDate: { $lt: selectedCheckOut } },
        { checkOutDate: { $gt: selectedCheckIn } },
      ],
    }).populate("rooms.room");

    // Get all rooms for this hotel
    const allRooms = await Room.find({ hotel: hotelId });

    // Calculate total booked quantity per room
    const roomBookedQuantities = {};
    overlappingReservations.forEach(res => {
      res.rooms.forEach(roomItem => {
        const roomId = roomItem.room._id.toString();
        const quantity = roomItem.quantity;
        roomBookedQuantities[roomId] = (roomBookedQuantities[roomId] || 0) + quantity;
      });
    });

    // Determine available rooms with remaining quantity
    const availableRooms = allRooms
      .map(room => {
        const booked = roomBookedQuantities[room._id.toString()] || 0;
        const available = room.quantity - booked;
        return {
          ...room.toObject(),
          availableQuantity: available,
        };
      })
      .filter(room => room.availableQuantity > 0);

    // Apply pagination
    const paginatedRooms = availableRooms.slice(skip, skip + limitNumber);
    const totalRooms = availableRooms.length;
    const totalPages = Math.ceil(totalRooms / limitNumber);

    return res.status(200).json({
      error: false,
      message: "Rooms fetched successfully",
      rooms: paginatedRooms,
      totalRooms,
      totalPages,
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching room availability:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

exports.getRoomByHotelId = asyncHandler(async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { checkInDate, checkOutDate } = req.query;

    if (!hotelId) {
      return res.status(400).json({
        error: true,
        message: "Missing required hotelId",
      });
    }

    // Tìm tất cả các phòng thuộc khách sạn
    const rooms = await Room.find({ hotel: hotelId }).populate("hotel");

    if (rooms.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No rooms found for this hotel",
      });
    }

    // Nếu không có check-in/check-out date, trả về danh sách phòng bình thường
    if (!checkInDate || !checkOutDate) {
      return res.status(200).json({
        error: false,
        message: "Rooms fetched successfully",
        rooms,
      });
    }

    // Đưa ngày từ String sang kiểu Date
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    console.log(`Ngay check in : ${checkInDate}`)
    console.log(`Ngay check out: ${checkOutDate}`)

    if (checkIn >= checkOut) {
      return res.status(400).json({
        error: true,
        message: "Check-in date must be before check-out date",
      });
    }

    // Lấy dữ liệu từ RoomAvailability trong khoảng ngày đặt
    const roomAvailabilities = await RoomAvailability.find({
      date: { $gte: checkIn, $lte: checkOut }, // Lọc theo ngày đặt phòng
    });

    // Tạo object lưu số lượng phòng còn trống theo từng ngày
    const roomAvailabilityMap = {};

    rooms.forEach((room) => {
      roomAvailabilityMap[room._id.toString()] = {};
    });

    // Cập nhật số phòng đã đặt theo từng ngày
    roomAvailabilities.forEach((availability) => {
      const roomId = availability.room.toString();
      if (roomAvailabilityMap[roomId]) {
        roomAvailabilityMap[roomId][availability.date.toISOString()] = availability.bookedQuantity;
      }
    });

    // Tính số lượng phòng trống thấp nhất trong khoảng thời gian đặt
    const availableRooms = rooms.map((room) => {
      const roomId = room._id.toString();
      let minAvailable = room.quantity;

      for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString();
        const bookedQuantity = roomAvailabilityMap[roomId][dateKey] || 0;
        const availableForDate = room.quantity - bookedQuantity;
        minAvailable = Math.min(minAvailable, availableForDate);
      }

      return {
        _id: room._id,
        type: room.type,
        quantity: Math.max(minAvailable, 0), // Tránh số âm
        capacity: room.capacity,
        price: room.price,
        description: room.description,
        images: room.images,
      };
    });

    return res.status(200).json({
      error: false,
      message: "Rooms fetched successfully",
      rooms: availableRooms,
    });
  } catch (error) {
    console.error("Error in getRoomByHotelId:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

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
    url,
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

exports.getRoomById = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({
      error: true,
      message: "Missing required roomId",
    });
  }

  const room = await Room.findById(roomId)
    .populate('facilities');

  if (!room) {
    return res.status(404).json({
      error: true,
      message: "Room not found",
    });
  }

  return res.status(200).json({
    error: false,
    message: "Room fetched successfully",
    room,
  });
}
);

exports.filterRoomAvailability = async (req, res) => {
  const { hotelId } = req.params;
  const { checkInDate, checkOutDate } = req.query;

  if (!hotelId || !checkInDate || !checkOutDate) {
    return res.status(400).json({
      error: true,
      message: "Missing required fields (hotelId, checkInDate, or checkOutDate).",
    });
  }

  try {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({
        error: true,
        message: "Check-in date must be before check-out date",
      });
    }

    // Find all rooms for the hotel
    const rooms = await Room.find({ hotel: hotelId });

    // Find reservations that overlap with the selected dates
    const overlappingReservations = await Reservation.find({
      hotel: hotelId,
      status: { $nin: ["CANCELLED", "COMPLETED"] },
      $and: [
        { checkInDate: { $lt: checkOut } },
        { checkOutDate: { $gt: checkIn } },
      ],
    }).populate("rooms.room");

    // Create a map to track booked quantities for each room
    const bookedQuantitiesMap = {};

    // Calculate booked quantities for each room
    overlappingReservations.forEach(reservation => {
      reservation.rooms.forEach(reservedRoom => {
        const roomId = reservedRoom.room._id.toString();
        if (!bookedQuantitiesMap[roomId]) {
          bookedQuantitiesMap[roomId] = 0;
        }
        bookedQuantitiesMap[roomId] += reservedRoom.quantity;
      });
    });

    // Calculate available rooms
    const availableRooms = rooms.map(room => {
      const roomId = room._id.toString();
      const bookedQuantity = bookedQuantitiesMap[roomId] || 0;
      const availableQuantity = Math.max(room.quantity - bookedQuantity, 0);

      return {
        ...room.toObject(),
        availableQuantity,
        bookedQuantity,
        isFullyBooked: availableQuantity === 0
      };
    });

    return res.status(200).json({
      error: false,
      message: "Room availability fetched successfully",
      rooms: availableRooms
    });
  } catch (error) {
    console.error("Error fetching room availability:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};