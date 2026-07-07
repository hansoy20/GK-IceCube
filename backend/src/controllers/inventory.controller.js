const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");

// GET /api/admin/inventory — stock level for every product
const listInventory = asyncHandler(async (req, res) => {
  const inventory = await prisma.inventory.findMany({
    include: { product: true },
    orderBy: { product: { name: "asc" } },
  });

  res.json(
    inventory.map((i) => ({
      id: i.id,
      productId: i.productId,
      productName: i.product.name,
      sizeLabel: i.product.sizeLabel,
      stockKg: Number(i.stockKg),
      lowStockThresholdKg: Number(i.lowStockThresholdKg),
      isLowStock: Number(i.stockKg) <= Number(i.lowStockThresholdKg),
    }))
  );
});

// POST /api/admin/inventory/:productId/adjust  { change, reason }
// change can be positive (restock) or negative (damage, correction, etc.)
const adjustStock = asyncHandler(async (req, res) => {
  const { change, reason } = req.body;
  const numericChange = Number(change);

  if (isNaN(numericChange) || numericChange === 0) {
    return res.status(400).json({ message: "Provide a non-zero change in kg." });
  }

  const inventory = await prisma.inventory.findUnique({ where: { productId: req.params.productId } });
  if (!inventory) return res.status(404).json({ message: "No inventory record for that product." });

  const newStockKg = Number(inventory.stockKg) + numericChange;
  if (newStockKg < 0) {
    return res.status(400).json({ message: "That would take stock below zero." });
  }

  const updated = await prisma.inventory.update({
    where: { id: inventory.id },
    data: {
      stockKg: newStockKg,
      movements: {
        create: { changeKg: numericChange, reason: reason || "Manual adjustment" },
      },
    },
  });

  res.json(updated);
});

module.exports = { listInventory, adjustStock };
