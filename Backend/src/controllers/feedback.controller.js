"use strict"
const Feedback = require("../models/feedback");
const Reservation = require("../models/reservation");
const Hotel = require('../models/hotel')
const asyncHandler = require("../middlewares/asyncHandler");
const axios = require('axios')
const { FEEDBACK } = require("../utils/constantMessage");
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function checkProfanityWithGemini(content) {
  try {
    const prompt = `Kiểm tra nội dung sau có chứa từ ngữ không phù hợp hay không (trả lời chỉ "YES" hoặc "NO") * CHÚ Ý HÃY KIỂM TRA TRONG TẤT CẢ CÁC LOẠI NGÔN NGỮ: "${content}"`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    return responseText === "YES"; // Trả về true nếu có từ ngữ không phù hợp
  } catch (error) {
    console.error("Lỗi kiểm tra nội dung bằng Gemini:", error);
    return false; // Nếu lỗi xảy ra, mặc định không chặn nội dung
  }
}

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

exports.getTopComments = asyncHandler( async (req, res) => {

  const feedbacks = await Feedback.find().populate('user').sort({ rating: -1 }).limit(5);

  if(feedbacks.length <= 0) {
    return res.status(500).json({
      error: true,
      message: FEEDBACK.NOT_FOUND
    })
  }

  return res.status(200).json({
    error: false,
    feedbacks,
    message: FEEDBACK.SUCCESS
  })

})

exports.createFeedback = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user.id;

    if (!reservationId) {
      return res.status(400).json({ message: "reservationId is required." });
    }

    const reservation = await Reservation.findOne({
      _id: reservationId,
      user: userId,
      status: "CHECKED OUT",
    }).populate("hotel");

    if (!reservation) {
      return res.status(400).json({ message: "Reservation chưa hoàn thành hoặc không tồn tại." });
    }

    // Kiểm tra nội dung bằng Gemini
    const isProfane = await checkProfanityWithGemini(content);
    if (isProfane) {
      console.log("Có từ ngữ không phù hợp trong feedback")
      return res.status(400).json({ message: `${content} không phù hợp trong feedback` });
    }

    // Nếu nội dung hợp lệ, tiếp tục tạo feedback
    const feedback = new Feedback({
      user: userId,
      reservation: reservationId,
      hotel: reservation.hotel,
      content,
      rating: parseInt(rating),
      createdAt: new Date(),
    });

    await feedback.save();

    // Cập nhật trạng thái reservation thành "COMPLETED"
    await Reservation.updateOne({ _id: reservationId }, { $set: { status: "COMPLETED" } });
    await reservation.save();

    // Cập nhật rating khách sạn
    const avgValueRatingUpdate = await calculateAvgRatingHotel(reservation.hotel._id);
    await Hotel.updateOne({ _id: reservation.hotel._id }, { $set: { rating: avgValueRatingUpdate } });

    res.status(201).json({ message: "Feedback đã được gửi thành công!", feedback });
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Lỗi máy chủ." });
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
exports.getFeedbackByUser = asyncHandler(async (req, res) => {

  const userId = req.user.id;

  try {
    const feedbacks = await Feedback.find({
      user: userId
    });

    if (feedbacks.length <= 0) {
      return res.status(404).json({
        error: true,
        message: "No feedback found for this reservation",
      });
    }

    return res.status(200).json({
      error: false,
      feedbacks,
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

