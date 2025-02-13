const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomFacilitySchema = new Schema(
  {
    rooms: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    ],
    name: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("RoomFacility", RoomFacilitySchema);
