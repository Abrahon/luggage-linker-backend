
const MembershipPlan = require("../models/membershipPlan.model");
const Subscription = require("../models/subscription.model");
const User = require("../models/user.model");

// ======================================
// GET ALL PLANS
// ======================================

exports.getPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET SINGLE PLAN
// ======================================

exports.getSinglePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(
      req.params.id
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// SUBSCRIBE PLAN
// ======================================

exports.subscribePlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const { planId, billingCycle } = req.body;

    const plan = await MembershipPlan.findById(
      planId
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found",
      });
    }

    const amount =
      billingCycle === "yearly"
        ? plan.yearlyPrice
        : plan.monthlyPrice;

    const startsAt = new Date();

    const expiresAt = new Date();

    if (billingCycle === "yearly") {
      expiresAt.setFullYear(
        expiresAt.getFullYear() + 1
      );
    } else {
      expiresAt.setMonth(
        expiresAt.getMonth() + 1
      );
    }

    const subscription =
      await Subscription.create({
        userId,
        planId,
        billingCycle,
        amount,
        status: "active",
        paymentStatus: "paid",
        startsAt,
        expiresAt,
      });

    await User.findByIdAndUpdate(userId, {
      membership: {
        tier: plan.name,
        planId: plan._id,
        subscriptionId: subscription._id,
        status: "active",
        startedAt: startsAt,
        expiresAt,
      },
    });

    return res.status(201).json({
      success: true,
      message:
        "Membership subscribed successfully",
      data: subscription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET MY SUBSCRIPTION
// ======================================

exports.getMySubscription = async (
  req,
  res
) => {
  try {
    const subscription =
      await Subscription.findOne({
        userId: req.user.id,
        status: "active",
      })
        .populate("planId")
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// CANCEL SUBSCRIPTION
// ======================================

exports.cancelSubscription = async (
  req,
  res
) => {
  try {
    const subscription =
      await Subscription.findOne({
        userId: req.user.id,
        status: "active",
      });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message:
          "No active subscription found",
      });
    }

    subscription.status = "cancelled";

    subscription.cancelledAt = new Date();

    subscription.autoRenew = false;

    await subscription.save();

    await User.findByIdAndUpdate(
      req.user.id,
      {
        "membership.status":
          "cancelled",
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Subscription cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// CHANGE PLAN
// ======================================

exports.changePlan = async (req, res) => {
  try {
    const { newPlanId } = req.body;

    const plan =
      await MembershipPlan.findById(
        newPlanId
      );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    await User.findByIdAndUpdate(
      req.user.id,
      {
        "membership.tier": plan.name,
        "membership.planId":
          plan._id,
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Membership plan updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// RENEW SUBSCRIPTION
// ======================================

exports.renewSubscription = async (
  req,
  res
) => {
  try {
    const subscription =
      await Subscription.findOne({
        userId: req.user.id,
      });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message:
          "Subscription not found",
      });
    }

    const expiresAt =
      subscription.expiresAt;

    expiresAt.setMonth(
      expiresAt.getMonth() + 1
    );

    subscription.expiresAt =
      expiresAt;

    subscription.status = "active";

    await subscription.save();

    await User.findByIdAndUpdate(
      req.user.id,
      {
        "membership.expiresAt":
          expiresAt,
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Subscription renewed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// ADMIN CREATE PLAN
// ======================================

exports.createPlan = async (req, res) => {
  try {
    const plan =
      await MembershipPlan.create(
        req.body
      );

    return res.status(201).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// ADMIN UPDATE PLAN
// ======================================

exports.updatePlan = async (req, res) => {
  try {
    const plan =
      await MembershipPlan.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    return res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// ADMIN DELETE PLAN
// ======================================

exports.deletePlan = async (req, res) => {
  try {
    await MembershipPlan.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Membership plan deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};