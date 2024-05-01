import mongoose, { Schema, Document } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    required: false,
  },
});

export interface ProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

const Product = mongoose.model<ProductDocument>("Product", productSchema);

export default Product;
