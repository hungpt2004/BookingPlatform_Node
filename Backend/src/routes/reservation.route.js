const express = require('express')
const ReservationRouter = express.Router();
const authenticateToken = require('../utils/authenticateToken')
const ReservationController = require('../controllers/reservation.controller')

ReservationRouter.get('/get-all-reservation', ReservationController.getALlReservation)
ReservationRouter.get('/search-status', ReservationController.getReservationByStatus),
ReservationRouter.get('/room/:reservationId', ReservationController.getRoomByReservationId)
ReservationRouter.get('/hotel/:reservationId', ReservationController.getHotelByReservationId)

module.exports = ReservationRouter