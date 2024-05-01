import { User } from "../../models/user.js";
import { describe, it, vi, Mock, expect, afterEach } from "vitest";
import {
  createUser,
  getUserByEmail,
  getUserAndMatchPasswords,
  getUserById,
} from "../../services/usersService.js";
vi.mock("../../models/user");

afterEach(() => {
  vi.resetAllMocks();
});

describe("Users Service", () => {
  describe("createUser()", () => {
    it("creates a new user and saves it to DB", async () => {
      const newUser = {
        username: "test",
        email: "test@gmail.com",
        password: "test12345",
        confirmationToken: "test",
      };
      await createUser(newUser);
      expect(User as unknown as Mock).toBeCalledWith(newUser);
      expect((User as unknown as Mock).mock.instances.length).toBe(1);
      expect(User.prototype.save).toBeCalled();
    });
  });

  describe("getUserByEmail()", () => {
    it("fetches a user by email", async () => {
      const email = "test@gmail.com";
      await getUserByEmail(email);
      expect(User.findOne).toBeCalledWith({ email });
    });
  });

  describe("getUserById()", () => {
    it("fetches a user by id", async () => {
      const id = "id";
      await getUserById(id);
      expect(User.findById).toBeCalledWith(id);
    });
  });

  describe("getUserAndMatchPasswords()", () => {
    it("Fetches a user with a given email and returns it if the password is correct", async () => {
      const email = "test@gmail.com";
      const password = "test1234";

      // mock User.findOne to return mock data
      (User.findOne as Mock).mockImplementationOnce(() => ({
        email,
        password,
        comparePassword: vi.fn().mockResolvedValue(true),
      }));

      const user = await getUserAndMatchPasswords(email, password);
      expect(User.findOne).toBeCalledWith({ email });
      expect(user.email).toBe(email);
    });

    it("Throws if email is invalid", async () => {
      const email = "test@gmail.com";
      const password = "test1234";

      (User.findOne as Mock).mockImplementationOnce(() => null);

      expect(getUserAndMatchPasswords(email, password)).rejects.toThrowError();
    });

    it("Throws if passwords does not match", async () => {
      const email = "test@gmail.com";
      const password = "test1234";

      (User.findOne as Mock).mockImplementationOnce(() => ({
        comparePassword: vi.fn().mockResolvedValue(false),
      }));

      expect(getUserAndMatchPasswords(email, password)).rejects.toThrowError();
    });
  });
});
