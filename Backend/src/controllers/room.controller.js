const Room = require("../models/room.js");
const Hotel = require("../models/hotel.js");
const RoomFacility = require("../models/roomFacility.js");
const RoomAvailability = require('../models/roomAvailability.js')
const Reservation = require("../models/reservation.js");
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
        hotel: hotelId
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
  const { checkInDate, checkOutDate } = req.query;

  if (!hotelId || !checkInDate || !checkOutDate) {
    return res.status(400).json({
      error: true,
      message: "Missing required fields (hotelId, checkInDate, or checkOutDate).",
    });
  }

  try {
    const selectedCheckIn = new Date(checkInDate);
    const selectedCheckOut = new Date(checkOutDate);
    const overlappingReservations = await Reservation.find({
      hotel: hotelId,
      status: { $nin: ["CANCELLED", "COMPLETED"] },
      $and: [
        { checkInDate: { $lt: selectedCheckOut } },
        { checkOutDate: { $gt: selectedCheckIn } },
      ],
    }).populate("rooms");
    const allRooms = await Room.find({ hotel: hotelId });
    const bookedRoomIds = overlappingReservations
      .flatMap(res => res.rooms)
      .map(room => room._id.toString());
    const availableRooms = allRooms.filter(
      room => !bookedRoomIds.includes(room._id.toString())
    );

    return res.status(200).json({
      error: false,
      message: "Rooms fetched successfully",
      rooms: availableRooms,
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
