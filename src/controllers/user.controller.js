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

// GET ALL USERS (Admin Only) - Production Ready
exports.getAllUsers = async (req, res, next) => {
  try {
    // ✅ Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // ✅ Optional filtering by role or verification status
    const { role, isVerified, search } = req.query;
    const query = {};

    if (role) query.role = role.toLowerCase();
    if (isVerified !== undefined) query.isVerified = isVerified === "true";

    if (search) {
      // ✅ Search by name or email (case-insensitive)
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Total count for pagination
    const totalUsers = await User.countDocuments(query);

    // ✅ Fetch users with pagination
    const users = await User.find(query)
      .select("-password -otp -otpExpire -resetToken -resetTokenExpire -refreshToken") // hide sensitive fields
      .sort({ createdAt: -1 }) // latest users first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (err) {
    next(err);
  }
};