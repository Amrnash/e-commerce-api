import { Router } from "express";
import { signup } from "../controllers/usersController";
import { asyncHandler } from "../utils/asyncHandler";
import { signupValidators } from "../utils/validators/signupValidators";

const router = Router();

router.post("/signup", signupValidators, asyncHandler(signup));

export { router as userRouter };
