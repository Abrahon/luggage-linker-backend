// middlewares/subscription.middleware.js
const Subscription = require("../models/subscription.model");

exports.requireActiveSubscription = async (req, res, next) => {
  const sub = await Subscription.findOne({
    userId: req.user.id,
    status: "active",
  });

  if (!sub || sub.expiresAt < new Date()) {
    return res.status(403).json({
      message: "Subscription required or expired",
    });
  }

  req.subscription = sub;
  next();
};