// webhooks/stripe.webhook.js
const stripe = require("../config/stripe");
const Subscription = require("../models/subscription.model");
const User = require("../models/user.model");

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ PAYMENT SUCCESS
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const { userId, planId, billingCycle } = session.metadata;

    const subscription = await Subscription.findOne({
      stripeSessionId: session.id,
    });

    if (!subscription) return res.status(404).end();

    const expiresAt = new Date();

    if (billingCycle === "yearly") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    subscription.status = "active";
    subscription.paymentStatus = "paid";
    subscription.startsAt = new Date();
    subscription.expiresAt = expiresAt;

    await subscription.save();

    await User.findByIdAndUpdate(userId, {
      "membership.status": "active",
      "membership.planId": planId,
      "membership.expiresAt": expiresAt,
    });
  }

  res.json({ received: true });
};