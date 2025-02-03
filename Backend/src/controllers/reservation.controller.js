const asyncHandler = require("../middlewares/asyncHandler.js");
const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Reservation = require("../models/reservation");
const cron = require("node-cron");

exports.createBooking = asyncHandler(async (req, res) => {
  const { userId, hotelId, roomId, checkInDate, checkOutDate } = req.body;

  try {
    // console.log(req.body);

    // Validate required fields
    if (!userId || !hotelId || !roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: true, message: "Missing required fields" });
    }

    // Validate that the hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: true, message: "Hotel not found" });
    }

    // Validate that the rooms exist and belong to the hotel
    const rooms = await Room.find({ _id: { $in: roomId }, hotel: hotelId });
    // console.log(rooms.length, roomId.length);
    if (rooms.length === 0) {
      return res.status(404).json({ error: true, message: "Some rooms were not found or do not belong to the specified hotel" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);


    // Validate that the user already booked the room
    const userBooked = await Reservation.find({
      rooms: { $in: roomId },
      hotel: hotelId,
      user: userId,
      status: { $nin: ["CANCELLED", "COMPLETED", "CHECKED_OUT"] },
    }).populate("rooms").select("rooms")


    // Extract room names from the populated result
    if (userBooked.length > 0) {
      console.log('userId', userId)
      console.log("userBooked", userBooked);

      const bookedRoomNames = userBooked
        .flatMap(reservation => reservation.rooms)
        .map(room => room.type);

      console.log("bookedRoomNames", bookedRoomNames);

      // Remove duplicates
      const uniqueNames = [...new Set(bookedRoomNames)];

      return res.status(400).json({
        error: true,
        message: `You already booked this room: ${uniqueNames.join(", ")}`
      });
    }

    // Check for existing reservations that overlap dates for room or rooms
    const overlapReservations = await Reservation.find({
      rooms: { $in: roomId },
      status: { $nin: ["CANCELLED", "COMPLETED", "CHECKED_OUT"] },
      $or: [
        { checkInDate: { $lte: checkOut }, checkOutDate: { $gte: checkIn } },
      ]
    }).populate("rooms");

    // If overlapping reservations exist return error message
    if (overlapReservations.length > 0) {
      const conflictRooms = overlapReservations
        .flatMap(res => res.rooms)
        .filter(room => roomId.includes(room._id.toString()))
        .map(room => room.type);

      const uniqueNames = [...new Set(conflictRooms)];

      return res.status(409).json({
        error: true,
        message: `Room(s) ${uniqueNames.join(", ")} are already booked during these dates.`
      })

    }

    // Calculate the total price based on room prices and duration
    const roomPrices = rooms.map((room) => room.price);
    const nights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
    const totalPrice = roomPrices.reduce((sum, price) => sum + price, 0) * nights;

    // Create the reservation
    const reservation = new Reservation({
      user: userId,
      hotel: hotelId,
      rooms: roomId,
      checkInDate,
      checkOutDate,
      totalPrice,
      status: "BOOKED", // Default status
    });

    // Save the reservation to the database
    await reservation.save();

    res.status(201).json({
      error: false,
      message: "Reservation created successfully",
      reservation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Failed to create reservation" });
  }
});


exports.getALlReservation = asyncHandler(async (req, res) => {
  //Get user
  //const user = req.user.user;

  //Get all reservation sort with total price increase
  //   const reservations = await Reservation.find({ user: user }).sort({
  //     totalPrice: -1,
  //   });

  const reservations = await Reservation.find();

  //   if (!user) {
  //     return res.status(500).json({
  //       error: true,
  //       message: "Authenticated user failed",
  //     });
  //   }

  console.log(reservations);

  if (reservations.length === 0) {
    return res.status(404).json({
      error: true,
      message: "No have any reservations",
    });
  }

  return res.status(200).json({
    error: false,
    reservations,
    message: "Get all reservations success",
  });
});

exports.getRoomByReservationId = asyncHandler(async (req, res) => {
  //user

  const { reservationId } = req.params;

  const reservation = await Reservation.findOne({
    _id: reservationId,
  }).populate("rooms");

  if (reservation.rooms.length === 0) {
    return res.status(404).json({
      error: true,
      message: "No have any rooms",
    });
  }

  return res.status(200).json({
    error: false,
    rooms: reservation.rooms,
    message: "Get all rooms success",
  });
});

exports.getHotelByReservationId = asyncHandler(async (req, res) => {
  //user

  const { reservationId } = req.params;

  const reservation = await Reservation.findOne({
    _id: reservationId,
  }).populate("hotel");

  console.log(reservation);

  if (!reservation) {
    return res.status(404).json({
      error: true,
      message: "Error when get hotel",
    });
  }

  return res.status(200).json({
    error: false,
    hotel: reservation.hotel,
    message: "Get hotel success",
  });
});

exports.getReservationByStatus = asyncHandler(async (req, res) => {
  //user

  const { status } = req.query;

  console.log(`This is ${status}`);

  if (!status) {
    return res.status(400).json({
      error: true,
      message: "Query parameter 'status' is required",
    });
  }

  let reservations = null;

  if (status === "ALL") {
    reservations = await Reservation.find();
    if (reservations.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No have any reservations",
      });
    }

    return res.status(200).json({
      error: false,
      reservations,
      message: "Get reservations by 'ALL' successfully",
    });
  }

  reservations = await Reservation.find({ status });

  //Need user id to verify

  if (reservations.length === 0) {
    return res.status(404).json({
      error: true,
      message: "No have any rooms",
    });
  }

  return res.status(200).json({
    error: false,
    reservations,
    message: `Get reservations by ${status} successfully`,
  });
});

//automatic update status of reservations
const autoUpdateReservationStatus = asyncHandler(async () => {
  const currentDate = new Date();

  const reservations = await Reservation.find();

  for (const r of reservations) {
    //1. Update from Booked to CheckIn
    if (currentDate < r.checkInDate) r.status = "CHECKED IN";

    //2. Update from CheckIn to CheckOut
    if (currentDate > r.checkOutDate) r.status = "CHECKED OUT";

    await Reservation.updateOne({ _id: r._id }, { $set: { status: r.status } });

    console.log(`Updated status for note ID ${r._id} to ${r.status}`);
  }
});

//setinterval auto run after each minutes
cron.schedule("* * * * *", () => {
  console.log("THIS FUNCTION AUTO UPDATE EVERY MINUTES");
  autoUpdateReservationStatus();
});
