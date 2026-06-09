const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/inventoryController");
const { validateProduct } = require("../middleware/productValidator");
const upload = require("../utils/multer");
const authenticate = require("../middleware/authenticate_middlewere");
const authorizeRoles = require("../middleware/roleVerifyMiddlewere");

const router = express.Router();

router.get("/", authenticate, authorizeRoles("admin"), getAllProducts);
router.post(
  "/uploadImage",
  authenticate,
  authorizeRoles("admin"),
  upload.single("image"),
  uploadImage,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  validateProduct,
  createProduct,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  validateProduct,
  updateProduct,
);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteProduct);

module.exports = router;
