const inventoryService = require("../services/inventoryService");
const { successResponse } = require("../utils/apiResponce");
const AppError = require("../utils/AppError");
const cloudinary = require("../utils/Cloudinary");
const { writeActivityLog } = require("../utils/mongoLogs");

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await inventoryService.getAllProducts(req);
    return successResponse(
      res,
      "Successfully fetched all products with inventory",
      products,
      200,
    );
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await inventoryService.createProduct(req.body);

    // Best-effort admin activity log
    writeActivityLog({
      user_id: req.user?.id,
      action: "create_product",
      module: "inventory",
      metadata: { product_id: product?.ID },
    });
    return successResponse(
      res,
      "Product and initial inventory created successfully",
      product,
      201,
    );
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProduct = await inventoryService.updateProduct(id, req.body);

    // Best-effort admin activity log
    writeActivityLog({
      user_id: req.user?.id,
      action: "update_product",
      module: "inventory",
      metadata: { product_id: id },
    });
    return successResponse(
      res,
     
      "Product and inventory updated successfully",
       updatedProduct,
      200,
    );
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await inventoryService.deleteProduct(id);

    // Best-effort admin activity log
    writeActivityLog({
      user_id: req.user?.id,
      action: "delete_product",
      module: "inventory",
      metadata: { product_id: id },
    });
    return successResponse(
      res,
      
      "Product and all associated records (inventory, etc.) deleted successfully",
      null,
      200,
    );
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

exports.uploadImage = (req, res, next) => {
  // multer already validated the file; if missing, reject
  if (!req.file) return next(new AppError("No image file provided", 400));

  // upload_stream sends the buffer to Cloudinary without saving to disk
  const stream = cloudinary.uploader.upload_stream(
    { folder: "ecommerce/products" }, // images go into this Cloudinary folder
    (error, result) => {
      if (error) {
        console.error("Cloudinary actual error:", error); // <-- shows real reason
        return next(
          new AppError(`Cloudinary upload failed: ${error.message}`, 500),
        );
      }

      // Return the secure URL back to frontend
      return res.status(200).json({
        status: "success",
        data: { url: result.secure_url },
      });
    },
  );

  // Pipe the in-memory buffer into the Cloudinary stream
  stream.end(req.file.buffer);
};
