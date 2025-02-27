"use strict"

const Feedback = require("../models/feedback");
const Reservation = require("../models/reservation");
const Hotel = require('../models/hotel')
const asyncHandler = require("../middlewares/asyncHandler");

exports.getAllFeedBackByHotelId = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;

  const [listFeedback, userFeeback] = await Promise.all([
    Feedback.find({ hotel: hotelId }).populate("user"),
    Feedback.find(
      { hotel: hotelId },
      {
        reservation: 0,
        hotel: 0,
        content: 0,
        rating: 0,
      }
    ).populate("user"),
  ]);

  if (listFeedback.length === 0) {
    return res.send("No have any feedback")
  }

  return res.status(200).json({
    error: false,
    listFeedback,
    userFeeback,
    message: "Get all feed by hotel id success",
  });
});

exports.createFeedback = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user.id;

    if (!reservationId) {
      return res.status(400).json({
        message: "reservationId is required.",
      });
    }

    const reservation = await Reservation.findOne({
      _id: reservationId,
      user: userId,
      status: "CHECKED OUT", // Chỉ cho phép gửi feedback khi đã checkout
    }).populate("hotel");

    if (!reservation) {
      return res
        .status(400)
        .json({ message: "Reservation chưa hoàn thành hoặc không tồn tại." });
    }

    // Tạo feedback mới
    const feedback = new Feedback({
      user: userId, // ObjectId of user
      reservation: reservationId, // ObjectId of reservation
      hotel: reservation.hotel, // ObjectId of hotel from reservation
      content, // String content
      rating: parseInt(rating), // Number rating
      createdAt: new Date(), // Current timestamp
    });

    await feedback.save();
    // Cập nhật trạng thái reservation thành "COMPLETED"

    await Reservation.updateOne(
      {_id: reservationId},
      { $set: {status: "COMPLETED"}}
    )

    await reservation.save();

    //Tinh va update rating khach san 
    //Tong so feedback cua hotel
    //Tinh lai avg rating
    //Update rating 

    const avgValueRatingUpdate = await calculateAvgRatingHotel(reservation.hotel._id);
    console.log("AVG Rating:", avgValueRatingUpdate); 

    const currentHotel = await Hotel.findOne(reservation.hotel._id);

    console.log(`Old Rating ${currentHotel.rating}`)

    await Hotel.updateOne(
      {_id: reservation.hotel._id},
      {$set: {rating: avgValueRatingUpdate}}
    )

    res.status(201).json({
      message: "Feedback đã được gửi thành công!",
      feedback,
    });

  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Errror Server" });
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
      message: "Feedback not found",
    });
  }

  res.status(200).json({
    error: false,
    feedback,
    message: "Update feedback success",
  });
});

//delete feedback
exports.deleteFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const feedback = await Feedback.findByIdAndDelete(feedbackId);
  if (!feedback) {
    return res.status(404).json({
      error: true,
      message: "Feedback not found",
    });
  }

  res.status(200).json({
    error: false,
    message: "Delete feedback success",
  });
});


//get feedback by user_id
exports.getFeedbackByUserAndReservation = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { reservationId } = req.params;

  try {
    const feedback = await Feedback.findOne({
      user: userId,
      reservation: reservationId,
    });

    if (!feedback) {
      return res.status(404).json({
        error: true,
        message: "No feedback found for this reservation",
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

const calculateAvgRatingHotel = async (hotelId) => {
  // Sử dụng aggregate để tính trung bình rating
  const result = await Feedback.aggregate([
      { $match: { hotel: hotelId } }, // Lọc feedback theo hotelId
      { 
          $group: { 
              _id: "$hotel", 
              avgRating: { $avg: "$rating" }, // Tính trung bình rating
              totalFeedbacks: { $sum: 1 } // Đếm số feedback
          } 
      }
  ]);

  if (result.length === 0) return 0; // Nếu không có feedback, trả về 0

  const avgValueRating = Number(result[0].avgRating.toFixed(1));
  console.log(`Average Rating Updated: ${avgValueRating}`);

  return avgValueRating;
};

