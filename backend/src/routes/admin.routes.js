const express = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");
const { getDashboard } = require("../controllers/admin.controller");
const {
  listAllProducts,
  createProduct,
  updateProduct,
  toggleActive,
  deleteProduct,
} = require("../controllers/product.controller");
const { listInventory, adjustStock } = require("../controllers/inventory.controller");
const { listAllOrders, updateOrderStatus } = require("../controllers/order.controller");

const router = express.Router();

// Every route below requires a logged-in admin
router.use(requireAuth, requireAdmin);

router.get("/dashboard", getDashboard);

router.get("/products", listAllProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.patch("/products/:id/toggle-active", toggleActive);
router.delete("/products/:id", deleteProduct);

router.get("/inventory", listInventory);
router.post("/inventory/:productId/adjust", adjustStock);

router.get("/orders", listAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);

module.exports = router;
