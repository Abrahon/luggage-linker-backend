const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const cloudinary = require("../utils/cloudinary");

// 👤 GET PROFILE
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const profile = await Profile.findOne({ user: userId }).populate(
      "user",
      "email role isVerified"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
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