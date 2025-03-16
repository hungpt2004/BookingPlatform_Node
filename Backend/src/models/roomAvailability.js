const mongoose = require("mongoose");

const RoomAvailabilitySchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  date: { type: Date, required: true },
  bookedQuantity: { type: Number, default: 0 }, 
});

module.exports = mongoose.model("RoomAvailability", RoomAvailabilitySchema);
