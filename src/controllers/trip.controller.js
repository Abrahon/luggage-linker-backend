const Trip = require("../models/trip.model");

// ➕ CREATE TRIP

const Location = require("../models/location.model");

exports.createTrip = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      origin,
      destination,
      departureDate,
      arrivalDate,
      luggageCapacityKg,
      availableCapacityKg,
      note,
      pricePerKg,
    } = req.body;

    // ❌ STEP 1: find or create origin
    let originLocation = await Location.findOne({ name: origin });

    if (!originLocation) {
      originLocation = await Location.create({ name: origin });
    }

    // ❌ STEP 2: find or create destination
    let destinationLocation = await Location.findOne({ name: destination });

    if (!destinationLocation) {
      destinationLocation = await Location.create({ name: destination });
    }

    // ✅ STEP 3: NOW use ObjectIds
    const trip = await Trip.create({
      traveler: userId,
      origin: originLocation._id,
      destination: destinationLocation._id,
      departureDate,
      arrivalDate,
      luggageCapacityKg,
      availableCapacityKg: availableCapacityKg || luggageCapacityKg,
      note,
      pricePerKg,
      status: "OPEN",
    });

    res.status(201).json({
      message: "Trip created successfully",
      trip,
    });
  } catch (err) {
    next(err);
  }
};

// trip mlist
exports.getAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ isActive: true })
      .populate("traveler", "name email")
      .populate("origin")
      .populate("destination")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (err) {
    next(err);
  }
};


// single trip
exports.getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("traveler", "name email")
      .populate("origin")
      .populate("destination");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({
      success: true,
      trip,
    });
  } catch (err) {
    next(err);
  }
};

// update trip
exports.updateTrip = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // 🔐 only owner can update
    if (trip.traveler.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const {
      origin,
      destination,
      departureDate,
      arrivalDate,
      luggageCapacityKg,
      availableCapacityKg,
      note,
      pricePerKg,
      status,
    } = req.body;

    if (origin) trip.origin = origin;
    if (destination) trip.destination = destination;
    if (departureDate) trip.departureDate = departureDate;
    if (arrivalDate) trip.arrivalDate = arrivalDate;
    if (luggageCapacityKg) trip.luggageCapacityKg = luggageCapacityKg;
    if (availableCapacityKg) trip.availableCapacityKg = availableCapacityKg;
    if (note) trip.note = note;
    if (pricePerKg) trip.pricePerKg = pricePerKg;
    if (status) trip.status = status;

    await trip.save();

    res.json({
      message: "Trip updated successfully",
      trip,
    });
  } catch (err) {
    next(err);
  }
};


// delete trip
exports.deleteTrip = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.traveler.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    trip.status = "CANCELLED";
    trip.isActive = false;

    await trip.save();

    res.json({
      message: "Trip cancelled successfully",
    });
  } catch (err) {
    next(err);
  }
};

// update capacity after booking
exports.updateCapacity = async (tripId, bookedKg) => {
  const trip = await Trip.findById(tripId);

  if (!trip) return;

  trip.availableCapacityKg -= bookedKg;

  if (trip.availableCapacityKg <= 0) {
    trip.status = "BOOKED";
  }

  await trip.save();
};