const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// GET /api/dashboard
router.get("/", authMiddleware, dashboardController.getDashboard);

module.exports = router;
