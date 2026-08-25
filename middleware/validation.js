import { body, param, validationResult } from "express-validator";
// Check validation errors
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
}

// Login validation
export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("A valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  handleValidationErrors,
];

// Announcement validation
export const announcementValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid station ID"),

  body("text")
    .trim()
    .notEmpty()
    .withMessage("Announcement text is required"),

  handleValidationErrors,
];
