const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema cho Favorite
const favoriteSchema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Tham chiếu đến User (người dùng)
  
  hotel: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  }, // Tham chiếu đến Hotel (khách sạn yêu thích)
}, {versionKey: false});

module.exports = mongoose.model('Favorite', favoriteSchema);
