require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const adminRoutes = require("./routes/admin.routes");
const { stripeWebhook } = require("./controllers/payment.controller");
const { errorHandler, notFound } = require("./middleware/error.middleware");

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(morgan("dev"));

// Stripe's webhook needs the raw body for signature verification, so it's
// registered BEFORE express.json() with its own raw parser, and directly
// on the controller (bypassing payment.routes.js, which uses express.json()).
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "gk-icecube-api" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`GK Ice Cube API running on http://localhost:${PORT}`);
});
