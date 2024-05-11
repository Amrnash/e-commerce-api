import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProduct,
} from "../controllers/productsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRoles } from "../middlewares/requireRoles.js";
import { upload } from "../config/multer.js";

const router = Router();

router.get("/", asyncHandler(getProducts));
router.post(
  "/",
  authMiddleware,
  requireRoles(["admin"]),
  upload.single("image"),
  asyncHandler(createProduct)
);

router.get("/:id", asyncHandler(getProductById));
router.patch(
  "/:id",
  authMiddleware,
  requireRoles(["admin"]),
  upload.single("image"),
  asyncHandler(updateProductById)
);

router.delete(
  "/:id",
  authMiddleware,
  requireRoles(["admin"]),
  asyncHandler(deleteProduct)
);
export { router as productsRouter };
