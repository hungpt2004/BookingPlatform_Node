const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }, 
  quantity: {
    type: Number,
    required: true,
  }, 
}, {versionKey: false});

module.exports = mongoose.model("Bed", bedSchema);
