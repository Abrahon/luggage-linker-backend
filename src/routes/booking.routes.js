const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking.controller");
const auth = require("../middlewares/auth.middleware");

// sender
router.post("/", auth, bookingController.createBooking);

// carrier actions
router.put("/accept/:id", auth, bookingController.acceptBooking);
router.put("/reject/:id", auth, bookingController.rejectBooking);

// dashboard
router.get("/carrier", auth, bookingController.getCarrierBookings);

module.exports = router;