import { User } from "../models/user";

type UserCreate = {
  username: string;
  email: string;
  password: string;
};

export async function createUser({ email, password, username }: UserCreate) {
  const user = new User({ email, username, password });
  return await user.save();
}

export async function getUserByEmail(email: string) {
  return await User.findOne({ email });
}
