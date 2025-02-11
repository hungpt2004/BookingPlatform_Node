const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedback.controller");
const { authenticateToken } = require("../utils/authenticateToken"); // Middleware xác thực user

router.post("/create/:reservationId", authenticateToken, feedbackController.createFeedback);
router.patch("/update/:feedbackId", authenticateToken, feedbackController.updateFeedback);
router.get("/get/:reservationId", authenticateToken, feedbackController.getFeedbackByUserAndReservation);
module.exports = router;
