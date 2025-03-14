const express = require('express')
const FeedbackRouter = express.Router();
const FeedbackController = require('../controllers/feedback.controller')
const {protect,} = require("../controllers/authenticate.controller");
const authController = require("./../controllers/authenticate.controller");
const router = express.Router();

router.use(authController.protect);

FeedbackRouter.get('/top-comment', FeedbackController.getTopComments)
FeedbackRouter.get('/get-feedback-hotel/:hotelId', FeedbackController.getAllFeedBackByHotelId)
FeedbackRouter.get('/get-feeback', protect, FeedbackController.getFeedbackByUser)
FeedbackRouter.post('/create-feedback/:reservationId', protect, FeedbackController.createFeedback)
FeedbackRouter.patch('/update-feedback/:feedbackId', protect, FeedbackController.updateFeedback)
FeedbackRouter.delete('/delete-feedback/:feedbackId', FeedbackController.deleteFeedback)


module.exports = FeedbackRouter;
