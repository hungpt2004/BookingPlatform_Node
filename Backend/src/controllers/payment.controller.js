require("dotenv").config();
const PayOs = require("@payos/node");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/user");
const Room = require("../models/room");
const Reservation = require("../models/reservation");
const cron = require("node-cron");
const RoomAvailability = require("../models/roomAvailability");
const { PAYMENT, RESERVATION } = require("../utils/constantMessage");
const mongoose = require("mongoose");

//Create object pay os
const payOs = new PayOs(
  process.env.CLIENT_ID,
  process.env.API_KEY,
  process.env.CHECKSUM_KEY
);

//Create booking with not paid reservation
exports.createBooking = asyncHandler(async (req, res) => {
  const user = req.user;
  const {
    hotelId,
    roomIds,
    checkInDate,
    checkOutDate,
    roomDetails,
    totalPrice,
  } = req.body;

  console.log(req.body)

  try {
    if (!user.id || !hotelId || !roomIds || !checkInDate || !checkOutDate) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required fields" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    //Check not paid reservation
    const unpaidReservation = await Reservation.findOne({
      user: user._id,
      status: 'NOT PAID'
    })

    if(unpaidReservation) {

      console.log(`Đã phát hiện đơn not paid`)

      const urlReturnBack = 'http://localhost:5173/transaction'

      return res.json({ 
        redirect: urlReturnBack,
        message: "You must payment the not paid reservation before or wait 5 minutes to delete" 
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Kiểm tra số phòng có sẵn theo từng ngày trong khoảng thời gian đặt
      for (const item of roomDetails) {
        let available = true;

        for (
          let date = new Date(checkIn);
          date <= checkOut;
          date.setDate(date.getDate() + 1)
        ) {
          const existingRecord = await RoomAvailability.findOne({
            room: item.roomId,
            date,
          }).session(session);

          const totalBooked = existingRecord
            ? existingRecord.bookedQuantity
            : 0;
          const room = await Room.findById(item.roomId).session(session);

          if (!room || totalBooked + item.quantity > room.quantity) {
            available = false;
            break;
          }
        }

        if (!available) {
          throw new Error(
            `Not enough rooms available for room ID ${item.roomId}`
          );
        }
      }

      // Nếu đủ phòng, cập nhật số lượng phòng đã đặt theo từng ngày
      for (const item of roomDetails) {
        for (
          let date = new Date(checkIn);
          date <= checkOut;
          date.setDate(date.getDate() + 1)
        ) {
          const existingRecord = await RoomAvailability.findOne({
            room: item.roomId,
            date,
          }).session(session);

          if (existingRecord) {
            existingRecord.bookedQuantity += item.quantity;
            await existingRecord.save({ session });
          } else {
            const newAvailability = new RoomAvailability({
              room: item.roomId,
              date,
              bookedQuantity: item.quantity,
            });
            await newAvailability.save({ session });
          }
        }
      }

      // Tạo đơn đặt phòng
      const reservation = new Reservation({
        user: user.id,
        hotel: hotelId,
        rooms: roomDetails.map((item) => ({
          room: item.roomId,
          quantity: item.quantity,
        })),
        checkInDate,
        checkOutDate,
        totalPrice,
        status: "NOT PAID",
      });

      await reservation.save({ session });

      //add to set check duplicate
      //push is not check

      await User.findByIdAndUpdate(user._id, {
        $addToSet: { reservations: reservation._id },
      });

      await session.commitTransaction();
      session.endSession();

      console.log(`Đã tạo reservation với trạng thái  NOT PAID`);

      return res.status(201).json({
        error: false,
        message: "Reservation created successfully",
        reservation,
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      
      return res.status(400).json({
        error: true,
        message: err.message || "Failed to create reservation",
      });
    }
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ error: true, message: "Failed to create reservation" });
  }
});

//Create payment link in PayOS
exports.createPaymentLink = asyncHandler(async (req, res) => {
  //user
  const currentUser = req.user;

  const { amount, rooms, reservationId } = req.body;

  console.log(`Room Selected: ${rooms}`);

  const newOrder = {
    orderCode: Date.now(),
    amount: amount,
    items: rooms.map((room) => ({
      name: String(room.roomName),
      price: Number(room.totalPrice),
      quantity: Number(room.quantity),
    })),
    buyerName: currentUser.name,
    buyerEmail: currentUser.email,
    buyerPhone: currentUser.phone,
    returnUrl: `http://localhost:5173/success/${reservationId}`,
    cancelUrl: `http://localhost:5173/cancel/${reservationId}`,
    description: `${reservationId}`.slice(0, 25),
  };

  const paymentLink = await payOs.createPaymentLink(newOrder);

  return res.json({ checkoutUrl: paymentLink.checkoutUrl });

});

//Logic CancelPayment
exports.cancelPayment = asyncHandler(async (req, res) => {
  const currentUser = req.user;
  const { id } = req.params;

  console.log("Current User ID:", currentUser.id);
  console.log("Reservation ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      error: true,
      message: RESERVATION.NOT_FOUND,
    });
  }

  const reservation = await Reservation.findOne({ _id: id});

  console.log(reservation)

  if (!reservation) {
    return res.status(404).json({
      error: true,
      message: "Reservation in cancel payment is not found",
    });
  }

  if (!reservation.rooms || reservation.rooms.length === 0) {
    return res.status(400).json({
      error: true,
      message: "No rooms found in this reservation.",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const roomItem of reservation.rooms) {
      if (!mongoose.Types.ObjectId.isValid(roomItem.room)) continue;

      const room = await Room.findOne({ _id: roomItem.room }).session(session);
      if (room) {
        room.quantity += roomItem.quantity;
        await room.save({ session });
      }
    }

    await Reservation.findOneAndDelete({ _id: id, user: currentUser.id }, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      error: false,
      message: "Cancel Payment Successfully",
    });

  } catch (err) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortErr) {
        console.error("Failed to abort transaction:", abortErr);
      }
    }
    if (session) session.endSession();
    return res.status(400).json({
      error: true,
      message: PAYMENT.CANCEL_FAIL,
      details: err.message,
    });
  }
});


