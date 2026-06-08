const express = require("express");
const controller = require("../controllers/categoryController");
const validateCategory = require("../middleware/categoryValidator");
const authenticate = require("../middleware/authenticate_middlewere");
const authorizeRoles = require("../middleware/roleVerifyMiddlewere");

const router = express.Router();

router.get("/", controller.getAllCategories);

router.get("/:ID", controller.getCategoryById);

router.post(
  "/",
  validateCategory,
  authenticate,
  authorizeRoles("admin"),
  controller.createCategory,
);

router.put(
  "/:ID",
  validateCategory,
  authenticate,
  authorizeRoles("admin"),
  controller.updateCategory,
);

router.patch(
  "/:ID",
  validateCategory,
  authenticate,
  authorizeRoles("admin"),
  controller.patchCategory,
);

router.delete(
  "/:ID",
  authenticate,
  authorizeRoles("admin"),
  controller.deleteCategory,
);

module.exports = router;
