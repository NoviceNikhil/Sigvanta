const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

const authenticate = require("../middleware/authenticate_middlewere");
const authorizeRoles = require("../middleware/roleVerifyMiddlewere");

// ─────────────────────────────────────────────
//  CUSTOMER ROUTES
// ─────────────────────────────────────────────
router.post("/", authenticate, orderController.createOrder);
router.get("/", authenticate, orderController.getMyOrders);
router.get("/:id", authenticate, orderController.getOrderById);
router.patch("/:id/cancel", authenticate, orderController.cancelMyOrder);

// ─────────────────────────────────────────────
//  ADMIN ROUTES
// ─────────────────────────────────────────────
router.get(
  "/admin/all",
  authenticate,
  authorizeRoles("admin"),
  orderController.getAllOrders,
);
router.patch(
  "/admin/:id/accept",
  authenticate,
  authorizeRoles("admin"),
  orderController.acceptOrder,
);
router.patch(
  "/admin/:id/reject",
  authenticate,
  authorizeRoles("admin"),
  orderController.rejectOrder,
);
router.patch(
  "/admin/:id/status",
  authenticate,
  authorizeRoles("admin"),
  orderController.updateOrderStatus,
);
// DELETE intentionally removed — orders must never be deleted in production

module.exports = router;
