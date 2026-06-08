const cartService = require("../services/cartServices");
const { successResponse } = require("../utils/apiResponce");
const AppError = require("../utils/AppError");

// should work when add to cart button is clicked
// if inventory is 0, product should not be visible in UI.
// POSSIBLE EDGE CASE: Only 1 item is left in inventory
async function addToCart(req, res, next) {
  try {
    const { user_id, product_id } = req.params;

    //if(!product_id) return next(new AppError("Product ID is required", 400));

    const cart_product = await cartService.addToCartService({
      user_id,
      product_id,
    });
    return successResponse(
      res,
      "Product added to cart successfully",
      cart_product,
      201,
    );
  } catch (error) {
    return next(new AppError(error.message || "Failed to add to cart", 500));
  }
}

//VALIDATION: IF no cart items exist, return error empty cart
async function getCart(req, res, next) {
  try {
    const { user_id } = req.params;

    const cart_products = await cartService.getCartService({ user_id });
    if (!cart_products) return successResponse(res, "Cart is empty", [], 200);

    return successResponse(
      res,
      "All products fetched from cart successfully",
      cart_products,
      200,
    );
  } catch (error) {
    return next(
      new AppError(error.message || "Failed to get cart details", 500),
    );
  }
}

// SHOULD WORK WHEN + BUTTON IS CLICKED
// POSSIBLE EDGE CASE: WHEN INVENTORY STOCK IS ONLY 1
// + BUTTON SHOULDN'T WORK IF INVENTORY BECOMES 0 WHEN ADD TO CART IS CLICKED?
// + BUTTON SHOULD RETURN STOCK IS EMPTY IF INVENTORY BECOMES 0 AFTER ADD TO CART
async function incrementCartItem(req, res, next) {
  try {
    const { user_id, product_id } = req.params;
    const updatedProduct = await cartService.incrementItemService({
      user_id,
      product_id,
    });
    //ERROR CONDITION LEFT
    // ADD THIS CHECK:
    if (!updatedProduct) {
      return next(new AppError("Item not found in cart", 404));
    }
    if (updatedProduct.message)
      return next(new AppError(updatedProduct.message, 400));

    return successResponse(res, "Quantity increased", updatedProduct, 200);
  } catch (error) {
    return next(new AppError(error.message, error.statusCode || 500));
  }
}
//SHOULD WORK WHEN - BUTTON IS CLICKED
//EDGE CASE: WHEN QUANTITY IS 1, REMOVE THE RECORD FROM CART TABLE AND UI SHOULD CHANGE
async function decrementCartItem(req, res, next) {
  try {
    const { user_id, product_id } = req.params;
    const updatedProduct = await cartService.decrementItemService({
      user_id,
      product_id,
    });
    //ERROR CONDITION LEFT
    return successResponse(res, "Quantity decreased", updatedProduct, 200);
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}

async function removeCartItem(req, res, next) {
  try {
    const { user_id, product_id } = req.params;
    const removedProduct = await cartService.removeCartItemService({
      user_id,
      product_id,
    });
    if (!removedProduct) {
      return next(new AppError("Product not found in cart", 404));
    }
    return successResponse(
      res,
      "Product removed from cart successfully",
      removedProduct,
      200,
    );
  } catch (error) {
    return next(
      new AppError(error.message || "Failed to remove product from cart", 500),
    );
  }
}

async function clearCart(req, res, next) {
  try {
    const { user_id } = req.params;
    const products = await cartService.clearCartService({ user_id });
    if (!products) {
      return next(new AppError("Products not found", 404));
    }
    return successResponse(
      res,
      "All Products removed from cart successfully",
      products,
      200,
    );
  } catch (error) {
    return next(new AppError(error.message || "Failed to clear cart", 500));
  }
}

async function updateQuantity(req, res, next) {
  try {
    const { user_id, product_id } = req.params;
    const { quantity } = req.body; // The number typed by the user

    const result = await cartService.updateQuantityService({
      user_id,
      product_id,
      quantity,
    });
    // ADD THIS CHECK:
    if (!result) {
      return next(new AppError("Item not found in cart", 404));
    }
    if (result.error) {
      return next(new AppError(`Only ${result.max} items in stock`, 400));
    }
    return successResponse(res, "Quantity updated", result, 200);
  } catch (error) {
    return next(new AppError(error.message || "Failed to update cart", 500));
  }
}
async function placeOrder(req, res, next) {
  try {
    const { user_id } = req.params;
    const order = await cartService.placeOrderService(user_id);
    return successResponse(
      res,
      order,
      "Order placed and inventory updated!",
      201,
    );
  } catch (error) {
    return next(
      new AppError(error.message || "Checkout failed", error.statusCode || 500),
    );
  }
}

const cartController = {
  addToCart,
  getCart,
  incrementCartItem,
  decrementCartItem,
  removeCartItem,
  clearCart,
  updateQuantity,
  placeOrder,
};
module.exports = cartController;
