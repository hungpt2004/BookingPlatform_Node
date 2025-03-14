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
  }, 
  year: { 
    type: Number, 
    required: true,
    default: 2025
  }, 
  amount: { 
    type: Number, 
    required: true ,
    default: 0
  }, 
  status: { 
    type: String, 
    enum: ['PENDING', 'PAID'], 
    default: 'PENDING' 
  }, // Trạng thái thanh toán
  paymentDate: {
    type: Date,
    required: true,
    default: null
  }
}, { timestamps: true }, {versionKey: false});

module.exports = mongoose.model('MonthlyPayment', monthlyPaymentSchema);
