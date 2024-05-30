import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.js";

export interface PaymentDocument extends Document {
  user: IUser["_id"];
  order: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "completed" | "failed";
  paymentMethod: string;
  paymentDate: Date;
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<PaymentDocument>(
  "Payment",
  paymentSchema
);
