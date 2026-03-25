const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const generateAccessToken = require("../../src/utils/generateAccessToken");
const generateRefreshToken = require("../../src/utils/generateRefreshToken");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- SIGNUP ---
exports.signup = async (req, res, next) => {
  try {
    // Make sure req.body is defined
    if (!req.body) return res.status(400).json({ message: "No data provided" });

    const { name, email, password, confirmPassword, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user in DB, include role
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "sender", // default to "sender" if no role provided
      verificationToken,
      verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000, // 24h
    });

    // Send verification email
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&email=${email}`;
    await transporter.sendMail({
      to: email,
      subject: "Verify Your Email",
      html: `<h2>Click to verify your email: <a href="${verifyUrl}">Verify Email</a></h2>`,
    });

    res.status(201).json({
      message: "Signup successful. Please verify your email before login.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    next(err);
  }
};

// --- VERIFY EMAIL ---
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token, email } = req.query;
    const user = await User.findOne({ email });

    if (
      !user ||
      user.isVerified ||
      user.verificationToken !== token ||
      user.verificationTokenExpire < Date.now()
    )
      return res.status(400).json({ message: "Invalid or expired token" });

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpire = null;
    await user.save();

    res.json({ message: "Email verified successfully. You can now login." });
  } catch (err) {
    next(err);
  }
};

// --- LOGIN ---
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

// --- REFRESH TOKEN ---
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required" });

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
};

// --- LOGOUT ---
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

// --- FORGOT PASSWORD (SEND OTP) ---
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.otp = hashedOTP;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: "Your Password Reset OTP",
      html: `<h2>Your OTP: ${otp}</h2>`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    next(err);
  }
};

// --- VERIFY OTP ---
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.otp || user.otpExpire < Date.now())
      return res.status(400).json({ message: "OTP expired or invalid" });

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    res.json({ message: "OTP verified" });
  } catch (err) {
    next(err);
  }
};

// --- RESET PASSWORD ---
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.otp || user.otpExpire < Date.now())
      return res.status(400).json({ message: "OTP expired or invalid" });

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};
