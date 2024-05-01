import request from "supertest";
import { app } from "../../app";
import { createUser, getUserByEmail } from "../../services/usersService";
import { vi, describe, it, expect, Mock } from "vitest";
vi.mock("../../services/usersService", () => {
  return {
    createUser: vi.fn(),
    getUserByEmail: vi.fn(),
  };
});

describe("users routes", () => {
  describe("POST /users/signup", () => {
    it("should create a new user and returns a success message", async () => {
      const newUser = {
        username: "test",
        email: "test@gmail.com",
        password: "test12345",
      };
      const { statusCode, body } = await request(app)
        .post("/users/signup")
        .send(newUser)
        .set({ "Content-Type": "application/json" });

      expect(statusCode).toBe(201);
      expect(body).toEqual({ message: "User registered successfully" });
      expect(createUser).toHaveBeenCalledWith({ ...newUser });
      expect(getUserByEmail).toHaveBeenCalledWith(newUser.email);
    });

    it("returns an error if a user exists with the same email", async () => {
      const newUser = {
        username: "test",
        email: "test@gmail.com",
        password: "test12345",
      };

      (getUserByEmail as Mock).mockImplementationOnce(() => ({
        username: "test2",
      }));

      const { statusCode, body } = await request(app)
        .post("/users/signup")
        .send(newUser)
        .set({ "Content-Type": "application/json" });

      expect(statusCode).toBe(400);
      expect(body).toEqual(
        expect.objectContaining({ error: expect.any(Object) })
      );
    });
  });
});
