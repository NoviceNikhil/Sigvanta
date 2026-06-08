const Product = require("./product.sql");
const Category = require("./category.sql");
const Inventory = require("./inventory.sql");
const Order = require("./order.sql");
const OrderItem = require("./orderItem.sql");
const Wishlist = require("./wishlist.sql");

const User = require("./user.sql");
const Cart = require("./cart.sql");
// Category.hasMany(Product, { foreignKey: "categoryID" });
// Product.belongsTo(Category, { foreignKey: "categoryID" });

// Category <-> Product
Category.hasMany(Product, { foreignKey: "categoryID" });
Product.belongsTo(Category, { foreignKey: "categoryID" });

// Product <-> Inventory
Product.hasOne(Inventory, { foreignKey: "product_id", onDelete: "CASCADE" });
Inventory.belongsTo(Product, { foreignKey: "product_id" });

User.hasMany(Cart, { foreignKey: "userid", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userid" });

// Product <-> Cart (1-to-Many)
// A product can be added to multiple different carts
Product.hasMany(Cart, { foreignKey: "product_id", onDelete: "CASCADE" });
Cart.belongsTo(Product, { foreignKey: "product_id" });

// Order <-> OrderItem <-> Product
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

User.hasMany(Wishlist, { foreignKey: "user_id", onDelete: "CASCADE" });
Wishlist.belongsTo(User, { foreignKey: "user_id" });

// Product <-> Wishlist (one product can be in many wishlists)
Product.hasMany(Wishlist, { foreignKey: "product_id", onDelete: "CASCADE" });
Wishlist.belongsTo(Product, { foreignKey: "product_id" });

module.exports = {
  Product,
  Category,
  Inventory,
  User,
  Cart,
  Order,
  OrderItem,
  Wishlist,
};
