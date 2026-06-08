const { Wishlist, Product } = require("../models/index.sql");

// -------------------- GET WISHLIST --------------------
exports.getWishlist = async (userId) => {
  if (!userId) return null;

  const items = await Wishlist.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Product,
        as: "Product",
        attributes: [
          "ID",
          "name",
          "image",
          "actual_price",
          "discount_price",
          "rating",
          "description",
        ],
      },
    ],
  });

  return items;
};

// -------------------- ADD TO WISHLIST --------------------
exports.addToWishlist = async (userId, productId) => {
  if (!userId || !productId) return null;

  // Check if already exists
  const existing = await Wishlist.findOne({
    where: { user_id: userId, product_id: productId },
    include: [
      {
        model: Product,
        as: "Product",
        attributes: ["ID", "name", "image", "actual_price", "discount_price", "rating", "description"],
      },
    ],
  });

  if (existing) return existing;

  // Create new wishlist item
  const item = await Wishlist.create({
    user_id: userId,
    product_id: productId,
  });

  // Fetch with product details
  const itemWithProduct = await Wishlist.findOne({
    where: { ID: item.ID },
    include: [
      {
        model: Product,
        as: "Product",
        attributes: [
          "ID",
          "name",
          "image",
          "actual_price",
          "discount_price",
          "rating",
          "description",
        ],
      },
    ],
  });

  return itemWithProduct;
};

// -------------------- REMOVE FROM WISHLIST --------------------
exports.removeFromWishlist = async (userId, productId) => {
  if (!userId || !productId) return null;

  const item = await Wishlist.findOne({
    where: { user_id: userId, product_id: productId },
  });

  if (!item) return null;

  await item.destroy();

  return item;
};
