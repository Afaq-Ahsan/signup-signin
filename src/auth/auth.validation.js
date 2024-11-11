const Joi = require("joi");

module.exports = {
  signup: {
    body: Joi.object({
      employeeName: Joi.string().trim().min(3).max(30).required().messages({
        "string.empty": "Username is required",
        "string.min": "Username must be at least 3 characters long",
        "string.max": "Username must be less than or equal to 30 characters",
      }),

      email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email",
      }),

      password: Joi.string().trim().min(8).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
      }),
    }),
  },

  signIn: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email",
      }),

      password: Joi.string().trim().min(8).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
      }),
    }),
  },

  generateNewAccessToken: {
    body: Joi.object({
      refreshToken: Joi.string().trim().required(),
    }),
  },
};
