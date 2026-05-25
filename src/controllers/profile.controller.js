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



exports.updateProfile = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.id;

    const {
      firstName,
      lastName,
      bio,
      city,
      country,
    } = req.body;

    const updatedFields = {};

    // =========================
    // FIND USER
    // =========================

    const user = await User.findById(
      userId
    );

    const profile =
      await Profile.findOne({
        user: userId,
      });

    if (!user || !profile) {
      return res.status(404).json({
        message:
          "User/Profile not found",
      });
    }

    // =========================
    // UPDATE USER
    // =========================

    if (firstName) {
      user.firstName = firstName;

      updatedFields.firstName =
        firstName;
    }

    if (lastName) {
      user.lastName = lastName;

      updatedFields.lastName =
        lastName;
    }

    if (city) {
      user.city = city;

      updatedFields.city = city;
    }

    if (country) {
      user.country = country;

      updatedFields.country =
        country;
    }

    // =========================
    // UPDATE PROFILE
    // =========================

    if (bio) {
      profile.bio = bio;

      updatedFields.bio = bio;
    }

    // =========================
    // PROFILE PHOTO
    // =========================

    if (req.file) {
      const result =
        await cloudinary.uploader.upload(
          req.file.path
        );

      profile.profilePhoto =
        result.secure_url;

      updatedFields.profilePhoto =
        result.secure_url;
    }

    // =========================
    // SAVE
    // =========================

    await user.save();

    await profile.save();

    // =========================
    // RESPONSE
    // =========================

    res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",

      updatedFields,
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