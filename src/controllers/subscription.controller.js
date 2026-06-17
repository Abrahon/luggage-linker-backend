const MembershipPlan = require("../models/membershipPlan.model");
const Subscription = require("../models/subscription.model");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const stripe = require("../config/stripe");
const subscriptionService = require("../services/subscription.service");


// exports.createCheckoutSession = asyncHandler(async (req, res) => {
//   const { planId, billingCycle } = req.body;

//   const plan = await MembershipPlan.findById(planId);

//   if (!plan) {
//     return res.status(404).json({
//       success: false,
//       message: "Plan not found",
//     });
//   }

//   const price =
//     billingCycle === "yearly"
//       ? plan.yearlyPrice
//       : plan.monthlyPrice;

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     mode: "payment",

//     customer_email: req.user.email,

//     line_items: [
//       {
//         price_data: {
//           currency: plan.currency.toLowerCase(),
//           product_data: {
//             name: plan.displayName,
//           },
//           unit_amount: price * 100,
//         },
//         quantity: 1,
//       },
//     ],

//     success_url: `${process.env.CLIENT_URL}/success`,
//     cancel_url: `${process.env.CLIENT_URL}/cancel`,

//     metadata: {
//       userId: req.user.id,
//       planId: planId,
//       billingCycle,
//     },
//   });

//   // create pending subscription
//   await subscriptionService.createPendingSubscription({
//     userId: req.user.id,
//     planId,
//     billingCycle,
//     stripeSessionId: session.id,
//   });

//   res.json({
//     success: true,
//     url: session.url,
//   });
// });

exports.createCheckoutSession = asyncHandler(async (req, res) => {
  const { planId, billingCycle } = req.body;

  const plan = await MembershipPlan.findById(planId);

  if (!plan) {
    throw new AppError("Plan not found", 404);
  }

  const price =
    billingCycle === "yearly"
      ? plan.yearlyPrice
      : plan.monthlyPrice;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    customer_email: req.user.email,

    line_items: [
      {
        price_data: {
          currency: plan.currency.toLowerCase(),
          product_data: {
            name: plan.displayName,
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,

    metadata: {
      userId: req.user.id,
      planId: planId,
      billingCycle,
    },
  });

  // ✅ create pending subscription (IMPORTANT FIX)
  await Subscription.create({
    userId: req.user.id,
    planId,
    billingCycle,
    amount: price,
    status: "pending",
    paymentStatus: "pending",
    startsAt: new Date(),
    expiresAt: new Date(),
    stripeSessionId: session.id,
  });

  res.json({
    success: true,
    url: session.url,
  });
});


// ======================================
// STRIPE WEBHOOK (PRODUCTION READY)
// ======================================
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  // =========================
  // VERIFY STRIPE SIGNATURE
  // =========================
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("📩 Stripe Event Received:", event.type);

  // =========================
  // HANDLE EVENTS
  // =========================
  try {
    switch (event.type) {

      // ======================================
      // PAYMENT SUCCESS
      // ======================================
      case "checkout.session.completed": {
        const session = event.data.object;

        const { userId, planId, billingCycle } = session.metadata;

        // Find subscription by session ID
        const subscription = await Subscription.findOne({
          stripeSessionId: session.id,
        });

        if (!subscription) {
          console.log("⚠️ Subscription not found for session:", session.id);
          break;
        }

        // Prevent duplicate processing (IMPORTANT)
        if (subscription.status === "active") {
          console.log("ℹ️ Already activated subscription");
          break;
        }

        // =========================
        // CALCULATE EXPIRY DATE
        // =========================
        const expiresAt = new Date();

        if (billingCycle === "yearly") {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        } else {
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        }

        // =========================
        // UPDATE SUBSCRIPTION
        // =========================
        subscription.status = "active";
        subscription.paymentStatus = "paid";
        subscription.expiresAt = expiresAt;

        await subscription.save();

        // =========================
        // UPDATE USER MEMBERSHIP
        // =========================
        await User.findByIdAndUpdate(userId, {
          "membership.status": "active",
          "membership.planId": planId,
          "membership.expiresAt": expiresAt,
        });

        console.log("✅ Subscription activated for user:", userId);
        break;
      }

      // ======================================
      // PAYMENT FAILED
      // ======================================
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        console.log("❌ Payment failed:", paymentIntent.id);

        await Subscription.updateOne(
          { stripePaymentIntentId: paymentIntent.id },
          {
            status: "failed",
            paymentStatus: "failed",
          }
        );

        break;
      }

      // ======================================
      // DEFAULT HANDLER
      // ======================================
      default:
        console.log("⚠️ Unhandled event type:", event.type);
    }

    // Always return 200 to Stripe
    res.json({ received: true });

  } catch (error) {
    console.error("🔥 Webhook processing error:", error);
    return res.status(500).json({ error: "Webhook handler failed" });
  }
};


// susbcription.controller.js
exports.getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.find({
      userId: req.user.id,
    })
      .populate("planId")
      .sort({ createdAt: -1 })
      .limit(1);

    return res.status(200).json({
      success: true,
      data: subscription[0] || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};