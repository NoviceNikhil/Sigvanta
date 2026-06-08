const {
  Cart,
  Inventory,
  Product,
  Order,
  OrderItem,
} = require("../models/index.sql");
const sequelize = require("../config/db");
//NEED INVENTORY MODEL AND INVENTORY STOCK
// SHOULD WE CHECK INVENTORY STOCK FOR EACH UPDATE? OR SHOULD WE UPDATE INVENTORY ONLY WHEN ORDER IS PLACED?

async function addToCartService(data) {
  // 1. POSSIBLE EDGE CASE: VALIDATION: Check inventory stock
  /*
   */
  // After add to cart button is clicked, it dissapears. Hence no need to check if it exists.
  //const existingItem = await CartSql.findOne({ where: { user_id, product_id } });

  // if (existingItem) {
  //     // Optional Validation: Ensure existing quantity + 1 doesn't exceed stock
  //     // if (existingItem.quantity + 1 > product.stock) throw new Error("Not enough stock");

  //     existingItem.quantity += 1;
  //     await existingItem.save();
  //     return existingItem;
  // }

  const { user_id, product_id } = data;
  console.log(
    "DEBUG: Adding to cart for User:",
    user_id,
    "Product:",
    product_id,
  );

  if (!user_id || !product_id) {
    throw { message: "Invalid User or Product ID", statusCode: 400 };
  }

  const inventory = await Inventory.findOne({ where: { product_id } });
  if (inventory.stock_quantity === 0) {
    throw {
      message: `Only ${inventory.stock_quantity} units available in stock`,
      statusCode: 400,
    };
  }

  const existingItem = await Cart.findOne({
    where: { userid: user_id, product_id },
  });

  if (existingItem) {
    // Optional: check inventory before incrementing
    const inventory = await Inventory.findOne({ where: { product_id } });
    if (inventory && existingItem.quantity + 1 > inventory.stock_quantity) {
      throw {
        message: `Only ${inventory.stock_quantity} units available in stock`,
        statusCode: 400,
      };
    }
    existingItem.quantity += 1;
    await existingItem.save();
    return existingItem;
  }

  const newItem = await Cart.create({
    userid: user_id,
    product_id,
    quantity: 1,
  });
  return newItem;
}

async function getCartService(data) {
  const { user_id } = data;
  const cartItems = await Cart.findAll({
    where: { userid: user_id },
    include: [{ model: Product }],
  });
  //VALIDATION -> IF CART IS EMPTY RETURN EMPTY OR NULL ?
  if (!cartItems) return null;
  return cartItems;
}

async function incrementItemService(data) {
  //VALIDATION : CHECK IF INVENTORY IS 0.
  const { user_id, product_id } = data;
  const item = await Cart.findOne({ where: { product_id, userid: user_id } });

  // if (!item) {
  //     throw { message: "Item not found in cart", statusCode: 404 };
  // }

  // IF INVENTORY == 0 FOR THAT PRODUCT ID, RETURN "ADDITION IS NOT POSSIBLE SINCE STOCK IS EMPTY"
  const inventoryForItem = await Inventory.findOne({ where: { product_id } });

  if (item.quantity + 1 > inventoryForItem.stock_quantity) {
    return {
      message: `Only ${inventoryForItem.stock_quantity} units available in stock`,
      status: 400,
    };
  }

  item.quantity += 1;
  await item.save();
  return item;
}

async function decrementItemService(data) {
  const { user_id, product_id } = data;
  const item = await Cart.findOne({ where: { product_id, userid: user_id } });
  if (!item) return null;
  // If decreasing makes quantity 0, just remove it entirely
  if (item.quantity === 1) {
    await item.destroy();
    return { message: "Item removed from cart" };
  }

  item.quantity -= 1;
  await item.save();
  return item;
}

async function removeCartItemService(data) {
  const { user_id, product_id } = data;
  const item = await Cart.findOne({
    where: { product_id, userid: user_id },
  });
  // VALIDATION IS NOT REQUIRED I THINK? BECAUSE ONLY WHEN THE PRODUCT IS THERE IN CART, ONLY THEN WE CAN SEE DUSTBIN ICON
  // if (!item) return null;

  await item.destroy();

  return item;
}

async function clearCartService(data) {
  const { user_id } = data;
  const items = await Cart.findAll({
    where: { userid: user_id },
  });

  if (!items.length) return null;

  await Cart.destroy({
    where: { userid: user_id },
  });

  return items;
}

async function updateQuantityService(data) {
  const { user_id, product_id, quantity } = data;
  const inventory = await Inventory.findOne({ where: { product_id } });
  const item = await Cart.findOne({ where: { userid: user_id, product_id } });

  if (quantity > inventory.stock_quantity) {
    return { error: "LIMIT_EXCEEDED", max: inventory.stock_quantity };
  }

  if (quantity <= 0) {
    await item.destroy();
    return { message: "Removed" };
  }

  item.quantity = quantity;
  await item.save();
  return item;
}
async function placeOrderService(user_id) {
  //DIRECTLY CALLING ORDERS TABLE AND PLACING AN ORDER THERE. NOT USING ON'S APIS.

  // Start a transaction to ensure all-or-nothing logic
  const transaction = await sequelize.transaction();

  try {
    // 1. Fetch the user's cart items with product details (price)
    const cartItems = await Cart.findAll({
      where: { userid: user_id },
      include: [
        {
          model: Product,
          include: [Inventory], // To check stock
        },
      ],
      transaction,
    });

    if (!cartItems || cartItems.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    // 2. Calculate total and validate inventory
    let total_amount = 0;
    const itemsToProcess = [];

    for (const item of cartItems) {
      const product = item.Product;
      const inventory = product.Inventory;

      if (!inventory || inventory.stock_quantity < item.quantity) {
        throw new AppError(`Not enough stock for ${product.name}`, 400);
      }

      total_amount += product.discount_price * item.quantity;
      itemsToProcess.push({
        product_id: product.ID,
        quantity: item.quantity,
        price: product.discount_price,
        inventoryRecord: inventory,
      });
    }

    // 3. Create the Order
    const newOrder = await Order.create(
      {
        user_id,
        total_amount,
        status: "pending",
      },
      { transaction },
    );
    // 4. Reduce Inventory and Create OrderItems
    for (const item of itemsToProcess) {
      // Reduce stock
      await item.inventoryRecord.decrement("stock_quantity", {
        by: item.quantity,
        transaction,
      });

      // Create order item
      await OrderItem.create(
        {
          order_id: newOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        },
        { transaction },
      );
    }

    // 5. Clear the User's Cart
    await Cart.destroy({
      where: { userid: user_id },
      transaction,
    });

    // Commit all changes
    await transaction.commit();
    return newOrder;
  } catch (error) {
    // If anything fails, undo everything (inventory reduction, order creation, etc.)
    await transaction.rollback();
    throw error;
  }
}
const cartServices = {
  addToCartService,
  getCartService,
  incrementItemService,
  decrementItemService,
  removeCartItemService,
  clearCartService,
  updateQuantityService,
  placeOrderService,
};
module.exports = cartServices;
