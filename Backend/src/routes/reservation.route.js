const express = require("express");
const ReservationRouter = express.Router();
const authenticateToken = require("../utils/authenticateToken");
const ReservationController = require("../controllers/reservation.controller");
const {
  restrictTo,
  protect,
} = require("../controllers/authenticate.controller");
const authController = require("./../controllers/authenticate.controller");
const router = express.Router();

router.use(authController.protect);

ReservationRouter.get(
  "/get-all-reservation",
  protect,
  ReservationController.getALlReservation
);
ReservationRouter.get(
  "/search-status",
  protect,
  ReservationController.getReservationByStatus
);
ReservationRouter.get(
  '/detail/:reservationId',
  protect,
  ReservationController.getReservationDetailById
)
ReservationRouter.get(
  "/room/:reservationId",
  protect,
  ReservationController.getRoomByReservationId
);
ReservationRouter.get(
  "/hotel/:reservationId",
  protect,
  ReservationController.getHotelByReservationId
);
ReservationRouter.get(
  "/hotel-reservations/:hotelId",
  protect,
  ReservationController.getHotelReservations
);
ReservationRouter.post(
  "/cancel/:reservationId",
  protect,
  ReservationController.cancelReservation
);
ReservationRouter.get(
  "/search-refund",
  protect,
  authController.restrictTo("ADMIN"),
  ReservationController.getRefundingReservations
)

module.exports = ReservationRouter;
