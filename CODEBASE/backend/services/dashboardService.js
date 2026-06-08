const { Op } = require("sequelize");
const { Order, OrderItem, Product, User } = require("../models/index.sql");

const ITEM_INCLUDE = {
  model: OrderItem,
  as: "items",
  include: [
    {
      model: Product,
      as: "product",
      attributes: ["ID", "name", "image", "discount_price"],
    },
  ],
};

const getDashboardStats = async () => {
  const totalOrders = await Order.count();
  const salesResult = await Order.sum("total_amount", {
    where: { status: { [Op.notIn]: ["pending", "cancelled"] } },
  });
  const totalSales = parseFloat(salesResult) || 0;

  const totalProducts = await Product.count();

  const totalUsers = await User.count();

  const recentOrders = await Order.findAll({
    include: [ITEM_INCLUDE],
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  const recentProducts = await Product.findAll({
    order: [["createdAt", "DESC"]],
    limit: 5,
    attributes: [
      "ID",
      "name",
      "discount_price",
      "actual_price",
      "image",
      "createdAt",
    ],
  });

  const recentUsers = await User.findAll({
    // ← last 5 registered users
    order: [["createdAt", "DESC"]],
    limit: 5,
    attributes: ["id", "name", "email", "role", "createdAt"],
  });

  return {
    totalOrders,
    totalSales,
    totalProducts,
    totalUsers,
    recentOrders,
    recentProducts,
    recentUsers,
  };
};

module.exports = { getDashboardStats };
