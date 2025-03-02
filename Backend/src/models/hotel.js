const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema cho Hotel
const hotelSchema = new Schema(
  {
    hotelName: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'NONACTIVE'],
      default: 'NONACTIVE',
    },
    facilities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Facility",
      },
    ],
    rating: {
      type: Number,
      required: true,
    },
    star: {
      type: Number,
      required: true
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    images: [
      { type: String, required: true }
    ],

    //Thêm mảng lưu trữ hình ảnh


  },
  { versionKey: false }
);

module.exports = mongoose.model("Hotel", hotelSchema);
