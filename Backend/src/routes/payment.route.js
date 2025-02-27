const express = require("express");
const PaymentRouter = express.Router();
const router = express.Router();
const {
  restrictTo,
  protect,
} = require("../controllers/authenticate.controller");
const authController = require("./../controllers/authenticate.controller");
router.use(authController.protect);
const PaymentController = require("../controllers/payment.controller");

PaymentRouter.post("/create-booking", protect, PaymentController.createBooking)
PaymentRouter.post("/create-payment-link", protect, PaymentController.createPaymentLink);
PaymentRouter.post("/success", protect, PaymentController.successPayment)

module.exports = PaymentRouter;
