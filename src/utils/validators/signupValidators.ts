import { check } from "express-validator";

export const signupValidators = [
  check("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  check("email").isEmail().withMessage("Must be a valid email address"),
];
