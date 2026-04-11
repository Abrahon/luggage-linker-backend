const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const cloudinary = require("../utils/cloudinary");

// 👤 GET PROFILE
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let profile = await Profile.findOne({ user: userId }).populate(
      "user",
      "email role isVerified"
    );

    // ✅ AUTO CREATE IF NOT EXISTS
    if (!profile) {
      const user = await User.findById(userId);

      profile = await Profile.create({
        user: userId,
        name: user.name,
        email: user.email,
      });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    next(err);
  }
};



exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { name } = req.body;
    const file = req.file;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // ✅ update name
    if (name) {
      profile.name = name;
    }

    // ✅ upload image to cloudinary
    if (file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "luggage-linker/profiles" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(file.buffer);
      });

      profile.profilePhoto = result.secure_url;
    }

    await profile.save();

    res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (err) {
    next(err);
  }
};


// security
const bcrypt = require("bcryptjs");
// const User = require("../models/user.model");

// 🔐 CHANGE PASSWORD
exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // ✅ check all fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ✅ check new password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // ✅ update password
    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      message: "Password changed successfully",
    });

  } catch (err) {
    next(err);
  }
};