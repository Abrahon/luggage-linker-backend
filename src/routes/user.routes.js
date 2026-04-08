const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

// DELETE /api/users/:id (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, userController.deleteUser);

// GET /api/users (admin only)
router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);

module.exports = router;