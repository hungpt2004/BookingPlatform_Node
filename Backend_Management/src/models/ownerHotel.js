const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ownedHotelSchema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Tham chiếu đến User (người dùng là chủ khách sạn)
  
  hotel: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  }, // Tham chiếu đến Hotel (khách sạn được sở hữu bởi người dùng)
}, {versionKey: false});

module.exports = mongoose.model('OwnedHotel', ownedHotelSchema);
