const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createOn: { type: Date, default: new Date().getTime() },
    cmnd: { type: String, require: true },
    updatedAt: { type: Date, default: new Date().getTime() },
    role: { type: String, enum: ["CUSTOMER", "ADMIN", "OWNER"], default: "CUSTOMER" },

    reservations: [
      { type: Schema.Types.ObjectId, ref: "Reservation" },
    ],

    ownedHotels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hotel",
      },
    ], // Mảng các khách sạn người dùng sở hữu (tham chiếu đến Hotel),

    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hotel",
      },
    ], // Mảng các khách sạn yêu thích (tham chiếu đến Hotel)

  },
  { versionKey: false }
);

// Hashing mật khẩu trước khi lưu
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Index hóa email để tìm kiếm nhanh hơn
UserSchema.index({ email: 1 });

module.exports = mongoose.model("User", UserSchema);
