const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const generateAccessToken = require("../../src/utils/generateAccessToken");
const generateRefreshToken = require("../../src/utils/generateRefreshToken");
// const sendOtpEmail = require("../../src/utils/emailTemplates" );
const { sendOtpEmail } = require("../utils/emailTemplates");


// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.signup = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "No data provided" });
    }

    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });

    // 🔥 CASE 1: Email exists & VERIFIED
    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    let user;

    // 🔥 CASE 2: Email exists but NOT VERIFIED → UPDATE
    if (existingUser && !existingUser.isVerified) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.role = role || "sender";
      existingUser.otp = hashedOTP;
      existingUser.otpExpire = Date.now() + 10 * 60 * 1000;

      user = await existingUser.save();
    } 
    // 🔥 CASE 3: New user → CREATE
    else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "sender",
        otp: hashedOTP,
        otpExpire: Date.now() + 10 * 60 * 1000,
        isVerified: false,
      });
    }

    // 🔥 Send OTP Email
    await transporter.sendMail({
      from: `"LuggageLinker" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Account - OTP",
      html: sendOtpEmail(name, otp), // ✅ TEMPLATE USED HERE
    });
    res.status(201).json({
      message: "OTP sent to email. Please verify your account.",
      email: user.email,
    });

  } catch (err) {
    console.error("Signup error:", err);
    next(err);
  }
};


exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Verify user
    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.json({
      message: "Account verified successfully. You can now login.",
    });

  } catch (err) {
    next(err);
  }
};



// resend otp
exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.otp = hashedOTP;
    user.otpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      to: email,
      subject: "Resend OTP",
      html: `<h2>Your new OTP: ${otp}</h2>`,
    });

    res.json({ message: "OTP resent successfully" });

  } catch (err) {
    next(err);
  }
};


// --- LOGIN ---

exports.login = async (req, res, next) => {
  try {
    console.log("Login body:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.isVerified)
      return res.status(403).json({ message: "Please verify your email first." });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    console.log("JWT ACCESS SECRET:", process.env.JWT_ACCESS_SECRET);
    console.log("JWT REFRESH SECRET:", process.env.JWT_REFRESH_SECRET);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    console.log("AccessToken generated:", accessToken);
    console.log("RefreshToken generated:", refreshToken);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
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


// exports.verifyOTP = async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;

//     const user = await User.findOne({ email });

//     if (!user || !user.otp || user.otpExpire < Date.now()) {
//       return res.status(400).json({
//         message: "OTP expired or invalid",
//       });
//     }

//     const isMatch = await bcrypt.compare(otp, user.otp);

//     if (!isMatch) {
//       return res.status(400).json({
//         message: "Invalid OTP",
//       });
//     }

//     // ✅ GENERATE RESET TOKEN (THIS IS MISSING IN YOUR CODE)
//     const resetToken = crypto.randomBytes(32).toString("hex");

//     user.resetToken = resetToken;
//     user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 min

//     // ✅ CLEAR OTP AFTER SUCCESS
//     user.otp = null;
//     user.otpExpire = null;

//     await user.save();

//     // ✅ SEND TOKEN IN RESPONSE
//     res.json({
//       message: "OTP verified successfully",
//       resetToken, // 🔥 IMPORTANT
//     });

//   } catch (err) {
//     next(err);
//   }
// };

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000;

    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.json({
      message: "OTP verified successfully",
      resetToken,
    });

  } catch (err) {
    next(err);
  }
};


// --- RESET PASSWORD ---

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, resetToken, newPassword, confirmPassword } = req.body;

    if (!email || !resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const user = await User.findOne({ email });

    // ✅ Validate reset token
    if (
      !user ||
      !user.resetToken ||
      user.resetToken !== resetToken ||
      user.resetTokenExpire < Date.now()
    ) {
      return res.status(403).json({
        message: "Invalid or expired reset token",
      });
    }

    // ✅ Update password
    user.password = await bcrypt.hash(newPassword, 10);

    // ✅ Clear token
    user.resetToken = null;
    user.resetTokenExpire = null;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    next(err);
  }
};

// user controller
// const User = require("../models/user.model");
