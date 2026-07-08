const asyncHandler = require("express-async-handler");
const { z } = require("zod");
const prisma = require("../lib/prisma.client");

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET /api/products — public storefront catalog (active products only)
const listProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { inventory: true },
    orderBy: { createdAt: "asc" },
  });

  res.json(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      category: p.category,
      sizeLabel: p.sizeLabel,
      pricePerKg: p.pricePerKg,
      imageUrl: p.imageUrl,
      inStock: Number(p.inventory?.stockKg ?? 0) > 0,
      stockKg: Number(p.inventory?.stockKg ?? 0),
    }))
  );
});

// GET /api/products/:slug — single product detail
const getProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: { inventory: true },
  });

  if (!product || !product.isActive) {
    return res.status(404).json({ message: "That product could not be found." });
  }

  res.json({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.category,
    sizeLabel: product.sizeLabel,
    pricePerKg: product.pricePerKg,
    imageUrl: product.imageUrl,
    inStock: Number(product.inventory?.stockKg ?? 0) > 0,
    stockKg: Number(product.inventory?.stockKg ?? 0),
  });
});

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.string().min(2),
  sizeLabel: z.string().min(1),
  pricePerKg: z.number().positive(),
  imageUrl: z.string().optional(),
  initialStockKg: z.number().min(0).optional(),
  lowStockThresholdKg: z.number().min(0).optional(),
});

// GET /api/admin/products — all products including inactive, for admin table
const listAllProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    include: { inventory: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(products);
});

// POST /api/admin/products — create a product + its inventory row
const createProduct = asyncHandler(async (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const { name, description, category, sizeLabel, pricePerKg, imageUrl, initialStockKg, lowStockThresholdKg } =
    parsed.data;

  let slug = slugify(name);
  const clash = await prisma.product.findUnique({ where: { slug } });
  if (clash) slug = `${slug}-${Date.now().toString(36)}`;

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      category,
      sizeLabel,
      pricePerKg,
      imageUrl,
      inventory: {
        create: {
          stockKg: initialStockKg ?? 0,
          lowStockThresholdKg: lowStockThresholdKg ?? 20,
        },
      },
    },
    include: { inventory: true },
  });

  res.status(201).json(product);
});

// PUT /api/admin/products/:id — update product fields
const updateProduct = asyncHandler(async (req, res) => {
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const { initialStockKg, lowStockThresholdKg, ...productFields } = parsed.data;

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: productFields,
    include: { inventory: true },
  });

  res.json(product);
});

// PATCH /api/admin/products/:id/toggle-active — show/hide from storefront
const toggleActive = asyncHandler(async (req, res) => {
  const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: "Product not found." });

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: { isActive: !existing.isActive },
  });
  res.json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const linkedOrdersCount = await prisma.orderItem.count({ where: { productId: req.params.id } });
  if (linkedOrdersCount > 0) {
    return res.status(400).json({ 
      message: "This product is linked to existing orders. Please toggle it to 'Inactive' instead of deleting it." 
    });
  }

  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ message: "Product deleted." });
});

module.exports = {
  listProducts,
  getProduct,
  listAllProducts,
  createProduct,
  updateProduct,
  toggleActive,
  deleteProduct,
};
