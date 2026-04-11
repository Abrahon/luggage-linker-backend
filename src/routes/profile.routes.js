const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profile.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

// 👤 GET PROFILE
router.get("/", authMiddleware, profileController.getProfile);

// ✏️ UPDATE PROFILE (name + image)
router.put(
  "/",
  authMiddleware,
  upload.single("profilePhoto"),
  profileController.updateProfile
);

module.exports = router;