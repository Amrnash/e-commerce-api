import express from "express";
import {
  createOrder,
  getOrderById,
  updateOrder,
  cancelOrder,
  listOrders,
} from "../controllers/ordersController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireRoles } from "../middlewares/requireRoles.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/orders", asyncHandler(createOrder));
router.get("/orders/:id", asyncHandler(getOrderById));
router.put("/orders/:id", asyncHandler(updateOrder));
router.patch("/orders/:id/cancel", asyncHandler(cancelOrder));
router.get("/orders", requireRoles(["admin"]), asyncHandler(listOrders));

export default router;
