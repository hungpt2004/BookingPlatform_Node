const express = require("express");
const router = express.Router();
const hotelApprovalController = require("../controllers/hotel.approval.controller");
const authController = require("../controllers/authenticate.controller");

router.get(
  "/pending",
  authController.protect,
  authController.restrictTo("ADMIN"),
  hotelApprovalController.getPendingHotels
);

router.get(
  "/:id",
  authController.protect,
  authController.restrictTo("ADMIN"),
  hotelApprovalController.getHotelForApproval
);

router.post(
  "/process",
  authController.protect,
  authController.restrictTo("ADMIN"),
  hotelApprovalController.processHotelApproval
);

module.exports = router;
