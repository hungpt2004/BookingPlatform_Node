const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FacilitySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    hotels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hotel",
      },
    ], // Mảng các khách sạn người dùng sở hữu (tham chiếu đến Hotel),
  },
  { versionKey: false }
);

module.exports = mongoose.model("Facility", FacilitySchema);
