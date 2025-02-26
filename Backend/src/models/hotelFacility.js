const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HotelFacilitySchema = new Schema(
  {
    hotel: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    ],
    name: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("HotelFacility", HotelFacilitySchema);
