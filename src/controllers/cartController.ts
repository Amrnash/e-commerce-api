import { Request, Response } from "express";
import * as cartController from "../services/cartService";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const { userId, productId, quantity } = req.body;
  await cartController.addToCart(userId, productId, quantity);
  res.status(200).json({ message: "Product added to cart successfully" });
};

export const viewCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  const cart = await cartController.viewCart(userId);
  res.status(200).json(cart);
};

export const updateCartItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, productId, quantity } = req.body;
  await cartController.updateCartItem(userId, productId, quantity);
  res.status(200).json({ message: "Cart item updated successfully" });
};

export const checkout = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  await cartController.checkout(userId);
  res.status(200).json({ message: "Checkout successful" });
};
