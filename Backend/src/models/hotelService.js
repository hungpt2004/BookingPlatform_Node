const mongoose = require('mongoose');
const { Schema } = mongoose;

const HotelServiceSchema = new Schema({
  hotel: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  }, // Tham chiếu đến mô hình Hotel
  name: {
    type: String,
    required: true,
  },
  price: { 
    type: Number, 
    required: true 
  } // Giá của dịch vụ tại khách sạn này

}, {versionKey: false});

module.exports = mongoose.model('HotelService', HotelServiceSchema);
