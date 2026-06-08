const sequelize = require("../config/db");

const AdminAPIFeatures = require("../utils/AdminaAPIFeatures");
const { Product, Inventory } = require("../models/index.sql");

exports.getAllProducts = async (req) => {
  // 1. Pass req.query into the API features class
  const features = new AdminAPIFeatures(Product, req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // 2. Execute the query (this already includes Inventory and Category joins)
  const { results, data } = await features.execute();

  return {
    results,
    products: data,
  };
};

exports.createProduct = async (productData) => {
  const {
    name,
    categoryID,
    image,
    actual_price,
    discount_price,
    description,
    rating,
    stock_quantity,
  } = productData;

  // Use a transaction to ensure both product and inventory are created safely
  const transaction = await sequelize.transaction();

  try {
    const newProduct = await Product.create(
      {
        name,
        categoryID,
        image,
        actual_price,
        discount_price,
        description,
        rating,
      },
      { transaction },
    );

    // Create corresponding inventory record immediately
    await Inventory.create(
      { product_id: newProduct.ID, stock_quantity: stock_quantity || 0 },
      { transaction },
    );

    await transaction.commit();

    // Fetch and return the newly created product WITH its inventory included
    // so the frontend can immediately render the product card properly.
    return await Product.findByPk(newProduct.ID, {
      include: [{ model: Inventory, attributes: ["stock_quantity"] }],
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.updateProduct = async (productId, updateData) => {
  // Separate inventory updates from product details updates
  const { stock_quantity, ...productFields } = updateData;
  const transaction = await sequelize.transaction();

  try {
    // 1. Update Product details if any product fields are provided
    if (Object.keys(productFields).length > 0) {
      await Product.update(productFields, {
        where: { ID: productId },
        transaction,
      });
    }

    // 2. Update Inventory if stock_quantity is provided
    if (stock_quantity !== undefined) {
      await Inventory.update(
        { stock_quantity },
        { where: { product_id: productId }, transaction },
      );
    }

    await transaction.commit();

    // Fetch the updated product with its new inventory to return to the client
    return await Product.findByPk(productId, {
      include: [{ model: Inventory, attributes: ["stock_quantity"] }],
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.deleteProduct = async (productId) => {
  // Because we set onDelete: 'CASCADE' in the model references, destroying the product
  // will automatically destroy the linked inventory record in MySQL.
  const deletedCount = await Product.destroy({
    where: { ID: productId },
  });

  if (deletedCount === 0) {
    throw new Error("Product not found");
  }

  return true;
};
