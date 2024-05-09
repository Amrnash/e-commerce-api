import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Product } from "../models/product.js";

mongoose
  .connect(process.env.MONGO_DB!)
  .then(() => {
    console.log("Connected to MongoDB");
    seedProducts();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

async function seedProducts() {
  const numberOfProducts = 50;
  const products = [];

  for (let i = 0; i < numberOfProducts; i++) {
    const product = {
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      stock: faker.number.int({ min: 1, max: 100 }),
      image: faker.image.url(),
    };

    products.push(product);
  }

  try {
    await Product.insertMany(products);
    console.log(`Seeded ${numberOfProducts} products`);
  } catch (err) {
    console.error("Error seeding products:", err);
  } finally {
    mongoose.disconnect();
  }
}
