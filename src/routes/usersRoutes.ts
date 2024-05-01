import { Router } from "express";
import {
  signup,
  login,
  addRole,
  removeRole,
  confirmEmail,
} from "../controllers/usersController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  signupValidators,
  loginValidators,
  addRoleValidators,
  removeRoleValidators,
} from "../utils/validators/usersValidators.js";
import { checkErrors } from "../middlewares/checkErrors.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRoles } from "../middlewares/requireRoles.js";

const router = Router();

router.post("/signup", signupValidators, checkErrors, asyncHandler(signup));
router.post("/login", loginValidators, checkErrors, asyncHandler(login));
router.patch(
  "/:id/roles/add",
  addRoleValidators,
  checkErrors,
  authMiddleware,
  requireRoles(["admin"]),
  asyncHandler(addRole)
);
router.patch(
  "/:id/roles/remove",
  removeRoleValidators,
  checkErrors,
  authMiddleware,
  requireRoles(["admin"]),
  asyncHandler(removeRole)
);
router.get("/confirm-email/:token", asyncHandler(confirmEmail));

export { router as userRouter };
