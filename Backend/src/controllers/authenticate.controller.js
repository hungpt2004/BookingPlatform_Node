require("dotenv").config();
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { promisify } = require("util");
const User = require("../models/user");
const AppError = require("../utils/appError");
const asyncHandler = require("../middlewares/asyncHandler");
const catchAsync = require("../utils/catchAsync.js");

const {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} = require("../templates/emailTemplates.js");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

// JWT Token Generator
const signToken = (id) =>
  jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });

// Send JWT Token in Response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

// Send OTP
const sendOTP = async (email, verificationToken) => {
  try {
    await transporter.sendMail({
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify your email address",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });
  } catch (err) {
    console.error("Email or DB error:", err);
  }
};

// Signup
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Name, email, and password are required", 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError("User already exists", 409));
  }

  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  console.log(`Verification Token: ${verificationToken}`);

  const hashedToken = await bcrypt.hash(verificationToken, 10);

  const newUser = await User.create({
    name,
    email,
    password, // Hash the password
    isVerified: false,
    verificationToken: hashedToken,
    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  // Send OTP
  await sendOTP(email, verificationToken);

  res.status(201).json({
    status: "success",
    verificationToken,
    data: {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    },
  });
});

// Email Verification (corrected)
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return next(new AppError("UserId and OTP are required", 400));
  }

  const user = await User.findOne({
    email,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or expired verification request", 400));
  }

  // Compare the OTP
  const isValidOTP = await bcrypt.compare(otp, user.verificationToken);

  if (!isValidOTP) {
    return next(new AppError("Invalid OTP", 400));
  }

  // Update user as verified
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Email verified successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
});

// Resend Email Verification
exports.resendEmailVerification = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.isVerified) {
    return next(new AppError("Email is already verified", 400));
  }

  // Generate a new verification token
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const hashedToken = await bcrypt.hash(verificationToken, 10);

  // Update the user with the new token and expiration time
  user.verificationToken = hashedToken;
  user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await user.save();

  // Send the new OTP
  await sendOTP(email, verificationToken);

  res.status(200).json({
    status: "success",
    message: "Verification email resent successfully",
  });
});

// Login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

// Google Login
exports.googleLogin = catchAsync(async (req, res, next) => {
  const { credential } = req.body;

  if (!credential) {
    return next(new AppError("Please provide a Google credential", 400));
  }

  // Verify the Google token
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GG_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name, picture } = payload;

  // Check if user exists
  let user = await User.findOne({ email });

  if (!user) {
    // Create new user if doesn't exist
    const randomPassword = crypto.randomBytes(20).toString("hex");
    user = await User.create({
      email,
      name,
      password: randomPassword,
      isVerified: true, // Google users are automatically verified
      picture, // Save profile picture URL if needed
    });
  } else {
    return res.status(403).json({
      error: true,
      message: "User already exist",
    });
  }

  // Create and send JWT token
  createSendToken(user, 200, res);
});

// Logout
exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
};

// Forgot Password with Reset Link
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

  console.log("Reset token:", resetToken);

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiresAt = resetTokenExpiresAt;

  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Send email with reset link
  await transporter.sendMail({
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Password Reset Request",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
      "{userName}",
      user.name || "User"
    )
      .replace("{resetURL}", resetLink)
      .replace("{currentYear}", new Date().getFullYear()),
  });

  res.status(200).json({
    status: "success",
    message: "Password reset link sent to your email.",
  });
});

// Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired reset token" });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Password reset successful" });
});

// Protect Middleware
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You are not logged in!", 401));
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.ACCESS_TOKEN_SECRET
  );
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("User does not exist.", 401));
  }

  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(new AppError("Password changed recently! Log in again.", 401));
  // }

  req.user = currentUser;
  next();
});

// Restrict Middleware
exports.restrictTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Permission denied", 403));
    }
    next();
  });
