const express = require('express');
const UserRouter = express.Router();
const UserController = require('../controllers/user.controller')
const SearchController = require('../controllers/searchfilter')
const ReservationController = require('../controllers/reservation.controller')

UserRouter.get("/get-all-user", UserController.getAllUser);
UserRouter.post("/create-user", UserController.createUser);
UserRouter.get("/search", SearchController.searchAndFilterHotels);
UserRouter.post("/add-favorite-hotel", UserController.addFavoriteHotel);
UserRouter.get("/get-favorite-hotels/:userId", UserController.getFavoriteHotels);
UserRouter.delete("/remove-favorite-hotel", UserController.removeFavoriteHotel);
UserRouter.post("/booking", ReservationController.createBooking);
module.exports = UserRouter;