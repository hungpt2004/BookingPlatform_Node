require("dotenv").config();
const PayOs = require("@payos/node");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/user");
const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Reservation = require("../models/reservation");

exports.createBooking = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { hotelId, roomId, checkInDate, checkOutDate } = req.body;

  try {
    // Validate required fields
    if (!userId || !hotelId || !roomId || !checkInDate || !checkOutDate) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required fields" });
    }

    // Validate that the hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: true, message: "Hotel not found" });
    }

    // Validate that the rooms exist, belong to the hotel, and have quantity > 0
    const rooms = await Room.find({
      _id: { $in: roomId },
      hotel: hotelId,
      quantity: { $gt: 0 },
    });

    // // Validate that the rooms exist and belong to the hotel
    // const rooms = await Room.find({ _id: { $in: roomId }, hotel: hotelId });

    // console.log(rooms.length, roomId.length);
    if (rooms.length !== roomId.length) {
      return res.status(404).json({
        error: true,
        message:
          "Some rooms were not found or do not belong to the specified hotel",
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate that the user already booked the room
    const userBooked = await Reservation.find({
      hotel: hotelId,
      user: userId,
      status: { $nin: ["CANCELLED", "COMPLETED", "CHECKED_OUT", "CHECKED_IN"] },
    })
      .populate("rooms")
      .select("rooms");

    // Extract room names from the populated result
    if (userBooked.length > 0) {
      console.log("userId", userId);
      console.log("userBooked", userBooked);

      const bookedRoomNames = userBooked
        .flatMap((reservation) => reservation.rooms)
        .map((room) => room.type);

      console.log("bookedRoomNames", bookedRoomNames);

      // Remove duplicates
      const uniqueNames = [...new Set(bookedRoomNames)];

      return res.status(400).json({
        error: true,
        message: `You already booked this room: ${uniqueNames.join(", ")}`,
      });
    }

    // Check for existing reservations that overlap dates for room or rooms
    const overlapReservations = await Reservation.find({
      rooms: { $in: roomId },
      status: { $nin: ["CANCELLED", "COMPLETED", "CHECKED_OUT"] },
      $or: [
        { checkInDate: { $lte: checkOut }, checkOutDate: { $gte: checkIn } },
      ],
    }).populate("rooms");

    // If overlapping reservations exist return error message
    if (overlapReservations.length > 0) {
      const conflictRooms = overlapReservations
        .flatMap((res) => res.rooms)
        .filter((room) => roomId.includes(room._id.toString()))
        .map((room) => room.type);

      const uniqueNames = [...new Set(conflictRooms)];

      return res.status(409).json({
        error: true,
        message: `Room(s) ${uniqueNames.join(
          ", "
        )} are already booked during these dates.`,
      });
    }

    // Calculate the total price based on room prices and duration
    const roomPrices = rooms.map((room) => room.price);
    const nights =
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
    const totalPrice =
      roomPrices.reduce((sum, price) => sum + price, 0) * nights;

    // Create the reservation
    const reservation = new Reservation({
      user: userId,
      hotel: hotelId,
      rooms: roomId,
      checkInDate,
      checkOutDate,
      totalPrice,
      status: "NOT PAID", // Default status
    });

    // // Save the reservation to the database
    // await reservation.save();

    // // Decrement the quantity of the booked rooms
    // for (const room of rooms) {
    //     room.quantity -= 1;
    //     await room.save();
    // }

    res.status(201).json({
      error: false,
      message: "Reservation created successfully",
      reservation,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: true, message: "Failed to create reservation" });
  }
});

const payOs = new PayOs(
  process.env.CLIENT_ID,
  process.env.API_KEY,
  process.env.CHECKSUM_KEY
);

exports.createPaymentLink = asyncHandler(async (req, res) => {
  //user
  const currentUser = req.user;

  const { amount, rooms, hotelId, roomIds } = req.body;

  const currentReservation = await Reservation.findOne({ hotel: hotelId });

  const totalReservation = await Reservation.find({
    hotel: hotelId,
  }).countDocuments();

  console.log(roomIds);

  console.log(totalReservation);

  const newOrder = {
    orderCode: Date.now(),
    amount: amount,
    items: rooms.map((room) => ({
      name: String(room.name || "Unknown"),
      price: Number(room.price) || 0,
      quantity: Number(room.quantity) || 1,
    })),
    buyerName: currentUser.name,
    buyerEmail: currentUser.email,
    buyerPhone: currentUser.phone,
    returnUrl: `${process.env.DOMAIN_URL}/success`,
    cancelUrl: `${process.env.DOMAIN_URL}/cancel`,
    description: `${currentReservation._id}`.slice(0, 25), // ✅ Ensure max 25 chars
  };

  //Lay tong so phong
  //    const totalRoom = await Room.find({hotel: hotelId}).countDocuments();

  //    const getCurrentRoom = await Room.findOne({_id: roomId})

  //Remove quantity
  //    for ( var s in selectedRooms ) {

  //    }

  //Update status reservation to BOOKED
  //    await Reservation.updateOne(
  //     {_id: currentReservation._id},
  //     {$set: { status: 'BOOKED' }}
  //    )

  //    //Save reservation
  //    currentReservation.save();

  var listRoomSelected = [];
  for (r in roomIds) {
    var roomSelected = await Room.findOne({ _id: r.id });
    listRoomSelected.push(roomSelected);
  }

  console.log(`Danh sanh object phong duoc chon: ${listRoomSelected}`);

  const paymentLink = await payOs.createPaymentLink(newOrder);
  res.json({ checkoutUrl: paymentLink.checkoutUrl });
});
