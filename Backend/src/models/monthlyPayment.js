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
    required: true 
  }, 
  amount: { 
    type: Number, 
    required: true 
  }, 
  status: { 
    type: String, 
    enum: ['PENDING', 'PAID'], 
    default: 'PENDING' 
  }, // Trạng thái thanh toán
}, { timestamps: true }, {versionKey: false});

module.exports = mongoose.model('MonthlyPayment', monthlyPaymentSchema);
