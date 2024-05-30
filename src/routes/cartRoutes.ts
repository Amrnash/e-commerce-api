import express from "express";
import {
  addToCart,
  viewCart,
  updateCartItem,
  checkout,
} from "../controllers/cartController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/cart/add", addToCart);
router.get("/cart", viewCart);
router.put("/cart/update", updateCartItem);
router.post("/cart/checkout", checkout);

export default router;
