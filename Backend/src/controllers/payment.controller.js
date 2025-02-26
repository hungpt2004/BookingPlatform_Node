require("dotenv").config();
const PayOs = require("@payos/node");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/user");
const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Reservation = require("../models/reservation");
const { PAYMENT, RESERVATION } = require("../utils/constantMessage");
const mongoose = require("mongoose");

exports.createBooking = asyncHandler(async (req, res) => {
  const user = req.user;

  const { hotelId, roomIds, checkInDate, checkOutDate, roomDetails, totalPrice } = req.body;

  try {
    // Validate required fields
    if (!user.id || !hotelId || !roomIds || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: true, message: "Missing required fields" });
    }

    console.log("===== Received Booking Request =====");
    console.log("User ID:", user.id);
    console.log("hotelId received:", hotelId);
    console.log("roomIds received:", roomIds);
    console.log("checkInDate received:", checkInDate);
    console.log("checkOutDate received:", checkOutDate);
    console.log("roomDetails received:", roomDetails[0].roomId);
    console.log("=====================================");

    var roomsData = roomIds.map((item, index) => {
      return (
        console.log(item.roomId)
      )
    })


    // // Convert roomIds to ObjectId array
    const roomObjectIds = roomIds.map((id) => new mongoose.Types.ObjectId(id.roomId));

    // // Validate that the hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: true, message: "Hotel not found" });
    }

    // // Validate that the rooms exist, belong to the hotel, and have quantity > 0
    const rooms = await Room.find({
      _id: { $in: roomObjectIds },
      hotel: hotelId,
      quantity: { $gt: 0 },
    });

    if (rooms.length !== roomIds.length) {
      return res.status(404).json({
        error: true,
        message: "Some rooms were not found or do not belong to the specified hotel",
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // // Validate that the user already booked the room
    // const userBooked = await Reservation.find({
    //   hotel: hotelId,
    //   user: user.id,
    //   status: { $nin: ["CANCELLED", "COMPLETED", "CHECKED_OUT", "CHECKED_IN"] },
    // })
    //   .populate("rooms")
    //   .select("rooms");

    // if (userBooked.length > 0) {
    //   console.log("userId", user.id);
    //   console.log("userBooked", userBooked);

    //   const bookedRoomNames = userBooked
    //     .flatMap((reservation) => reservation.rooms)
    //     .map((room) => room.type);

    //   const uniqueNames = [...new Set(bookedRoomNames)];

    //   return res.status(400).json({
    //     error: true,
    //     message: `You already booked this room: ${uniqueNames.join(", ")}`,
    //   });
    // }

    // Check for existing reservations that overlap dates
    const overlapReservations = await Reservation.find({
      rooms: { $in: roomObjectIds },
      status: { $nin: ["CANCELLED", "COMPLETED", "CHECKED_OUT"] },
      $or: [{ checkInDate: { $lte: checkOut }, checkOutDate: { $gte: checkIn } }],
    }).populate("rooms");

    if (overlapReservations.length > 0) {
      const conflictRooms = overlapReservations
        .flatMap((res) => res.rooms)
        .filter((room) => roomObjectIds.includes(room._id.toString()))
        .map((room) => room.type);

      const uniqueNames = [...new Set(conflictRooms)];

      return res.status(409).json({
        error: true,
        message: `Room(s) ${uniqueNames.join(", ")} are already booked during these dates.`,
      });
    }


    const reservation = new Reservation({
      user: user.id,
      hotel: hotelId,
      rooms: roomDetails.map((item, index) => ({
        room: item.roomId,
        quantity: item.quantity
      })),
      checkInDate,
      checkOutDate,
      totalPrice,
      status: "NOT PAID", // Default status
    });

    // // Save the reservation to the database
    await reservation.save();

    // Decrement the quantity of the booked rooms
    // for (const room of rooms) {
    //   const detail = roomDetails.find((r) => r.roomId === room._id.toString())
    //   room.quantity -= detail.quantity;
    //   await room.save();
    // }
    console.log(`Đã tạo thành công reservation not paid`);

    // Auto-delete unpaid reservation after 5 minutes
    setTimeout(async () => {
      try {
        const currentReservation = await Reservation.findById(reservation._id);
        if (currentReservation && currentReservation.status === "NOT PAID") {
          await Reservation.deleteOne({ _id: reservation._id });
          console.log(`Deleted unpaid reservation ${reservation._id} after 5 minutes`);
        }
      } catch (error) {
        console.error("Error during auto-deletion of unpaid reservation:", error);
      }
    }, 3 * 60 * 60 * 1000); // 3 hours in milliseconds

    return res.status(201).json({
      error: false,
      message: "Reservation created successfully",
      reservation,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: true, message: "Failed to create reservation" });
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

  console.log(JSON.stringify(rooms, null, 2));

  const newOrder = {
    orderCode: Date.now(),
    amount: amount,
    items: rooms.map((room) => ({
      name: String(room.roomName || "Unknown"),
      price: Number(room.totalPrice) || 0,
      quantity: Number(room.quantity) || 1,
    })),
    buyerName: currentUser.name,
    buyerEmail: currentUser.email,
    buyerPhone: currentUser.phone,
    returnUrl: `http://localhost:5173/success/${currentReservation._id}`,
    cancelUrl: `http://localhost:5173/cancel/${currentReservation._id}`,
    description: `${currentReservation._id}`.slice(0, 25),
  };

  var listRoomSelected = [];
  for (r in roomIds) {
    var roomSelected = await Room.findOne({ _id: r.id });
    listRoomSelected.push(roomSelected);
  }

  console.log(`Danh sanh object phong duoc chon: ${listRoomSelected}`);

  const paymentLink = await payOs.createPaymentLink(newOrder);
  res.json({ checkoutUrl: paymentLink.checkoutUrl });
});

exports.cancelPayment = asyncHandler(async (req, res) => {
  const currentUser = req.user;
});

exports.successPayment = asyncHandler(async (req, res) => {
  const currentUser = req.user;

  const { id } = req.params;

  if (!id) {
    return res.status(404).json({
      error: true,
      message: PAYMENT.FAIL,
    });
  }

  const reservation = await Reservation.findOne({
    _id: id,
    user: currentUser.id,
  });

  if (!reservation) {
    return res.status(404).json({
      error: true,
      message: RESERVATION.NOT_FOUND,
    });
  }

  await Reservation.findOneAndUpdate(
    { _id: id, user: currentUser.id },
    { $set: { status: "BOOKED" } },
    { new: true }
  );

  console.log(`Data reservation: ${JSON.stringify(reservation)}`);

  for (let bookedRoom of reservation.rooms) {
    const room = await Room.findById(bookedRoom.id);
    if (room) {
      room.quantity -= bookedRoom.quantity;
      await room.save();
    }
  }

  return res.status(200).json({
    error: false,
    message: PAYMENT.SUCCESS,
  });
});
