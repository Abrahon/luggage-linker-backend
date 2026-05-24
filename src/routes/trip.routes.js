const express = require("express");
const router = express.Router();

const tripController = require("../controllers/trip.controller");
const auth = require("../middlewares/auth.middleware");

// ➕ CREATE
router.post("/add", auth, tripController.createTrip);

// 📋 GET ALL
router.get("/list", tripController.getAllTrips);

// 👤 GET SINGLE
router.get("/list/:id", tripController.getTripById);
// console.log("🚀 Trip routes loaded");

// ✏️ UPDATE
router.put("/:id", auth, tripController.updateTrip);

// ❌ DELETE
router.delete("/:id", auth, tripController.deleteTrip);

module.exports = router;