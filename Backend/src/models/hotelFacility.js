const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HotelFacilitySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { versionKey: false }
);

module.exports = mongoose.model("HotelFacilities", HotelFacilitySchema);
