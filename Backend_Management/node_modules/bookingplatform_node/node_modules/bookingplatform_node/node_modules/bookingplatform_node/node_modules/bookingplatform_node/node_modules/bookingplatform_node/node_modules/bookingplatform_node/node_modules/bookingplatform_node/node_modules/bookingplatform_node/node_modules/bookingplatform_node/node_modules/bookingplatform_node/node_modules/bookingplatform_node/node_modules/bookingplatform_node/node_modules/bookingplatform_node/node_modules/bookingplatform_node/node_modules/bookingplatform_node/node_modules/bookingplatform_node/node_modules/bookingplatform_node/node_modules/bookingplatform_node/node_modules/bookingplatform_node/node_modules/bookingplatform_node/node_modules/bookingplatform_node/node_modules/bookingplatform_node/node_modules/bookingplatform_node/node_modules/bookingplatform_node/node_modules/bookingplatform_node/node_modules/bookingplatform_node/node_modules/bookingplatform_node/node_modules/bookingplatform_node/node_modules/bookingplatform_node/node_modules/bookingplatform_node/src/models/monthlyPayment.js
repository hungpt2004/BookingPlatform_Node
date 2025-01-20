const mongoose = require('mongoose');
const Schema = mongoose.Schema

const monthlyPaymentSchema = new Schema({
  hotel: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  month: { 
    type: Number, 
    required: true 
  }, // Tháng thanh toán (1 - 12)
  year: { 
    type: Number, 
    required: true 
  }, // Năm thanh toán
  amount: { 
    type: Number, 
    required: true 
  }, // Số tiền thanh toán
  status: { 
    type: String, 
    enum: ['PENDING', 'PAID'], 
    default: 'PENDING' 
  }, // Trạng thái thanh toán
}, { timestamps: true }, {versionKey: false});

module.exports = mongoose.model('MonthlyPayment', monthlyPaymentSchema);
