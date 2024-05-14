import { Request, Response } from "express";
import { Order } from "../models/order.js";
import * as ordersService from "../services/ordersService.js";
import { NotFoundError } from "../utils/errors.js";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user, products, totalPrice, shippingAddress } = req.body;
  const newOrder = await ordersService.createOrder({
    user,
    products,
    totalPrice,
    shippingAddress,
  });
  res.status(201).json(newOrder);
};

export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orderId = req.params.id;
  const order = await ordersService.getOrderById(orderId);
  if (!order) {
    throw new NotFoundError("order not found");
  }
  res.status(200).json(order);
};

export const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orderId = req.params.id;
  const updates = req.body;
  const updatedOrder = await ordersService.updateOrder(orderId, updates);
  if (!updatedOrder) {
    res.status(404).json({ message: "Order not found" });
    return;
  }
  res.status(200).json(updatedOrder);
};

export const cancelOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orderId = req.params.id;
  const cancelledOrder = await ordersService.cancelOrder(orderId);
  if (!cancelledOrder) {
    res.status(404).json({ message: "Order not found" });
    return;
  }
  res.status(200).json(cancelledOrder);
};

export const listOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orders = await ordersService.listOrders();
  res.status(200).json(orders);
};
