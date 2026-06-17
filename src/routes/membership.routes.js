const express = require("express");

const router = express.Router();

const membershipController = require("../controllers/membership.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

// ======================================
// PUBLIC
// ======================================

// Get all plans
router.get(
  "/plans",
  membershipController.getPlans
);

// Get single plan
router.get(
  "/plans/:id",
  membershipController.getSinglePlan
);

// ======================================
// USER SUBSCRIPTION
// ======================================

// Subscribe to a plan
router.post(
  "/subscribe",
  authMiddleware,
  membershipController.subscribePlan
);



// Cancel subscription
router.patch(
  "/cancel",
  authMiddleware,
  membershipController.cancelSubscription
);

// Change plan
router.patch(
  "/change-plan",
  authMiddleware,
  membershipController.changePlan
);

// Renew subscription
router.patch(
  "/renew",
  authMiddleware,
  membershipController.renewSubscription
);

// ======================================
// ADMIN
// ======================================

// Create membership plan
router.post(
  "/admin/plans",
  authMiddleware,
  adminMiddleware,
  membershipController.createPlan
);

// Update plan
router.patch(
  "/admin/plans/:id",
  authMiddleware,
  adminMiddleware,
  membershipController.updatePlan
);

// Delete plan
router.delete(
  "/admin/plans/:id",
  authMiddleware,
  adminMiddleware,
  membershipController.deletePlan
);

module.exports = router;