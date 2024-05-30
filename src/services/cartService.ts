import { Cart } from "../models/cart.js";
import { Order } from "../models/order.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<void> => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
};

export const viewCart = async (userId: string): Promise<any> => {
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name price"
  );

  if (!cart) {
    throw new BadRequestError("cart is empty");
  }

  return cart;
};

export const updateCartItem = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<void> => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  const item = cart.items.find((item) => item.product.toString() === productId);

  if (!item) {
    throw new NotFoundError("Item not found in cart");
  }

  item.quantity = quantity;
  await cart.save();
};

export const checkout = async (userId: string): Promise<void> => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const order = new Order({
    user: userId,
    products: cart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    })),
    totalPrice: cart.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    ),
    shippingAddress: "test",
  });

  await order.save();

  cart.items = [];
  await cart.save();
};
