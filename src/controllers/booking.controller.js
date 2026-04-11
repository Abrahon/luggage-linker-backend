const Booking = require("../models/booking.model");
const Trip = require("../models/trip.model");

// 📦 SEND REQUEST (SENDER)
exports.createBooking = async (req, res, next) => {
  try {
    const senderId = req.user.id;

    const { tripId, weightKg, message, images } = req.body;

    if (!tripId || !weightKg) {
      return res.status(400).json({
        message: "Trip and weight are required",
      });
    }

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // ❌ check capacity
    if (trip.availableCapacityKg < weightKg) {
      return res.status(400).json({
        message: "Not enough capacity available",
      });
    }

    const booking = await Booking.create({
      sender: senderId,
      traveler: trip.traveler,
      trip: tripId,
      weightKg,
      message,
      images: images || [],
      status: "PENDING",
    });

    res.status(201).json({
      message: "Request sent to carrier",
      booking,
    });
  } catch (err) {
    next(err);
  }
};


// carrier accepet
exports.acceptBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId).populate("trip");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔐 only carrier can accept
    if (booking.traveler.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "ACCEPTED";

    // 📦 reduce capacity
    const trip = await Trip.findById(booking.trip._id);
    trip.availableCapacityKg -= booking.weightKg;

    if (trip.availableCapacityKg <= 0) {
      trip.status = "BOOKED";
    }

    await trip.save();
    await booking.save();

    res.json({
      message: "Booking accepted",
      booking,
    });
  } catch (err) {
    next(err);
  }
};

// rejected
exports.rejectBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;

    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.traveler.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "REJECTED";
    booking.rejectedReason = reason || "No reason provided";

    await booking.save();

    res.json({
      message: "Booking rejected",
      booking,
    });
  } catch (err) {
    next(err);
  }
};

// carrier dashabord
exports.getCarrierBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ traveler: userId })
      .populate("sender", "name email")
      .populate("trip")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (err) {
    next(err);
  }
};