//Logic SuccessPayment
exports.successPayment = asyncHandler(async (req, res) => {
  const currentUser = req.user;

  const { id } = req.params;

  if (!id) {
    return res.status(404).json({
      error: true,
      message: RESERVATION.NOT_FOUND,
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

  //start session and transaction
  //session created to manage transaciton action
  const session = await mongoose.startSession();
  session.startTransaction();

  // const rooms = reservation.rooms;

  try {
    //Update trạng thái đơn
    await Reservation.findOneAndUpdate(
      { _id: id },
      { $set: { status: "BOOKED" } },
      { new: true, session } // Truyền đúng session ở đây
    );

    await session.commitTransaction(); //Thực hiện xong tất cả thì commit
    session.endSession();

    return res.status(200).json({
      error: false,
      message: "Payment successfully",
    });
  } catch (err) {
    //roll back
    if (session.inTransaction()) {
      await session.abortTransaction(); //Không thành công thì rollback dữ liệu
    }
    session.endSession();

    return res.status(400).json({
      error: false,
      message: PAYMENT.FAIL,
    });
  }
});

// async function restoreRooms() {
//   console.log("Đang kiểm tra các đặt phòng đã hết hạn...");

//   const now = new Date();

//   // Lấy tất cả các đơn đặt phòng có ngày check-out đã qua
//   const expiredReservations = await Reservation.find({
//     checkOutDate: { $lt: now }, // Lọc các đơn đã hết hạn
//     status: "CHECK OUT", //Check-out thôi vì Completed chỉ có comment xong thì đổi
//   });

//   for (const reservation of expiredReservations) {
//     for (const roomItem of reservation.rooms) {
//       const room = await Room.findById(roomItem.room);
//       if (room) {
//         room.quantity += roomItem.quantity;
//         await room.save();
//       }
//     }
//   }

//   console.log(
//     `Đã khôi phục số phòng cho ${expiredReservations.length} đơn đặt phòng.`
//   );
// }

// Lên lịch chạy cron job mỗi ngày lúc 00:00 (nửa đêm)
// cron.schedule(
//   "0 0 * * *",
//   async () => {
//     console.log("🔄 Đang chạy cron job khôi phục số phòng...");
//     await restoreRooms();
//   },
//   {
//     timezone: "Asia/Ho_Chi_Minh",
//   }
// );
