const mongoose = require("mongoose");
const { Schema } = mongoose;

const HotelServiceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("HotelService", HotelServiceSchema);
