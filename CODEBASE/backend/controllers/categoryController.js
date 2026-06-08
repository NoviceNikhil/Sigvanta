const { successResponse } = require("../utils/apiResponce");
const categoryService = require("../services/categoryServices");
const AppError = require("../utils/AppError");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    return successResponse(
      res,
      "successfully fetched all the categories",
      categories,
      200,
    );
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.ID);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    return successResponse(
      res,
      "successfully fetched the category",
      category,
      200,
    );
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

// -------------------- CREATE CATEGORY --------------------
exports.createCategory = async (req, res, next) => {
  try {
    const { categoryname, icon, color } = req.body;

    // Check duplicate by name
    const existing = await categoryService.getCategoryByName(categoryname);
    if (existing) {
      return next(new AppError("Category already exists", 400));
    }

    const category = await categoryService.createCategory({
      categoryname,
      icon,
      color,
    });

    return successResponse(
      res,
      "successfully created the category",
      category,
      201,
    );
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

// -------------------- UPDATE CATEGORY (PUT) --------------------
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.ID,
      req.body,
    );

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    return successResponse(
      res,
      "successfully updated the category",
      category,
      200,
    );
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

// -------------------- PATCH CATEGORY --------------------
exports.patchCategory = async (req, res, next) => {
  try {
    const category = await categoryService.patchCategory(
      req.params.ID,
      req.body,
    );

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    return successResponse(
      res,
      "successfully updated the category",
      category,
      200,
    );
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

// -------------------- DELETE CATEGORY --------------------
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryService.deleteCategory(req.params.ID);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    return successResponse(
      res,
      "successfully deleted the category",
      category,
      200,
    );
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};
