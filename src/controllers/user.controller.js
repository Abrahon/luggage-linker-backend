const User = require("../models/user.model");

// --- DELETE USER ---
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params; // user ID to delete
    const requester = req.user; // decoded from auth middleware

    if (!id) return res.status(400).json({ message: "User ID required" });

    // Only admin or self can delete
    if (requester.role !== "admin" && requester.id !== id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};


// --- GET ALL USERS (ADMIN) ---
exports.getAllUsers = async (req, res, next) => {
  try {
    const requester = req.user;

    // 🔐 Only admin allowed
    if (requester.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Optional query params
    const { page = 1, limit = 10, search } = req.query;

    const query = {};

    // 🔍 Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(query)
      .select("-password -refreshToken -otp -verificationToken") // hide sensitive data
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      users,
    });

  } catch (err) {
    next(err);
  }
};