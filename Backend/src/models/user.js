const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { validate } = require('./hotel');
const { verify } = require('jsonwebtoken');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String /*required: [true, 'Please tell us your name!'] */ },
    email: {
      type: String,
      required: [true, 'Email is required!'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email!'],
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
      select: false,
    },
    createOn: { type: Date, default: new Date().getTime() },
    cmnd: { type: String, require: true },
    updatedAt: { type: Date, default: new Date().getTime() },
    role: {
      type: String,
      enum: ['CUSTOMER', 'ADMIN', 'OWNER'],
      default: 'CUSTOMER',
    },
    reservations: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' },
    ],

    ownedHotels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
      },
    ], // Mảng các khách sạn người dùng sở hữu (tham chiếu đến Hotel),

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
      },
    ], // Mảng các khách sạn yêu thích (tham chiếu đến Hotel)

    //MẢNG BUSSINESS DOCUMENT

    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true },
  { versionKey: false },
);

// Hashing mật khẩu trước khi lưu
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Index hóa email để tìm kiếm nhanh hơn
UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);