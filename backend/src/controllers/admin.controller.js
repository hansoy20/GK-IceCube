const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");

// GET /api/admin/dashboard — headline numbers for the admin home screen
const getDashboard = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [pendingOrders, todaysOrders, lowStockItems, totalCustomers, allOrders] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.inventory.findMany({ include: { product: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({ where: { status: { not: "CANCELLED" } }, select: { total: true, createdAt: true } }),
  ]);

  const lowStock = lowStockItems.filter((i) => i.quantityOnHand <= i.lowStockThreshold);

  const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const todayRevenue = allOrders
    .filter((o) => o.createdAt >= startOfToday)
    .reduce((sum, o) => sum + Number(o.total), 0);

  res.json({
    pendingOrders,
    todaysOrders,
    todayRevenue,
    totalRevenue,
    totalCustomers,
    lowStockCount: lowStock.length,
    lowStockItems: lowStock.map((i) => ({
      productName: i.product.name,
      quantityOnHand: i.quantityOnHand,
      lowStockThreshold: i.lowStockThreshold,
    })),
  });
});

module.exports = { getDashboard };
