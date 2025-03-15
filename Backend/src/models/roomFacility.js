const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomFacilitySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { versionKey: false }
);

module.exports = mongoose.model("RoomFacility", RoomFacilitySchema);
