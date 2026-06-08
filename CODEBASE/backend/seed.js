const fs = require("fs");
const path = require("path");
const {
  Product,
  Inventory,
  Category,
  Order,
  OrderItem,
} = require("./models/index.sql");
// const { sequelize } = require("./config/sql");
const sequelize = require("../backend/config/db");

/**
 * Generates dummy inventory data for a given number of products.
 *
 * @param {number} totalProducts - The total number of products you have in your database.
 * @param {number} maxStock - The maximum random stock quantity you want to generate.
 * @returns {Array} Array of inventory objects.
 */

function generateInventoryData(totalProducts, maxStock = 200) {
  const inventoryData = [];
  for (let i = 1; i <= totalProducts; i++) {
    inventoryData.push({
      product_id: i, // Matches the sequential auto-incremented IDs of the valid products
      stock_quantity: Math.floor(Math.random() * (maxStock + 1)),
    });
  }
  return inventoryData;
}

const seedDatabase = async () => {
  try {
    // 1. Sync database (force: true drops tables and recreates them)
    // await sequelize.sync({ force: true });

    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync({ force: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Database synced and tables recreated.");

    // 2. Load the JSON data
    const dataPath = path.join(__dirname, "final_seed.json");
    const { categories, products, orders, order_items } = JSON.parse(
      fs.readFileSync(dataPath, "utf8"),
    );

    // 3. Seed Categories
    const categoryData = categories.map((cat) => ({
      ID: cat.id,
      categoryname: cat.category_name,
      icon: cat.icon || "ShoppingBag",
      color: cat.color || "bg-blue-500"
    }));

    await Category.bulkCreate(categoryData);
    console.log(`Successfully seeded ${categoryData.length} categories.`);

    // 4. Seed Products with strict filtering
    const productData = products
      .filter((prod) => {
        // Helper function to check if a single value is valid
        const isValid = (val) => {
          return (
            val !== null &&
            val !== undefined &&
            val !== "" &&
            val !== 0 &&
            val !== "0"
          );
        };

        // Specific helper for images: Catch broken links and invalid formats
        const isValidImage = (url) => {
          // Must pass basic validity first
          if (!isValid(url)) return false;

          // Filter out temporary/anti-hotlinked Amazon URLs
          if (url.includes("IMAGERENDERING")) return false;

          // Ensure it is actually a web URL and not just random text
          return url.startsWith("http://") || url.startsWith("https://");
        };

        // ONLY keep the product if ALL of these fields pass the checks
        return (
          isValid(prod.product_name) &&
          isValidImage(prod.image) &&
          isValid(prod.category_id) &&
          isValid(prod.actual_price) &&
          isValid(prod.discounted_price) &&
          isValid(prod.description) &&
          isValid(prod.rating)
        );
      })
      .map((prod) => ({
        name: prod.product_name,
        image: prod.image,
        categoryID: prod.category_id,
        actual_price: prod.actual_price,
        discount_price: prod.discounted_price,
        description: prod.description,
        rating: prod.rating,
      }));

    // 5. Insert the clean data into MySQL
    await Product.bulkCreate(productData);

    // Log both the original count and the final seeded count
    console.log(
      `Filtered out ${products.length - productData.length} invalid products.`,
    );
    console.log(`Successfully seeded ${productData.length} valid products!`);

    // 6. Generate and Seed Inventory Data Dynamically based on the CLEAN product count
    const inventoryData = generateInventoryData(productData.length, 150);
    await Inventory.bulkCreate(inventoryData);
    console.log(
      `Successfully seeded ${inventoryData.length} Inventory records.`,
    );

    // 5. Seed Orders
    const orderData = orders.map((order) => ({
      id: order.id,
      user_id: order.user_id,
      total_amount: order.total_amount,
      status: order.status,
      created_at: order.created_at,
    }));

    await Order.bulkCreate(orderData);
    console.log(`Successfully seeded ${orderData.length} orders.`);

    // 6. Seed Order Items
    const orderItemData = order_items.map((item) => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItemData);
    console.log(`Successfully seeded ${orderItemData.length} order items.`);

    process.exit(0);
  } catch (error) {
    console.error("Critical error during seeding:", error);
    process.exit(1);
  }
};

seedDatabase();
