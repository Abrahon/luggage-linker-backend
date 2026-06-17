// routes/subscription.routes.js
const router = require("express").Router();
const { stripeWebhook } = require("../controllers/subscription.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const membershipController = require("../controllers/subscription.controller");

const {
  createCheckoutSession,
} = require("../controllers/subscription.controller");

const auth = require("../middlewares/auth.middleware");

router.post("/checkout", auth, createCheckoutSession);
router.post("/webhook",stripeWebhook);
// My subscription
router.get(
  "/my-subscription",
  authMiddleware,
  membershipController.getMySubscription
);
  
  


module.exports = router;