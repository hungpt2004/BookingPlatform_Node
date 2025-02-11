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
    const { content, rating, hotel } = req.body;
    const userId = req.user.id;

    if (!reservationId) {
      return res.status(400).json({ 
        message: "reservationId is required." });
    }

    const reservation = await Reservation.findOne({
      _id: reservationId,
      user: userId,
      status: "CHECKED OUT", // Chỉ cho phép gửi feedback khi đã checkout
    }).populate('hotel');;

    if (!reservation) {
      return res
        .status(400)
        .json({ message: "Reservation chưa hoàn thành hoặc không tồn tại." });
    }

    // if (reservation.status !== "CHECKED OUT") {
    //   return res.status(400).json({ message: "Reservation chưa hoàn tất check-out." });
    // }


    // Tạo feedback mới
    const feedback = new Feedback({
      user: userId,                  // ObjectId of user
      reservation: reservationId,    // ObjectId of reservation
      hotel,      // ObjectId of hotel from reservation
      content,              // String content
      rating: parseInt(rating),      // Number rating
      createdAt: new Date()         // Current timestamp
    });

    await feedback.save();
    // Cập nhật trạng thái reservation thành "COMPLETED"
    reservation.status = "COMPLETED";
    await reservation.save();
    res
      .status(201)
      .json({ message: "Feedback đã được gửi thành công!", feedback });
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }

};

