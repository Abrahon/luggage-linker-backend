// services/subscription.service.js
const Subscription = require("../models/subscription.model");
const MembershipPlan = require("../models/membershipPlan.model");
const AppError = require("../utils/AppError");

exports.createPendingSubscription = async ({
  userId,
  planId,
  billingCycle,
  stripeSessionId,
}) => {
  const plan = await MembershipPlan.findById(planId);

  if (!plan) throw new AppError("Plan not found", 404);

  const existing = await Subscription.findOne({
    userId,
    status: "active",
  });

  if (existing) {
    throw new AppError("Already subscribed", 400);
  }

  const amount =
    billingCycle === "yearly"
      ? plan.yearlyPrice
      : plan.monthlyPrice;

  return await Subscription.create({
    userId,
    planId,
    billingCycle,
    amount,
    currency: plan.currency,
    status: "pending",
    paymentStatus: "pending",
    stripeSessionId,
    startsAt: new Date(),
    expiresAt: new Date(), // will be updated in webhook
  });
};