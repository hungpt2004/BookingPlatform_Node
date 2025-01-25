const express = require('express')
const ReservationRouter = express.Router();
const authenticateToken = require('../utils/authenticateToken')
const ReservationController = require('../controllers/reservation.controller')

ReservationRouter.get('/get-all-reservation', ReservationController.getALlReservation)
ReservationRouter.get('/search-status', ReservationController.getReservationByStatus),
ReservationRouter.get('/:reservationId', ReservationController.getRoomByReservationId)

module.exports = ReservationRouter