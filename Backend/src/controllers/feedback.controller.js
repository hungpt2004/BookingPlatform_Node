const Feedback = require('../models/feedback')
const asyncHandler = require('../middlewares/asyncHandler')
const Reservation = require('../models/reservation')
exports.getAllFeedBackByHotelId = asyncHandler( async (req, res) => {
   
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
    const { reservationId, content, rating } = req.body;
    const userId = req.user.id; // Lấy ID từ token xác thực

    // Kiểm tra reservation có tồn tại và đã hoàn thành chưa
    const reservation = await Reservation.findOne({
      _id: reservationId,
      user: userId,
      status: "completed", // Chỉ cho phép gửi feedback khi đã hoàn thành
    });

    if (!reservation) {
      return res
        .status(400)
        .json({ message: "Reservation chưa hoàn thành hoặc không tồn tại." });
    }

    // Tạo feedback mới
    const feedback = new Feedback({
      user: userId,
      reservation: reservationId,
      hotel: reservation.hotel, // Lấy hotel từ reservation
      content,
      rating,
    });

    await feedback.save();

    res
      .status(201)
      .json({ message: "Feedback đã được gửi thành công!", feedback });
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }

};

