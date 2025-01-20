const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacilitySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String }
}, {versionKey: false});

module.exports = mongoose.model('Facility', FacilitySchema);
