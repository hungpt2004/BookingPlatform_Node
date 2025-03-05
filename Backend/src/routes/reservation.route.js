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
  "/room/:reservationId",
  protect,
  ReservationController.getRoomByReservationId
);
ReservationRouter.get(
  "/hotel/:reservationId",
  protect,
  ReservationController.getHotelByReservationId
);
ReservationRouter.post(
  "/cancel/:reservationId",
  protect,
  ReservationController.cancelReservation
);

module.exports = ReservationRouter;
