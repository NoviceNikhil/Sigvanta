const orderServices = require("../services/orderServices");
const apiResponse = require("../utils/apiResponce");
const AppError = require("../utils/AppError");
const { writeOrderLog } = require("../utils/mongoLogs");

// ─────────────────────────────────────────────
//  CUSTOMER CONTROLLERS
// ─────────────────────────────────────────────

/**
 * POST /orders
 * Customer creates a new order.
 * Body: { items: [{ product_id, quantity, price }] }
 */
const createOrder = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { items } = req.body;
    const order = await orderServices.createOrder(user_id, items);

    // Best-effort order log
    writeOrderLog({
      order_id: order?.id,
      status: order?.status ?? "pending",
      message: "Order placed",
    });
    return apiResponse.successResponse(
      res,
      "Order placed successfully",
      order,
      201,
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /orders/my
 * Customer views their own order history.
 */
const getMyOrders = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const orders = await orderServices.getOrdersByUser(user_id);
    return apiResponse.successResponse(
      res,
      "Orders fetched successfully",
      orders,
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /orders/:id
 * Customer (or admin) views a single order.
 * Customers can only see their own orders.
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await orderServices.getOrderById(req.params.id);
    if (req.user.role === "customer" && order.user_id !== req.user.id) {
      return next(
        new AppError("You are not authorised to view this order", 403),
      );
    }
    return apiResponse.successResponse(
      res,
      "Order fetched successfully",
      order,
    );
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /orders/:id/cancel
 * Customer cancels their own pending or placed order.
 */
const cancelMyOrder = async (req, res, next) => {
  try {
    const order = await orderServices.cancelOrderByCustomer(
      req.params.id,
      req.user.id,
    );

    // Best-effort order log
    writeOrderLog({
      order_id: order?.id ?? req.params.id,
      status: order?.status ?? "cancelled",
      message: "Order cancelled by customer",
    });
    return apiResponse.successResponse(
      res,
      "Order cancelled successfully",
      order,
    );
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  ADMIN CONTROLLERS
// ─────────────────────────────────────────────

/**
 * GET /orders/admin/all
 * Admin fetches all orders.
 */
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderServices.getAllOrders();
    return apiResponse.successResponse(
      res,
      "All orders fetched successfully",
      orders,
    );
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /orders/admin/:id/accept
 * Admin accepts a pending order → status: placed
 */
const acceptOrder = async (req, res, next) => {
  try {
    const order = await orderServices.acceptOrder(req.params.id);

    // Best-effort order log
    writeOrderLog({
      order_id: order?.id ?? req.params.id,
      status: order?.status ?? "placed",
      message: "Order accepted by admin",
    });
    return apiResponse.successResponse(
      res,
      "Order accepted successfully",
      order,
    );
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /orders/admin/:id/reject
 * Admin rejects a pending order → status: cancelled
 */
const rejectOrder = async (req, res, next) => {
  try {
    const order = await orderServices.rejectOrder(req.params.id);

    // Best-effort order log
    writeOrderLog({
      order_id: order?.id ?? req.params.id,
      status: order?.status ?? "cancelled",
      message: "Order rejected by admin",
    });
    return apiResponse.successResponse(
      res,
      "Order rejected successfully",
      order,
    );
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /orders/admin/:id/status
 * Admin updates status: placed → shipped → delivered (or cancelled)
 * Body: { status: "shipped" | "delivered" | "cancelled" }
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return next(new AppError("Status is required in the request body", 400));
    }
    const order = await orderServices.updateOrderStatus(req.params.id, status);

    // Best-effort order log
    writeOrderLog({
      order_id: order?.id ?? req.params.id,
      status: order?.status ?? status,
      message: `Order status updated to ${status}`,
    });
    return apiResponse.successResponse(
      res,
      `Order status updated to "${status}"`,
      order,
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  // customer
  createOrder,
  getMyOrders,
  getOrderById,
  cancelMyOrder,
  // admin
  getAllOrders,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
  // deleteOrder intentionally removed — orders must never be deleted
};
