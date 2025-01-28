const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomImageSchema = new Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  url: { type: String, required: true },
}, {versionKey: false});

module.exports = mongoose.model('RoomImage', RoomImageSchema);
