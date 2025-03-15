const express = require("express");
const FavoriteRouter = express.Router();
const authenticateToken = require("../utils/authenticateToken");
const FavoriteController = require("../controllers/favorite.controller");
const {
    restrictTo,
    protect,
} = require("../controllers/authenticate.controller");
const authController = require("./../controllers/authenticate.controller");
const router = express.Router();
router.use(authController.protect);

FavoriteRouter.get("/get-all-favorite", protect, FavoriteController.getFavoriteHotels);
FavoriteRouter.post("/add-favorite", protect, FavoriteController.addFavoriteHotel);
FavoriteRouter.delete("/remove-favorite", protect, FavoriteController.removeFavoriteHotel);

module.exports = FavoriteRouter;

