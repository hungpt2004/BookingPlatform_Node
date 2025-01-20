const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema cho Hotel
const hotelSchema = new Schema({
   hotelName: { 
     type: String, 
     required: true 
   }, // Tên khách sạn
   owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   description: { 
     type: String, 
     required: true 
   }, // Mô tả khách sạn
   address: { 
     type: String, 
     required: true 
   }, // Địa chỉ khách sạn
   services: [{ 
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'Service' 
   }], // Mảng các dịch vụ (tham chiếu đến Service)
   rating: { 
     type: Number, 
     required: true 
   }, // Đánh giá khách sạn
   pricePerNight: { 
     type: Number, 
     required: true 
   }, // Giá phòng mỗi đêm
   images: [{ 
     type: String 
   }], // Mảng các đường dẫn hình ảnh khách sạn
 }, {versionKey: false});
 
 module.exports = mongoose.model('Hotel', hotelSchema);
 