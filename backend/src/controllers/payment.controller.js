const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");

// Stripe is optional. If no key is configured, card payment is disabled
// and the storefront only offers Cash on Delivery.
const stripe = process.env.STRIPE_SECRET_KEY
  ? require("stripe")(process.env.STRIPE_SECRET_KEY)
  : null;

// POST /api/payments/checkout-session/:orderId
// Creates a Stripe Checkout Session for an existing (unpaid) order.
const createCheckoutSession = asyncHandler(async (req, res) => {
  if (!stripe) {
    return res.status(503).json({
      message: "Card payments aren't configured yet. Choose Cash on Delivery instead.",
    });
  }

  const order = await prisma.order.findUnique({
    where: { id: req.params.orderId },
    include: { items: true },
  });

  if (!order) return res.status(404).json({ message: "Order not found." });
  if (order.userId !== req.user.id) {
    return res.status(403).json({ message: "You don't have access to this order." });
  }
  if (order.paymentStatus === "PAID") {
    return res.status(400).json({ message: "This order has already been paid." });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: `${item.productName} (${Number(item.quantityKg)} kg)` },
        unit_amount: Math.round(Number(item.lineTotal) * 100),
      },
      quantity: 1,
    })),
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: Math.round(Number(order.deliveryFee) * 100), currency: "usd" },
          display_name: "Delivery",
        },
      },
    ],
    success_url: `${process.env.CLIENT_ORIGIN}/orders/${order.id}?paid=1`,
    cancel_url: `${process.env.CLIENT_ORIGIN}/orders/${order.id}?paid=0`,
    metadata: { orderId: order.id },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  res.json({ url: session.url });
});

// POST /api/payments/webhook — Stripe calls this when a session completes.
// Marks the matching order as PAID. Requires STRIPE_WEBHOOK_SECRET in production.
const stripeWebhook = asyncHandler(async (req, res) => {
  if (!stripe) return res.status(503).end();

  let event = req.body;

  if (process.env.STRIPE_WEBHOOK_SECRET) {
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook signature verification failed.`);
    }
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: "PAID", status: "CONFIRMED" },
      });
    }
  }

  res.json({ received: true });
});

module.exports = { createCheckoutSession, stripeWebhook };
