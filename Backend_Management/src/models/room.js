const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  facilities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RoomFacility' }], // References
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RoomImage' }] // References
}, {versionKey: false});

module.exports = mongoose.model('Room', RoomSchema);
