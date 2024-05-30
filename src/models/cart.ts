import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.js";
import { ProductDocument } from "./product.js";

export interface CartItem {
  product: ProductDocument["_id"];
  quantity: number;
}

export interface CartDocument extends Document {
  user: IUser["_id"];
  items: CartItem[];
}

const cartItemSchema = new Schema<CartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new Schema<CartDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export const Cart = mongoose.model<CartDocument>("Cart", cartSchema);
