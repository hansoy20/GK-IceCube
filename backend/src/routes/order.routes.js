const express = require("express");
const { createOrder, myOrders, getOrder } = require("../controllers/order.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", createOrder);
router.get("/:id", getOrder);

router.use(requireAuth);
router.get("/", myOrders);

module.exports = router;
