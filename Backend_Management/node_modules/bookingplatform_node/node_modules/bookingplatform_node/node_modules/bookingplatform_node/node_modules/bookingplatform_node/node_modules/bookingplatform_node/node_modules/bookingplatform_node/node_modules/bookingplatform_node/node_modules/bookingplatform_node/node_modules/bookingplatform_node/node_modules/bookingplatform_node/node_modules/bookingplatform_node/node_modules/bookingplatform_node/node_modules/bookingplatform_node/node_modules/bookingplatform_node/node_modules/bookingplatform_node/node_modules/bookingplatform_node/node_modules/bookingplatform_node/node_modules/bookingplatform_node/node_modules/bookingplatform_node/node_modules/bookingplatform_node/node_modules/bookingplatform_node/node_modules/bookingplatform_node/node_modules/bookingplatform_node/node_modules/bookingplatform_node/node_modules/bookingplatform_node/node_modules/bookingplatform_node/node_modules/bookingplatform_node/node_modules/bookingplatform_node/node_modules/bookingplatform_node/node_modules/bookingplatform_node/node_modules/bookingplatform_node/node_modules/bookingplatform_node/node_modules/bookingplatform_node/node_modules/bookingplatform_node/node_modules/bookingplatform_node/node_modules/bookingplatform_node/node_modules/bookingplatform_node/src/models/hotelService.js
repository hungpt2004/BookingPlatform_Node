const mongoose = require('mongoose');
const { Schema } = mongoose;

const HotelServiceSchema = new Schema({
  hotel: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  }, // Tham chiếu đến mô hình Hotel
  
  service: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service', 
    required: true 
  }, // Tham chiếu đến mô hình Service
  
  price: { 
    type: Number, 
    required: true 
  } // Giá của dịch vụ tại khách sạn này

}, {versionKey: false});

module.exports = mongoose.model('HotelService', HotelServiceSchema);
