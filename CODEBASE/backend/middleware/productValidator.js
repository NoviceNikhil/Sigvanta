const Joi = require("joi");
const AppError = require("../utils/AppError");

// Define the exact rules for a product
const productValidationSchema = Joi.object({
  name: Joi.string().strict().required().messages({
    "string.base": "Product name must be a string, not a number.",
    "any.required": "Product name is required.",
  }),
  categoryID: Joi.number().integer().required().messages({
    "number.base": "Category ID must be a valid integer.",
  }),
  image: Joi.string().uri().optional().messages({
    "string.uri": "Image must be a valid URL.",
  }),
  actual_price: Joi.number().precision(2).positive().required().messages({
    "number.positive": "Actual price must be greater than 0.",
  }),
  discount_price: Joi.number()
    .precision(2)
    .min(0)
    .less(Joi.ref("actual_price"))
    .required()
    .messages({
      "number.less":
        "Discount price must be strictly less than the actual price.",
      "number.min": "Discount price cannot be negative.",
    }),
  description: Joi.string().allow("", null).optional(),
  rating: Joi.number().min(1).max(5).required().messages({
    "number.min": "Rating must be at least 1.",
    "number.max": "Rating cannot be more than 5.",
  }),
  stock_quantity: Joi.number().integer().min(1).required().messages({
    "number.min": "Stock quantity cannot be negative.",
    "number.base": "Stock quantity must be an integer.",
  }),
});

exports.validateProduct = (req, res, next) => {
  const { error } = productValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(" | ");

    return next(new AppError(`Validation Failed: ${errorMessages}`, 400));
  }

  next();
};
