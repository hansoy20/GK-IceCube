const express = require("express");
const { createCheckoutSession } = require("../controllers/payment.controller");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// NOTE: /api/payments/webhook is registered separately in server.js with
// express.raw(), because Stripe's signature check needs the raw request body.
router.post("/checkout-session/:orderId", requireAuth, createCheckoutSession);

module.exports = router;
