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
      required: true
    },
    rooms: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    }],
    pricePerNight: {
      type: Number,
      required: true,
    },
    images: [
      { type: String }
    ],

    //Thêm mảng lưu trữ hình ảnh
    businessDocuments: [{
      title: { type: String, required: true },
      url: { type: String, required: true }
    }],

    //Thêm comment từ admin
    adminStatus: {
      type: String,
      enum: ["PENDING", "APPROVED"], //Nếu admin reject thì xóa khỏi collection
      default: "PENDING"
    },

    ownerStatus: {
      type: String,
      enum: ["ACTIVE", "NONACTIVE"], //Nếu admin reject thì xóa khỏi collection
      default: "ACTIVE"
    },

    requestDate: {
      type: Date,
      default: Date.now
    }, // Ngày gửi yêu cầu

    decisionDate: {
      type: Date
    } // Ngày quyết định (nếu có)

  },
  { versionKey: false }
);

module.exports = mongoose.model("Hotels", hotelSchema);
