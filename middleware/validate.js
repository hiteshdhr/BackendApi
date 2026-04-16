const Joi = require("joi");

// validation for register
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password should be at least 6 characters",
    "any.required": "Password is required",
  }),
});

// validation for login (same fields basically)
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// task validation
const taskSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title is required",
  }),
  description: Joi.string().allow("").optional(),
  dueDate: Joi.date().iso().optional().messages({
    "date.format": "Due date must be a valid ISO date (YYYY-MM-DD)",
  }),
  status: Joi.string().valid("pending", "completed").optional(),
});

// for updates we don't need required fields
const taskUpdateSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().allow("").optional(),
  dueDate: Joi.date().iso().optional(),
  status: Joi.string().valid("pending", "completed").optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  taskSchema,
  taskUpdateSchema,
};
