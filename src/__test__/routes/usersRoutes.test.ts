import request from "supertest";
import { app } from "../../app.js";
import {
  createUser,
  getUserByEmail,
  getUserAndMatchPasswords,
  getUserById,
} from "../../services/usersService.js";
import { vi, describe, it, expect, Mock, beforeEach } from "vitest";
import jwt from "jsonwebtoken";

vi.mock("../../services/usersService", () => {
  return {
    createUser: vi.fn().mockResolvedValue({
      _id: "userId",
      roles: ["admin"],
    }),
    getUserByEmail: vi.fn(),
    getUserAndMatchPasswords: vi.fn().mockResolvedValue({
      _id: "userId",
      roles: ["admin"],
    }),
    getUserById: vi.fn(),
  };
});

describe("POST /users/signup", () => {
  it("creates a new user and returns a success message and a token", async () => {
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
    expect(body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        message: expect.any(String),
      })
    );
    expect(createUser).toHaveBeenCalled();
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
  it("fails if username is less than 3 characters", async () => {
    const newUser = {
      username: "te",
      email: "test@gmail.com",
      password: "test12345",
    };
    const { statusCode } = await request(app)
      .post("/users/signup")
      .send(newUser)
      .set({ "Content-Type": "application/json" });

    expect(statusCode).toBe(400);
  });

  it("fails if password is less than 6 characters", async () => {
    const newUser = {
      username: "test",
      email: "test@gmail.com",
      password: "te",
    };
    const { statusCode } = await request(app)
      .post("/users/signup")
      .send(newUser)
      .set({ "Content-Type": "application/json" });

    expect(statusCode).toBe(400);
  });

  it("fails if email is invalid", async () => {
    const newUser = {
      username: "test",
      email: "test@",
      password: "test12345",
    };
    const { statusCode } = await request(app)
      .post("/users/signup")
      .send(newUser)
      .set({ "Content-Type": "application/json" });

    expect(statusCode).toBe(400);
  });
});

describe("POST /users/login", () => {
  it("login user and returns a token", async () => {
    const email = "test@gmail.com";
    const password = "test12345";

    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send({ email, password })
      .set({ "Content-Type": "application/json" });

    expect(statusCode).toBe(200);
    expect(getUserAndMatchPasswords).toHaveBeenCalledWith(email, password);
    expect(body).toEqual(
      expect.objectContaining({ token: expect.any(String) })
    );
  });

  it("fails if email is invalid", async () => {
    const email = "test@";
    const password = "test12345";

    const { statusCode } = await request(app)
      .post("/users/login")
      .send({ email, password })
      .set({ "Content-Type": "application/json" });

    expect(statusCode).toBe(400);
  });

  it("fails if password is less than 6 characters", async () => {
    const email = "test@gmail.com";
    const password = "te";

    const { statusCode } = await request(app)
      .post("/users/login")
      .send({ email, password })
      .set({ "Content-Type": "application/json" });

    expect(statusCode).toBe(400);
  });
});

describe("PATCH /users/:id/roles/add", () => {
  let mockUser: {
    _id: string;
    username: string;
    email: string;
    roles: string[];
    save: Mock;
  };
  beforeEach(() => {
    mockUser = {
      _id: "1",
      username: "test",
      email: "test@gmail.com",
      roles: ["admin"],
      save: vi.fn(),
    };
  });

  it("fails if no role is provided", async () => {
    const role = "";
    const token = jwt.sign(mockUser, process.env.SECRET_KEY!);
    const { statusCode } = await request(app)
      .patch("/users/invalidId/roles/add")
      .send({ role })
      .set("Authorization", `Bearer ${token}`)
      .set({ "Content-Type": "application/json" });

    expect(statusCode).toBe(400);
  });

  it("fails if no user exists with the given id", async () => {
    const role = "test";
    const token = jwt.sign(
      { userId: mockUser._id, roles: mockUser.roles },
      process.env.SECRET_KEY!
    );
    (getUserById as Mock).mockResolvedValueOnce(null);
    const { statusCode } = await request(app)
      .patch("/users/invalidId/roles/add")
      .send({ role })
      .set("Authorization", `Bearer ${token}`)
      .set({ "Content-Type": "application/json" });

    expect(statusCode).toBe(400);
  });

  it("Adds a role to user", async () => {
    const role = "test";
    const token = jwt.sign(
      { userId: mockUser._id, roles: mockUser.roles },
      process.env.SECRET_KEY!
    );

    (getUserById as Mock).mockResolvedValueOnce(mockUser);
    const { statusCode } = await request(app)
      .patch("/users/invalidId/roles/add")
      .send({ role })
      .set("Authorization", `Bearer ${token}`)
      .set({ "Content-Type": "application/json" });

    expect(statusCode).toBe(200);
    expect(mockUser.roles).contain("test");
  });
});

describe("PATCH /users/:id/roles/remove", () => {
  let mockUser: {
    _id: string;
    username: string;
    email: string;
    roles: string[];
    save: Mock;
  };
  beforeEach(() => {
    mockUser = {
      _id: "1",
      username: "test",
      email: "test@gmail.com",
      roles: ["admin"],
      save: vi.fn(),
    };
    vi.resetAllMocks();
  });

  it("fails if no role is provided", async () => {
    const role = "";
    const token = jwt.sign(mockUser, process.env.SECRET_KEY!);
    const { statusCode } = await request(app)
      .patch("/users/1/roles/add")
      .send({ role })
      .set("Authorization", `Bearer ${token}`)
      .set({ "Content-Type": "application/json" });

    expect(statusCode).toBe(400);
  });

  it("fails if no user exists with the given id", async () => {
    const role = "test";
    const token = jwt.sign(
      { userId: mockUser._id, roles: mockUser.roles },
      process.env.SECRET_KEY!
    );
    (getUserById as Mock).mockResolvedValueOnce(null);
    const { statusCode } = await request(app)
      .patch("/users/1/roles/add")
      .send({ role })
      .set("Authorization", `Bearer ${token}`)
      .set({ "Content-Type": "application/json" });

    expect(statusCode).toBe(400);
  });

  it("Removes a role to user", async () => {
    const role = "test";
    const token = jwt.sign(
      { userId: mockUser._id, roles: mockUser.roles },
      process.env.SECRET_KEY!
    );
    mockUser.roles.push(role);
    (getUserById as Mock).mockResolvedValueOnce(mockUser);
    const { statusCode } = await request(app)
      .patch("/users/1/roles/remove")
      .send({ role })
      .set("Authorization", `Bearer ${token}`)
      .set({ "Content-Type": "application/json" });

    expect(statusCode).toBe(200);
    expect(mockUser.roles).not.contain("test");
  });
});
