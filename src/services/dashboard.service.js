const Trip = require("../models/trip.model");
const Package = require("../models/package.model");
const Booking = require("../models/booking.model");
const Payment = require("../models/payment.model");
const User = require("../models/user.model");
const Dispute = require("../models/dispute.model");

// ================= TRAVELER DASHBOARD =================
exports.getTravelerDashboard = async (userId) => {
  const trips = await Trip.find({ traveler: userId });
  const bookings = await Booking.find({ traveler: userId });

  const earnings = await Payment.aggregate([
    { $match: { payee: userId, status: "RELEASED" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return {
    totalTrips: trips.length,
    activeTrips: trips.filter(t => t.status === "OPEN").length,
    totalBookings: bookings.length,
    totalEarnings: earnings[0]?.total || 0,
  };
};

// ================= SENDER DASHBOARD =================
exports.getSenderDashboard = async (userId) => {
  const packages = await Package.find({ sender: userId });
  const bookings = await Booking.find({ sender: userId });

  const spending = await Payment.aggregate([
    { $match: { payer: userId, status: "RELEASED" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return {
    totalPackages: packages.length,
    activePackages: packages.filter(p => p.status === "PENDING").length,
    totalBookings: bookings.length,
    totalSpending: spending[0]?.total || 0,
  };
};

// ================= ADMIN DASHBOARD =================
exports.getAdminDashboard = async () => {
  const totalUsers = await User.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const totalDisputes = await Dispute.countDocuments();

  const revenue = await Payment.aggregate([
    { $match: { status: "RELEASED" } },
    { $group: { _id: null, total: { $sum: "$platformFee" } } },
  ]);

  return {
    totalUsers,
    totalBookings,
    totalDisputes,
    totalRevenue: revenue[0]?.total || 0,
  };
};