const Feedback = require('../models/feedback')
const asyncHandler = require('../middlewares/asyncHandler')
const Reservation = require('../models/reservation');


exports.getAllFeedBackByHotelId = asyncHandler(async (req, res) => {

  const { hotelId } = req.params;

  const feedback = await Feedback.find({ hotel: hotelId });

  if (feedback.length === 0) {
    return res.status(401).json({
      error: true,
      message: "No have any feedback"
    })
  }

  return res.status(200).json({
    error: false,
    feedback,
    message: "Get all feed by hotel id success"
  })

})

//test tạo feedback
exports.createFeedback = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user.id;

    if (!reservationId) {
      return res.status(400).json({
        message: "reservationId is required."
      });
    }

    const reservation = await Reservation.findOne({
      _id: reservationId,
      user: userId,
      status: "CHECKED OUT", // Chỉ cho phép gửi feedback khi đã checkout
    }).populate('hotel');

    if (!reservation) {
      return res
        .status(400)
        .json({ message: "Reservation chưa hoàn thành hoặc không tồn tại." });
    }

    const feedback = new Feedback({
      user: userId,
      reservation: reservationId,
      hotel: reservation.hotel,
      content,
      rating: parseInt(rating),
      createdAt: new Date(),
    });
    console.log(feedback)
    await feedback.save();
    // Cập nhật trạng thái reservation thành "COMPLETED"
    await reservation.updateOne(
      { _id: reservationId },
      { $set: { status: "COMPLETED" } }
    )
    res
      .status(201)
      .json({ message: "Feedback đã được gửi thành công!", feedback });
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

//update feedback
exports.updateFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const updates = {};

  if (req.body.content) {
    updates.content = req.body.content;
  }
  if (req.body.rating) {
    updates.rating = req.body.rating;
  }
  if (Object.keys(updates).length === 0) {
    return res.status(500).json({
      status: "fail",
      message: "No data provided for update",
    });
  }
  const feedback = await Feedback.findByIdAndUpdate(feedbackId, updates, {
    new: true,
    runValidators: true,
  });

  if (!feedback) {
    return res.status(404).json({
      error: true,
      message: "Feedback not found"
    })
  }

  res.status(200).json({
    error: false,
    feedback,
    message: "Update feedback success"
  })
});

//delete feedback
exports.deleteFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const feedback = await Feedback.findByIdAndDelete(feedbackId);
  if (!feedback) {
    return res.status(404).json({
      error: true,
      message: "Feedback not found"
    })
  }

  res.status(200).json({
    error: false,
    message: "Delete feedback success"
  })
});

//get feedback by user_id
exports.getFeedbackByUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  try {
    const feedback = await Feedback.find({ user: userId });
    if (!feedback) {
      return res.status(404).json({
        error: true,
        message: "No feedback found ",
      });
    }
    return res.status(200).json({
      error: false,
      feedback,
      message: "Feedback retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server Error",
    });
  }
});
