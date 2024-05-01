import { body } from "express-validator";

export const signupValidators = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("email").isEmail().withMessage("Must be a valid email address"),
];

export const loginValidators = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("email").isEmail().withMessage("Must be a valid email address"),
];

export const addRoleValidators = [body("role").exists().notEmpty()];
export const removeRoleValidators = [body("role").exists().notEmpty()];
