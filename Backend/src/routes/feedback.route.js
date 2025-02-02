const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedback.controller");
const { authenticateToken } = require("../utils/authenticateToken"); // Middleware xác thực user

router.post("/", authenticateToken, feedbackController.createFeedback);

module.exports = router;
