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
      type: Schema.Types.ObjectId,
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
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "HotelService",
      },
    ],
    facility: [
      {
        type: Schema.Types.ObjectId,
        ref: "Facility",
      },
    ],
    rating: {
      type: Number,
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
        required: true
      },
    ],
  },
  { versionKey: false }
);

module.exports = mongoose.model("Hotel", hotelSchema);
