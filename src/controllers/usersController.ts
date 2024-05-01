import { BadRequestError } from "../utils/errors";
import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../services/usersService";
import { validationResult } from "express-validator";

export async function signup(req: Request, res: Response) {
  const { username, password, email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestError("Invalid user input", errors.array());
  }
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new BadRequestError("user already exists");
  }
  await createUser({ username, password, email });
  return res.status(201).send({ message: "User registered successfully" });
}
