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
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HotelService",
      },
    ],
    facilities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HotelFacility",
      },
    ],
    rating: {
      type: Number,
      required: true,
    },
    star: {
      type: Number,
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    images: [
      // {
      //   // public_ID: { type: String, required: true },
      //   url: { type: String, required: true }
      // },
      { type: String, required: true },
    ],

    //Thêm mảng lưu trữ hình ảnh
  },
  { versionKey: false }
);

module.exports = mongoose.model("Hotel", hotelSchema);
