const Joi = require("joi");
const AppError = require("../utils/AppError");

const categoryValidationSchema = Joi.object({
  categoryname: Joi.string()
    .trim()
    .lowercase()
    .min(3)
    .pattern(/[a-zA-Z]/)
    .max(50)
    .required()
    .messages({
      "string.base": "Category name must be a string.",
      "string.empty": "Category name must be a non-empty string.",
      "string.min": "Category name must be at least 3 characters long.",
      "string.max": "Category name must be less than 50 characters.",
      "string.pattern.base":"Category name must contain at least one alphabet character",
      "any.required": "Category name is required.",
    }),
  icon: Joi.string().allow("", null).optional().messages({
    "string.base": "Icon name must be a string.",
  }),
  color: Joi.string().allow("", null).optional().messages({
    "string.base": "Color class must be a string.",
  }),
});

const validateCategory = (req, res, next) => {
  const { error, value } = categoryValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details
      .map((detail) => String(detail.message))
      .join(" | ");

    return next(new AppError(`Validation Failed: ${errorMessages}`, 400));
  }

  req.body = value;
  console.log("hii from validate category");

  next();
};

module.exports = validateCategory;
