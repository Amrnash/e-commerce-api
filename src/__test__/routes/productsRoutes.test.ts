import request from "supertest";
import { app } from "../../app.js";
import { Mock, describe, expect, it, vi } from "vitest";
import * as productsService from "../../services/productsService.js";
import jwt from "jsonwebtoken";

vi.mock("../../services/productsService.js");

describe("products routes", () => {
  describe("GET /products", () => {
    it("gets page of products filtered by category, price_min, price_max, page and limit", async () => {
      const filter = {
        priceMin: 10,
        priceMax: 500,
        category: "test",
        page: 1,
        limit: 10,
      };
      let queryString = `price_min=${filter.priceMin}`;
      queryString += `&price_max=${filter.priceMax}`;
      queryString += `&category=${filter.category}`;
      queryString += `&page=${filter.page}&limit=${filter.limit}`;

      const { statusCode } = await request(app).get(`/products?${queryString}`);

      expect(statusCode).toBe(200);
      expect(productsService.getPaginatedProducts).toBeCalledWith(
        filter.page,
        filter.limit,
        {
          price: { $gte: filter.priceMin, $lte: filter.priceMax },
          category: filter.category,
        }
      );
    });
  });

  describe("GET /products/:id", () => {
    it("gets a product by mongo id", async () => {
      (productsService.getProductById as Mock).mockResolvedValue({
        name: "test",
      });
      const { statusCode } = await request(app).get(`/products/id`);
      expect(statusCode).toBe(200);
      expect(productsService.getProductById).toHaveBeenCalledWith("id");
    });
  });

  describe("GET /products/:id", () => {
    it("gets a product by mongo id", async () => {
      (productsService.getProductById as Mock).mockResolvedValue({
        name: "test",
      });
      const { statusCode } = await request(app).get(`/products/id`);
      expect(statusCode).toBe(200);
      expect(productsService.getProductById).toHaveBeenCalledWith("id");
    });
  });

  describe("POST /products/", () => {
    it("creates a new product", async () => {
      (productsService.createProduct as Mock).mockResolvedValue({
        name: "test",
      });
      const dummyProduct = {
        name: "test",
        description: "testing..",
        price: 20,
        category: "test",
        stock: 10,
      };

      const token = jwt.sign(
        { _id: "id", roles: ["admin"] },
        process.env.SECRET_KEY!
      );
      const { statusCode } = await request(app)
        .post(`/products`)
        .set({ authorization: `Bearer ${token}` })
        .send(dummyProduct);

      expect(statusCode).toBe(201);
      expect(productsService.createProduct).toHaveBeenCalledWith(
        expect.objectContaining(dummyProduct)
      );
    });
  });

  describe("PATCH /products/:id", () => {
    it("updates a product with provided fields", async () => {
      const dummyProduct = {
        name: "test",
        description: "testing..",
        price: 20,
        category: "test",
        stock: 10,
        save: vi.fn(),
      };
      (productsService.getProductById as Mock).mockResolvedValue(dummyProduct);

      const token = jwt.sign(
        { _id: "id", roles: ["admin"] },
        process.env.SECRET_KEY!
      );
      const { statusCode } = await request(app)
        .patch(`/products/id`)
        .set({ authorization: `Bearer ${token}` })
        .send({
          name: "updated test",
        });

      expect(statusCode).toBe(200);
      expect(dummyProduct.save).toBeCalled();
    });
  });

  describe("DELETE /products/:id", () => {
    it("deletes a product with mongo id", async () => {
      const dummyProduct = {
        name: "test",
        description: "testing..",
        price: 20,
        category: "test",
        stock: 10,
        save: vi.fn(),
      };
      (productsService.deleteProductById as Mock).mockResolvedValue(
        dummyProduct
      );

      const token = jwt.sign(
        { _id: "id", roles: ["admin"] },
        process.env.SECRET_KEY!
      );
      const { statusCode } = await request(app)
        .delete(`/products/id`)
        .set({ authorization: `Bearer ${token}` });

      expect(statusCode).toBe(200);
    });
  });
});
