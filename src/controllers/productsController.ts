import { Request, Response } from "express";
import * as productsService from "../services/productsService.js";
import { FilterQuery } from "mongoose";
import { ProductDocument } from "../models/product.js";
import { NotFoundError } from "../utils/errors.js";

export async function getProducts(req: Request, res: Response) {
  const { category, price_min, price_max, page = 1, limit = 10 } = req.query;

  const filter: FilterQuery<ProductDocument> = {};

  if (category) {
    filter.category = category;
  }

  if (price_min || price_max) {
    filter.price = {};
    if (price_min) {
      filter.price.$gte = parseFloat(price_min as string);
    }
    if (price_max) {
      filter.price.$lte = parseFloat(price_max as string);
    }
  }
  const products = await productsService.getPaginatedProducts(
    Number(page),
    Number(limit),
    filter
  );
  return res.json(products);
}

export async function getProductById(req: Request, res: Response) {
  const product = await productsService.getProductById(req.params.id as string);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json(product);
}

export async function createProduct(req: Request, res: Response) {
  const { name, description, price, category, stock, image } = req.body;
  const newProduct = await productsService.createProduct({
    name,
    description,
    price,
    category,
    stock,
    image,
  });

  return res.status(201).json(newProduct);
}

export async function updateProductById(req: Request, res: Response) {
  const { id } = req.params;
  const { name, description, price, category, stock, image } = req.body;
  const updatedProduct = await productsService.updateProductById(id, {
    name,
    description,
    price,
    category,
    stock,
    image,
  });

  if (!updatedProduct) {
    throw new NotFoundError("product not found");
  }
  return res.send({ updatedProduct });
}

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedProduct = await productsService.deleteProductById(id);

  if (!deletedProduct) {
    throw new NotFoundError("product not found");
  }

  return res.json({ message: "Product deleted successfully" });
};
