const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");

// ✅ AUTH ROUTES
router.post("/signup", auth.signup);
router.post("/verify-email", auth.verifyEmail); 
router.post("/login", auth.login);
router.post("/refresh-token", auth.refreshToken);
router.post("/logout", auth.logout);
router.post("/forgot-password", auth.forgotPassword);
router.post("/verify-otp", auth.verifyOTP);
router.post("/reset-password", auth.resetPassword);
router.post("/resend-otp", auth.resendOTP);

module.exports = router;
