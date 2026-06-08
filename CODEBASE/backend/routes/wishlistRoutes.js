const express = require("express");
// FIX 1: Initialize the Express router correctly
const router = express.Router();

// FIX 2: Remove the { } braces so the whole file is imported as the controller object
const wishlistController = require("../controllers/wishlistController");

// GET: /api/v1/wishlist/get/:userid
router.get("/get/:userid", wishlistController.getWishlist);

// POST: /api/v1/wishlist/add/:userid  (productId goes in the JSON body)
router.post("/add/:userid", wishlistController.addToWishlist);

// DELETE: /api/v1/wishlist/remove/:userid/:productId
router.delete("/remove/:userid/:productId", wishlistController.removeFromWishlist);

module.exports = router;