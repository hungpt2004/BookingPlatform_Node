const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refundingReservationSchema = new Schema({
  reservation: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Reservation', 
    required: true 
  },
  refundAmount: { 
    type: Number, 
    required: true 
  }, // Số tiền hoàn trả
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED'], 
    default: 'PENDING' 
  }, // Trạng thái yêu cầu
  requestDate: { 
    type: Date, 
    default: Date.now 
  }, // Ngày gửi yêu cầu
  decisionDate: { 
    type: Date 
  } // Ngày quyết định (nếu có)
}, { timestamps: true }, {versionKey: false});

module.exports = mongoose.model('RefundingReservation', refundingReservationSchema);