import { Order, OrderDocument } from "../models/order.js";

export const createOrder = async (orderData: any): Promise<OrderDocument> => {
  const newOrder: OrderDocument = new Order(orderData);
  return newOrder.save();
};

export const getOrderById = async (
  orderId: string
): Promise<OrderDocument | null> => {
  return Order.findById(orderId);
};

export const updateOrder = async (
  orderId: string,
  updates: any
): Promise<OrderDocument | null> => {
  return Order.findByIdAndUpdate(orderId, updates, { new: true });
};

export const cancelOrder = async (
  orderId: string
): Promise<OrderDocument | null> => {
  return Order.findByIdAndUpdate(
    orderId,
    { status: "cancelled" },
    { new: true }
  );
};

export const listOrders = async (): Promise<OrderDocument[]> => {
  return Order.find();
};
