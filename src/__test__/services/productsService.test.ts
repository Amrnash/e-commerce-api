import mongoose from "mongoose";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Product } from "../../models/product.js";
import * as productsService from "../../services/productsService.js";
import { clearDatabase } from "../../utils/utils.js";

describe("Products Service", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGO_DB!);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(() => {
    clearDatabase();
  });
  describe("getPaginatedProducts()", async () => {
    const fakeProducts = [
      {
        name: "test",
        description: "testing 1 description",
        price: 200,
        category: "test",
        stock: 20,
      },
      {
        name: "test 2",
        description: "testing 2 description",
        price: 100,
        category: "test",
        stock: 10,
      },
      {
        name: "test 3",
        description: "testing 3 description",
        price: 50,
        category: "test",
        stock: 4,
      },
      {
        name: "test 4",
        description: "testing 4 description",
        price: 40,
        category: "test",
        stock: 6,
      },
    ];
    beforeEach(async () => {
      await Product.insertMany(fakeProducts);
    });
    it("gets number of products equal to provided limit", async () => {
      const products = await productsService.getPaginatedProducts(1, 2, {});
      expect(products.length).toBe(2);
    });

    it("gets the provided page of products", async () => {
      const products1 = await productsService.getPaginatedProducts(1, 2, {});
      const products2 = await productsService.getPaginatedProducts(2, 2, {});
      expect(products1).not.toEqual(products2);
    });

    it("applies the filter", async () => {
      const products1 = await productsService.getPaginatedProducts(1, 1, {
        name: fakeProducts[0].name,
      });
      expect(products1[0].name).toBe(fakeProducts[0].name);
    });
  });

  describe("createProduct()", () => {
    it("creates a new product in the database", async () => {
      const fakeProduct = {
        name: "test",
        description: "testing description",
        price: 200,
        category: "test",
        stock: 20,
      };
      await productsService.createProduct(fakeProduct);

      const createdProduct = await Product.findOne({ name: "test" });

      expect(createdProduct?.name).toBe(fakeProduct.name);
    });
  });

  describe("getProductById()", () => {
    it("returns a product by mongo id", async () => {
      const fakeProduct = {
        name: "test",
        description: "testing description",
        price: 200,
        category: "test",
        stock: 20,
      };
      const { _id } = await Product.create(fakeProduct);

      const product = await productsService.getProductById(_id);

      expect(product?.name).toBe(fakeProduct.name);
    });
  });

  describe("updateProductById()", () => {
    it("updates a product by mongo id with provided fields", async () => {
      const fakeProduct = {
        name: "test",
        description: "testing description",
        price: 200,
        category: "test",
        stock: 20,
      };
      const { _id } = await Product.create(fakeProduct);

      const updates = {
        name: "updated name",
        description: "updated description",
      };

      const product = await productsService.updateProductById(_id, updates);

      expect(product?.name).toBe(updates.name);
      expect(product?.description).toBe(updates.description);
    });
  });

  describe("deleteProductById()", () => {
    it("deletes a product with given mongo id", async () => {
      const fakeProduct = {
        name: "test",
        description: "testing description",
        price: 200,
        category: "test",
        stock: 20,
      };
      const { _id } = await Product.create(fakeProduct);

      await productsService.deleteProductById(_id);

      const product = await Product.findById(_id);
      expect(product).toBe(null);
    });
  });
});
