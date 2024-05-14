import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.js"; // Assuming you have a User model

export interface OrderProduct {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface OrderDocument extends Document {
  user: IUser["_id"];
  products: OrderProduct[];
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  totalPrice: number;
  shippingAddress: string;
  createdAt: Date;
}

const orderSchema = new Schema<OrderDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);
