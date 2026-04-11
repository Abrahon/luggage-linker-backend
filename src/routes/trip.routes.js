const express = require("express");
const router = express.Router();

const tripController = require("../controllers/trip.controller");
const auth = require("../middlewares/auth.middleware");

// ➕ CREATE
router.post("/", auth, tripController.createTrip);

// 📋 GET ALL
router.get("/", tripController.getAllTrips);

// 👤 GET SINGLE
router.get("/:id", tripController.getTripById);

// ✏️ UPDATE
router.put("/:id", auth, tripController.updateTrip);

// ❌ DELETE
router.delete("/:id", auth, tripController.deleteTrip);

module.exports = router;