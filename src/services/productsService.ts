import { FilterQuery } from "mongoose";
import { Product, ProductDocument } from "../models/product.js";

type ProductCreate = {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: number;
  image?: string;
};
export async function getPaginatedProducts(
  page: number,
  limit: number,
  filter: FilterQuery<ProductDocument>
) {
  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);

  return products;
}

export async function getProductById(id: string) {
  return Product.findById(id);
}

export async function createProduct(product: ProductCreate) {
  const newProduct = new Product({
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    stock: product.stock,
    image: product.image,
  });
  return newProduct.save();
}

export const updateProductById = async (
  id: string,
  productData: Partial<ProductDocument>
) => {
  return Product.findByIdAndUpdate(id, productData, { new: true });
};

export const deleteProductById = async (id: string) => {
  return Product.findByIdAndDelete(id);
};
