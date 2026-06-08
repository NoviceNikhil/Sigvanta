const { sequelize } = require("../config/sql");
const { Order } = require("../models/index.sql");
const AppError = require("../utils/AppError");
const { OrderItem, Product } = require("../models/index.sql");

// ─────────────────────────────────────────────
//  Associations
// ─────────────────────────────────────────────
// Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
// OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });
// OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// ─── Reusable include — brings product name + image into every item ───────────
const ITEM_INCLUDE = {
  model: OrderItem,
  as: "items",
  include: [
    {
      model: Product,
      as: "product",
      attributes: ["ID", "name", "image"], // only what the frontend needs
    },
  ],
};

// ─────────────────────────────────────────────
//  CUSTOMER SERVICES
// ─────────────────────────────────────────────

/**
 * Create a new order.
 * items = [{ product_id, quantity, price }, ...]
 * The total_amount is calculated here from items — never trust the client.
 */
const createOrder = async (user_id, items) => {
  if (!items || items.length === 0) {
    throw new AppError("Order must contain at least one item", 400);
  }

  // Calculate total from items
  const total_amount = items.reduce((sum, item) => {
    if (!item.product_id || !item.quantity || !item.price) {
      throw new AppError(
        "Each item must have product_id, quantity and price",
        400,
      );
    }
    return sum + item.quantity * item.price;
  }, 0);

  // Use a transaction so both inserts succeed or both roll back
  const transaction = await sequelize.transaction();
  try {
    const order = await Order.create(
      { user_id, total_amount, status: "pending" },
      { transaction },
    );

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItems, { transaction });

    await transaction.commit();

    // Return the full order with its items
    return getOrderById(order.id);
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

/**
 * Get all orders belonging to a specific customer.
 */
const getOrdersByUser = async (user_id) => {
  const orders = await Order.findAll({
    where: { user_id },
    include: [ITEM_INCLUDE],
    order: [["createdAt", "DESC"]],
  });
  return orders;
};

/**
 * Get a single order by id.
 * Throws 404 if not found.
 */
const getOrderById = async (id) => {
  const order = await Order.findOne({
    where: { id },
    include: [ITEM_INCLUDE],
  });
  if (!order) throw new AppError(`Order with id ${id} not found`, 404);
  return order;
};

/**
 * Customer cancels their own order.
 * Only allowed when order is still "pending".
 */
const cancelOrderByCustomer = async (order_id, user_id) => {
  const order = await getOrderById(order_id);

  if (order.user_id !== user_id) {
    throw new AppError("You are not authorised to cancel this order", 403);
  }
  if (order.status !== "pending") {
    throw new AppError(
      `Order cannot be cancelled — current status is "${order.status}"`,
      400,
    );
  }

  order.status = "cancelled";
  await order.save();
  return order;
};

// ─────────────────────────────────────────────
//  ADMIN SERVICES
// ─────────────────────────────────────────────

/**
 * Admin: get all orders in the system.
 */
const getAllOrders = async () => {
  const orders = await Order.findAll({
    include: [ITEM_INCLUDE],
    order: [["createdAt", "DESC"]],
  });
  return orders;
};

/**
 * Admin: accept a pending order → status becomes "placed".
 */
const acceptOrder = async (order_id) => {
  const order = await getOrderById(order_id);

  if (order.status !== "pending") {
    throw new AppError(
      `Only pending orders can be accepted. Current status: "${order.status}"`,
      400,
    );
  }

  order.status = "placed";
  await order.save();
  return order;
};

/**
 * Admin: reject a pending order → status becomes "cancelled".
 */
const rejectOrder = async (order_id) => {
  const order = await getOrderById(order_id);

  if (order.status !== "pending") {
    throw new AppError(
      `Only pending orders can be rejected. Current status: "${order.status}"`,
      400,
    );
  }

  order.status = "cancelled";
  await order.save();
  return order;
};

/**
 * Admin: update order status freely among the allowed transitions.
 * Valid progression:  placed → shipped → delivered
 * Also allows: any status → cancelled
 *
 * allowed = {
 *   placed:    ["shipped", "cancelled"],
 *   shipped:   ["delivered", "cancelled"],
 *   delivered: [],           // terminal state
 *   cancelled: [],           // terminal state
 *   pending:   []            // use acceptOrder / rejectOrder instead
 * }
 */
const updateOrderStatus = async (order_id, newStatus) => {
  const ALLOWED_TRANSITIONS = {
    pending: [],
    placed: ["shipped", "cancelled"],
    shipped: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
  };

  const VALID_STATUSES = ["placed", "shipped", "delivered", "cancelled"];
  if (!VALID_STATUSES.includes(newStatus)) {
    throw new AppError(
      `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      400,
    );
  }

  const order = await getOrderById(order_id);
  const allowed = ALLOWED_TRANSITIONS[order.status];

  if (!allowed.includes(newStatus)) {
    throw new AppError(
      `Cannot move from "${order.status}" to "${newStatus}"`,
      400,
    );
  }

  order.status = newStatus;
  await order.save();
  return order;
};

// deleteOrder intentionally removed — orders must never be deleted in production

module.exports = {
  // customer
  createOrder,
  getOrdersByUser,
  getOrderById,
  cancelOrderByCustomer,
  // admin
  getAllOrders,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
  // deleteOrder intentionally removed — orders must never be deleted
};
