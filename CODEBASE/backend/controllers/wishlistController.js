const wishlistService = require("../services/wishlistServices");
const { successResponse } = require("../utils/apiResponce");
const AppError = require("../utils/AppError");

// -------------------- GET WISHLIST --------------------
exports.getWishlist = async (req, res, next) => {
  try {
    const userId = req.params.userid;

    if (!userId) {
      return next(new AppError("User ID is required", 400));
    }

    const wishlist = await wishlistService.getWishlist(userId);

    return successResponse(res, "Wishlist fetched successfully", wishlist, 200);
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

// -------------------- ADD TO WISHLIST --------------------
exports.addToWishlist = async (req, res, next) => {
  try {
    const userId = req.params.userid;
    const { productId } = req.body;

    if (!userId) {
      return next(new AppError("User ID is required", 400));
    }
    if (!productId) {
      return next(new AppError("Product ID is required", 400));
    }

    const item = await wishlistService.addToWishlist(userId, productId);

    if (!item) {
      return next(new AppError("Failed to add to wishlist", 500));
    }

    return successResponse(res, "Successfully added to wishlist", item, 201);
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

// -------------------- REMOVE FROM WISHLIST --------------------
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.params.userid;
    const productId = req.params.productId;

    if (!userId || !productId) {
      return next(new AppError("User ID and Product ID are required", 400));
    }

    const item = await wishlistService.removeFromWishlist(userId, productId);

    if (!item) {
      return next(new AppError("Wishlist item not found", 404));
    }

    return successResponse(
      res,
      "Successfully removed from wishlist",
      item,
      200,
    );
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};
