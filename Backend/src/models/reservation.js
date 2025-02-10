const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
      },
    ], // Danh sách phòng được đặt
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "BOOKED",        // Đã đặt, trả tiền nhưng chưa check-in
        "CHECKED_IN",    // Đang ở, đã check-in
        "CHECKED_OUT",   // Đã check-out, có thể để lại phản hồi
        "COMPLETED",     // Hoàn thành, đã phản hồi
        "PENDING",       // Chờ xử lý hoặc xác nhận
        "CANCELLED",     // Đã hủy
        "NOT_PAID"       // Chưa trả tiền
      ],
      default: "PENDING", // Mặc định là chờ xử lý
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0
    },
  },
  { timestamps: true },
  {versionKey: false}
);

module.exports = mongoose.model("Reservation", reservationSchema);

