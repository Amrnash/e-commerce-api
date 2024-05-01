import { User } from "../models/user.js";
import { BadRequestError } from "../utils/errors.js";

type UserCreate = {
  username: string;
  email: string;
  password: string;
  confirmationToken: string;
};

export async function createUser({
  email,
  password,
  username,
  confirmationToken,
}: UserCreate) {
  const user = new User({ email, username, password, confirmationToken });
  return user.save();
}

export async function getUserByEmail(email: string) {
  return User.findOne({ email });
}
export async function getUserByConfirmationToken(confirmationToken: string) {
  return User.findOne({ confirmationToken });
}
export async function getUserById(id: string) {
  return User.findById(id);
}

export async function getUserAndMatchPasswords(
  email: string,
  password: string
) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("Invalid username or password");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new BadRequestError("Invalid username or password");
  }
  return user;
}
