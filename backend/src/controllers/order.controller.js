const asyncHandler = require("express-async-handler");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { appendOrderToSheet } = require("../services/sheets.service");

const DELIVERY_FEE = 5.0; // flat delivery fee; swap for zone-based pricing later

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GK-${stamp}-${rand}`;
}

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantityKg: z.number().positive(),
      })
    )
    .min(1, "Your cart is empty."),
  customerName: z.string().min(2, "Enter your name."),
  customerEmail: z.string().email("Enter a valid email address."),
  deliveryLine1: z.string().min(3, "Enter a delivery address."),
  deliveryLine2: z.string().optional(),
  deliveryCity: z.string().min(2, "City is required."),
  deliveryRegion: z.string().optional(),
  deliveryPostal: z.string().optional(),
  contactPhone: z.string().min(6, "Enter a contact phone number."),
  orderNotes: z.string().optional(),
  requestedDeliveryDate: z.string().optional().transform(v => v ? new Date(v) : undefined).refine(val => {
    if (!val) return true;
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    return val > todayUTC;
  }, { message: "Delivery requires at least 1 day lead time." }),
  paymentMethod: z.enum(["COD", "CARD"]).default("COD"),
});

// POST /api/orders — place an order; runs stock check + deduction atomically
const createOrder = asyncHandler(async (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const data = parsed.data;

  const order = await prisma.$transaction(async (tx) => {
    let subtotal = 0;
    const itemsData = [];

    for (const line of data.items) {
      const product = await tx.product.findUnique({
        where: { id: line.productId },
        include: { inventory: true },
      });

      if (!product || !product.isActive) {
        throw Object.assign(new Error(`One of the items in your cart is no longer available.`), {
          status: 400,
        });
      }

      try {
        await tx.inventory.update({
          where: { 
            productId: product.id,
            stockKg: { gte: line.quantityKg }
          },
          data: {
            stockKg: { decrement: line.quantityKg },
            movements: {
              create: { changeKg: -line.quantityKg, reason: "Order placed" },
            },
          },
        });
      } catch (err) {
        if (err.code === "P2025") {
          throw Object.assign(
            new Error(`Insufficient stock for "${product.name}". Only ${product.inventory?.stockKg ?? 0}kg available.`),
            { status: 400 }
          );
        }
        throw err;
      }

      const unitPrice = Number(product.pricePerKg);
      const lineTotal = unitPrice * line.quantityKg;
      subtotal += lineTotal;

      itemsData.push({
        productId: product.id,
        productName: product.name,
        unitPrice,
        quantityKg: line.quantityKg,
        lineTotal,
      });
    }

    const total = subtotal + DELIVERY_FEE;

    return tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === "COD" ? "UNPAID" : "UNPAID",
        deliveryLine1: data.deliveryLine1,
        deliveryLine2: data.deliveryLine2,
        deliveryCity: data.deliveryCity,
        deliveryRegion: data.deliveryRegion,
        deliveryPostal: data.deliveryPostal,
        contactPhone: data.contactPhone,
        orderNotes: data.orderNotes,
        requestedDeliveryDate: data.requestedDeliveryDate,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        total,
        items: { create: itemsData },
      },
      include: { items: true },
    });
  });

  // Secondary sync (does not block checkout if it fails)
  appendOrderToSheet(order);

  res.status(201).json(order);
});

// GET /api/orders — (DEPRECATED: Customers do not have accounts)
const myOrders = asyncHandler(async (req, res) => {
  res.status(403).json({ message: "Not supported" });
});

// GET /api/orders/:id — a single order (publicly accessible by unguessable ID)
const getOrder = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: true, user: { select: { name: true, email: true } } },
  });

  if (!order) return res.status(404).json({ message: "Order not found." });

  res.json(order);
});

// --- Admin ---

// GET /api/admin/orders?status=PENDING
const listAllOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { items: true, user: { select: { name: true, email: true, phone: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
});

const VALID_STATUSES = ["PENDING", "CONFIRMED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

// PATCH /api/admin/orders/:id/status  { status }
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: "That is not a valid order status." });
  }

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json(order);
});

module.exports = { createOrder, myOrders, getOrder, listAllOrders, updateOrderStatus };
