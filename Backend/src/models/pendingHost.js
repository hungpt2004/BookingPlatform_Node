const mongoose = require('mongoose');
const Schema = mongoose.Schema

const pendingHostSchema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, 
  businessName: { 
    type: String, 
    required: true 
  }, 
  businessDocuments: [{ 
    type: String, 
    required: true 
  }], 
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING' 
  }, // Trạng thái xét duyệt
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date 
  }
}, {versionKey: false});

module.exports = mongoose.model('PendingHost', pendingHostSchema);
