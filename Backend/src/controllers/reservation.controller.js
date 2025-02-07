const asyncHandler = require("../middlewares/asyncHandler");
const Reservation = require("../models/reservation");
const cron = require("node-cron");

exports.getALlReservation = asyncHandler(async (req, res) => {
  let perPage = 9;
  let page = parseInt(req.query.page) || 1;

  //Get user
  //const user = req.user.user;

  //Get all reservation sort with total price increase
  //   const reservations = await Reservation.find({ user: user }).sort({
  //     totalPrice: -1,
  //   });

  const totalPageReservations = await Reservation.countDocuments();
  const totalPage = Math.ceil(totalPageReservations / perPage);
  const reservations = await Reservation.find()
    .sort({ totalPrice: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);

  //   if (!user) {
  //     return res.status(500).json({
  //       error: true,
  //       message: "Authenticated user failed",
  //     });
  //   }

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

  // console.log(reservation);

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
  const page = parseInt(req.query.page) || 1; // Fix: Get 'page' from query params

  console.log(`Page ${page}`);

  if (!status) {
    return res.status(400).json({
      error: true,
      message: "Query parameter 'status' is required",
    });
  }

  let query = status === "ALL" ? {} : { status }; // If "ALL", return all reservations
  let totalPageReservations = await Reservation.countDocuments(query); // Fix: Await countDocuments

  if (totalPageReservations === 0) {
    return res.status(404).json({
      error: true,
      message: "No reservations found",
    });
  }

  let totalPages = Math.ceil(totalPageReservations / perPage); // Fix: Calculate total pages correctly

  const reservations = await Reservation.find(query)
    .sort({ totalPrice: -1 }) // Sort by total price
    .skip((page - 1) * perPage) // Fix: Apply pagination correctly
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
    //1. Update from Booked to CheckIn
    if (currentDate < r.checkInDate) r.status = "CHECKED IN";

    //2. Update from CheckIn to CheckOut
    if (currentDate > r.checkOutDate) r.status = "CHECKED OUT";

    await Reservation.updateOne({ _id: r._id }, { $set: { status: r.status } });

    // console.log(`Updated status for note ID ${r._id} to ${r.status}`);
  }
});

//setinterval auto run after each minutes
cron.schedule("* * * * *", () => {
  console.log("THIS FUNCTION AUTO UPDATE EVERY MINUTES");
  autoUpdateReservationStatus();
});
