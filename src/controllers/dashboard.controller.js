const dashboardService = require("../services/dashboard.service");

exports.getDashboard = async (req, res, next) => {
  try {
    const user = req.user; // from auth middleware

    let data;

    if (user.role === "TRAVELER") {
      data = await dashboardService.getTravelerDashboard(user.id);
    } 
    else if (user.role === "SENDER") {
      data = await dashboardService.getSenderDashboard(user.id);
    } 
    else if (user.role === "ADMIN") {
      data = await dashboardService.getAdminDashboard();
    } 
    else {
      return res.status(403).json({ message: "Invalid role" });
    }

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    next(error);
  }
};
