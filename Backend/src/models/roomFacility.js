const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomFacilitySchema = new Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  name: { type: String, required: true },
  description: { type: String },
  url: { type: Buffer, required: true },
  unavailableDates: { type: [Date] }
}, { versionKey: false });

module.exports = mongoose.model('RoomFacility', RoomFacilitySchema);
