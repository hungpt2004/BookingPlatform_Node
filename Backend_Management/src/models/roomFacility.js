const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomFacilitySchema = new Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true }
}, {versionKey: false});

module.exports = mongoose.model('RoomFacility', RoomFacilitySchema);
