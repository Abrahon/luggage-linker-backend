// jobs/subscription.cron.js
const cron = require("node-cron");
const Subscription = require("../models/subscription.model");

cron.schedule("0 0 * * *", async () => {
  console.log("Running subscription expiry job...");

  await Subscription.updateMany(
    {
      status: "active",
      expiresAt: { $lt: new Date() },
    },
    {
      status: "expired",
    }
  );
});