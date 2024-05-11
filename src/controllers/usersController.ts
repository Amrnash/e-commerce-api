import { BadRequestError, NotFoundError } from "../utils/errors.js";
import { Request, Response } from "express";
import {
  createUser,
  getUserByEmail,
  getUserAndMatchPasswords,
  getUserById,
  getUserByConfirmationToken,
} from "../services/usersService.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { EmailSender } from "../utils/EmailSender.js";

export async function signup(req: Request, res: Response) {
  const { username, password, email } = req.body;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new BadRequestError("user already exists");
  }
  const confirmationToken = uuidv4();

  const user = await createUser({
    username,
    password,
    email,
    confirmationToken,
  });

  const confirmationLink = `${process.env.HOST}/confirm-email/${confirmationToken}`;
  const sender = new EmailSender();
  sender.send(email, confirmationLink);

  const token = jwt.sign(
    { userId: user._id, roles: user.roles },
    process.env.SECRET_KEY!
  );
  return res
    .status(201)
    .send({ message: "User registered successfully", token });
}

export async function confirmEmail(req: Request, res: Response) {
  const { token } = req.params;
  const user = await getUserByConfirmationToken(token);

  if (!user) {
    throw new NotFoundError();
  }

  user.isConfirmedEmail = true;
  user.confirmationToken = null;
  await user.save();

  res.status(200).json({ message: "Email confirmed successfully" });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await getUserAndMatchPasswords(email, password);
  const token = jwt.sign(
    { userId: user._id, roles: user.roles },
    process.env.SECRET_KEY!
  );

  return res.json({ token });
}

export async function addRole(req: Request, res: Response) {
  const { role } = req.body;
  const { id } = req.params;

  const user = await getUserById(id);
  if (!user) throw new BadRequestError("Invalid user id");

  const existingRole = user.roles.includes(role);
  if (existingRole) throw new BadRequestError("Role already exists");

  user.roles.push(role);
  await user.save();
  return res.send({ message: "Role added successfully" });
}

export async function removeRole(req: Request, res: Response) {
  const { role } = req.body;
  const { id } = req.params;

  const user = await getUserById(id);
  if (!user) throw new BadRequestError("Invalid user id");

  const existingRole = user.roles.includes(role);
  if (!existingRole) throw new BadRequestError("Role does not exist");

  user.roles = user.roles.filter((r) => r !== role);
  await user.save();
  return res.send({ message: "Role removed successfully" });
}
