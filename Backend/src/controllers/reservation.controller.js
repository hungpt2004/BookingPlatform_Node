const asyncHandler = require("../middlewares/asyncHandler");
const Reservation = require("../models/reservation");
const RefundingReservation = require("../models/refundingReservation");
const Room = require("../models/room");
const cron = require("node-cron");
const { RESERVATION } = require("../utils/constantMessage");
const Hotel = require("../models/hotel");

exports.getALlReservation = asyncHandler(async (req, res) => {
  let perPage = 9;
  let page = parseInt(req.query.page) || 1;

  //Get user
  const user = req.user;

  const totalPageReservations = await Reservation.countDocuments();
  const totalPage = Math.ceil(totalPageReservations / perPage);
  const reservations = await Reservation.find({ user: user.id })
    .sort({ totalPrice: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);

  if (!user) {
    return res.status(500).json({
      error: true,
      message: "Authenticated user failed",
    });
  }

  if (reservations.length === 0) {
    return res.status(404).json({
      error: true,
      message: "No have any reservations",
    });
  }

  return res.status(200).json({
    error: false,
    currentPage: page,
    totalPages: totalPage,
    totalReservations: totalPageReservations,
    perPage: perPage,
    reservations,
    message: "Get all reservations success",
  });
});

exports.getRoomByReservationId = asyncHandler(async (req, res) => {
  //user
  const user = req.user;

  const { reservationId } = req.params;

  if (!user) {
    return res.status(500).json({
      error: true,
      message: "Authenticated user failed",
    });
  }

  const reservation = await Reservation.findOne({
    _id: reservationId,
    user: user.id,
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
  const user = req.user;

  const { reservationId } = req.params;

  if (!user) {
    return res.status(500).json({
      error: true,
      message: "Authenticated user failed",
    });
  }

  const reservation = await Reservation.findOne({
    _id: reservationId,
    user: user.id,
  }).populate("hotel");

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
  const { status } = req.query;
  const perPage = 6;
  const page = parseInt(req.query.page) || 1;
  const currentUser = req.user;
  const paymentLink = req.cookies["payment_link"];

  console.log(`user ${currentUser.id}`);

  console.log(`Page ${page}`);

  if (!status) {
    return res.status(400).json({
      error: true,
      message: "Query parameter 'status' is required",
    });
  }

  let query = status === "ALL" ? {} : { status }; // If "ALL", return all reservations
  let totalPageReservations = await Reservation.countDocuments({
    ...query,
    user: currentUser.id,
  });

  //Gộp filter và projection
  //Filter là điều kiện lọc dữ liệu khi truy vấn MongoDB
  //Projection là DS các trường sẽ trả về VD: {age: 1, name: 0}
  //1 là trường trả về
  //0 là trường ẩn đi

  //Câu lệnh filter cùng trong {}
  //Nếu là điều kiện 2 sẽ bị hiểu là Projection

  if (totalPageReservations < 0) {
    return res.status(404).json({
      error: true,
      message: "No reservations found",
    });
  }

  //Lấy số nguyên các trang
  let totalPages = Math.ceil(totalPageReservations / perPage);

  const reservations = await Reservation.find({
    ...query,
    user: currentUser.id,
  })
    .populate("hotel")
    .populate("user", "name email phoneNumber")
    .sort({ totalPrice: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);

  return res.status(200).json({
    error: false,
    currentPage: page,
    totalPages: totalPages,
    totalReservations: totalPageReservations,
    perPage: perPage,
    reservations,
    paymentLink: paymentLink || null,
    message: `Get reservations by '${status}' successfully`,
  });
});

exports.getHotelReservations = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;
  const user = req.user;
  if (!hotelId || hotelId === "undefined") {
    return res.status(400).json({
      error: true,
      message: "Valid Hotel ID is required",
    });
  }

  try {
    const hotel = await Hotel.findOne({
      _id: hotelId,
      owner: user.id,
    });

    if (!hotel) {
      return res.status(403).json({
        error: true,
        message:
          "You do not have permission to view reservations for this hotel or the hotel does not exist",
      });
    }
    const reservations = await Reservation.find({
      hotel: hotelId,
    })
      .populate({
        path: "rooms",
        select: "name type",
      })
      .populate("user", "name email")
      .sort({ checkInDate: -1 });
    const formattedReservations = reservations.map((reservation) => {
      const resObj = reservation.toObject();
      resObj.guest = {
        name: resObj.user?.name || resObj.user?.email || "Guest",
        email: resObj.user?.email,
      };
      return resObj;
    });

    return res.status(200).json({
      error: false,
      reservations: formattedReservations,
      message: "Successfully retrieved hotel reservations",
    });
  } catch (err) {
    console.error("Error fetching hotel reservations:", err);
    return res.status(500).json({
      error: true,
      message: "Failed to fetch hotel reservations: " + err.message,
    });
  }
});

exports.cancelReservation = asyncHandler(async (req, res) => {
  const { reservationId } = req.params;
  const userId = req.user.id;

  try {
    const reservation = await Reservation.findById(reservationId)
      .populate("hotel")
      .populate("rooms.room");

    if (!reservation) {
      return res.status(404).json({
        error: true,
        message: "Reservation not found",
      });
    }

    if (reservation.user.toString() !== userId) {
      return res.status(403).json({
        error: true,
        message: "You are not authorized to cancel this reservation",
      });
    }

    if (!["BOOKED"].includes(reservation.status)) {
      return res.status(400).json({
        error: true,
        message: `Cannot cancel a reservation with status: ${reservation.status}`,
      });
    }

    const checkInDate = new Date(reservation.checkInDate);
    const currentDate = new Date();
    const daysUntilCheckIn = Math.floor(
      (checkInDate - currentDate) / (1000 * 60 * 60 * 24)
    );

    let refundPercentage = 0;
    let cancellationFee = 0;
    let canCancel = true;

    if (daysUntilCheckIn >= 5) {
      refundPercentage = 100;
      cancellationFee = 0;
    } else if (daysUntilCheckIn >= 3) {
      refundPercentage = 50;
      cancellationFee = reservation.totalPrice * 0.5;
    } else if (daysUntilCheckIn >= 1) {
      refundPercentage = 0;
      cancellationFee = reservation.totalPrice;
    } else {
      canCancel = false;
    }

    if (!canCancel) {
      return res.status(400).json({
        error: true,
        message: "Cancellation not allowed less than 24 hours before check-in",
      });
    }

    await reservation.updateOne({
      $set: { status: "PENDING" },
    });

    await reservation.save();

    const refundAmount = (reservation.totalPrice * refundPercentage) / 100;
    if (refundAmount > 0) {
      const refund = new RefundingReservation({
        reservation: reservation._id,
        refundAmount: refundAmount,
        status: "PENDING",
        requestDate: new Date(),
      });
      await refund.save();
    }

    for (const roomItem of reservation.rooms) {
      const room = await Room.findById(roomItem.room._id);
      if (room) {
        room.quantity += roomItem.quantity;
        await room.save();
      }
    }

    return res.status(200).json({
      error: false,
      message: "Reservation cancelled successfully",
      data: {
        reservation: {
          _id: reservation._id,
          hotelName: reservation.hotel.hotelName,
          checkInDate: reservation.checkInDate,
          checkOutDate: reservation.checkOutDate,
          status: reservation.status,
        },
        cancellationPolicy: {
          refundPercentage: refundPercentage,
          refundAmount: refundAmount,
          cancellationFee: cancellationFee,
          daysUntilCheckIn: daysUntilCheckIn,
        },
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Failed to cancel reservation",
    });
  }
});

/*
Thông tin của hóa đơn thanh toán gồm 
- Mã reservation
- Tên khách sạn, địa chỉ, số điện thoại
- Tên người dùng, email, điện thoại
- thông tin reservation
*/

exports.getReservationDetailById = asyncHandler(async (req, res) => {
  const { reservationId } = req.params;

  if (!reservationId) {
    return res.status(400).json({
      message: RESERVATION.INVALID_STATUS,
    });
  }

  try {
    const reservation = await Reservation.findById(reservationId)
      .populate("user", "name email phoneNumber") // Chỉ lấy các trường cần thiết
      .populate("hotel", "hotelName address rating star pricePerNight") // Chỉ lấy các trường cần thiết
      .populate("rooms.room", "name type price"); // Populate chi tiết phòng đặt

    if (!reservation) {
      return res.status(404).json({ message: RESERVATION.NOT_FOUND });
    }

    return res.status(200).json({
      reservation,
      message: "Get detail reservation successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

exports.getRefundingReservations = asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.query; // Lấy tham số từ query

    // Khởi tạo bộ lọc
    let filter = {};

    if (startDate && endDate) {
      filter.requestDate = {
        $gte: new Date(startDate), 
        $lte: new Date(endDate), 
      };
    }

    // Truy vấn database với nested populate
    const refundReservations = await RefundingReservation.find(filter)
      .populate({
        path: "reservation", 
        populate: {
          path: "user", 
          select: "name email phone", 
        },
      })
      .sort({ requestDate: -1 }); // Sắp xếp theo ngày giảm dần

    return res.status(200).json({
      success: true,
      count: refundReservations.length,
      data: refundReservations,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get refunding reservations",
    });
  }
});

//automatic update status of reservations
const autoUpdateReservationStatus = asyncHandler(async () => {
  const currentDate = new Date();

  const reservations = await Reservation.find();

  for (const r of reservations) {
    if (r.status === "COMPLETED" || r.status === "CHECKED OUT") continue;

    //1. Update from Booked to CheckIn
    if (currentDate < r.checkInDate) r.status = "CHECKED IN";

    //2. Update from CheckIn to CheckOut
    if (currentDate > r.checkOutDate) r.status = "CHECKED OUT";

    await Reservation.updateOne({ _id: r._id }, { $set: { status: r.status } });

    console.log(`Updated status for reservation ID ${r._id} to ${r.status}`);
  }
});

const autoDeleteNotPaidReservation = asyncHandler(async () => {
  const reservations = await Reservation.find();

  for (const r of reservations) {
    //1. Update from Booked to CheckIn
    if (r.status === "NOT PAID") {
      await Reservation.deleteOne({ _id: r._id });
    }
  }
});

// setinterval auto run after each minutes
cron.schedule(
  "*/5 * * * *",
  () => {
    // autoUpdateReservationStatus();
    autoDeleteNotPaidReservation();
    console.log(`Đã xóa not paid reservation sau 5 phút`);
  },
  {
    timezone: "Asia/Ho_Chi_Minh",
  }
);
