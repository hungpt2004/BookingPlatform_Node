const asyncHandler = require("../middlewares/asyncHandler");
const Reservation = require("../models/reservation");
const cron = require("node-cron");

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

  console.log(`user ${currentUser.id}`)

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
    message: `Get reservations by '${status}' successfully`,
  });
});

//automatic update status of reservations
const autoUpdateReservationStatus = asyncHandler(async () => {
  const currentDate = new Date();

  const reservations = await Reservation.find();

  for (const r of reservations) {
    if (r.status === "COMPLETED" || r.status === "CHECKED OUT") continue;

    //1. Update from Booked to CheckIn
    // if (currentDate < r.checkInDate) r.status = "CHECKED IN";

    // //2. Update from CheckIn to CheckOut
    // if (currentDate > r.checkOutDate) r.status = "CHECKED OUT";

    // await Reservation.updateOne({ _id: r._id }, { $set: { status: r.status } });

    console.log(`Updated status for reservation ID ${r._id} to ${r.status}`);
  }
});

const autoDeleteNotPaidReservation = asyncHandler(async () => {
  const currentDate = new Date();

  const reservations = await Reservation.find();

  for (const r of reservations) {
    //1. Update from Booked to CheckIn
    if (r.status === "NOT PAID") {
      await Reservation.deleteOne(
        { _id: r._id },
      );
    }

    console.log(`Delete status for reservation ID ${r._id} to ${r.status}`);
  }
});

// setinterval auto run after each minutes
cron.schedule("*/5 * * * *", () => {
  // autoUpdateReservationStatus();
  // autoDeleteNotPaidReservation();
});
