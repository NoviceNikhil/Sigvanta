const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.post("/add/:user_id/:product_id", cartController.addToCart); // Add to cart
router.get("/get/:user_id", cartController.getCart); // View cart
router.put("/increment/:user_id/:product_id", cartController.incrementCartItem); // '+' button
router.put("/decrement/:user_id/:product_id", cartController.decrementCartItem); // '-' button
router.put(
  "/update-quantity/:user_id/:product_id",
  cartController.updateQuantity,
);
router.delete("/remove/:user_id/:product_id", cartController.removeCartItem); // Trash icon
router.delete("/clear/:user_id", cartController.clearCart); // Clear all
router.post("/place-order/:user_id", cartController.placeOrder);
module.exports = router;
