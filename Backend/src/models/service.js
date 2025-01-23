const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServiceSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  }, // Tên dịch vụ (ví dụ: "Spa", "Gym", "Airport Shuttle")
}, {versionKey: false});

module.exports = mongoose.model('Service', ServiceSchema);