import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { AppError } from "@/app/api/apiHelpers";

export async function registerUser({ username, email, password, role }) {
  if (!username || !email || !password || !role) {
    throw new AppError("All fields are required", 400);
  }

  if (!["merchant", "driver"].includes(role)) {
    throw new AppError("Role must be either merchant or driver", 400);
  }

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("Email is already in use", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

export async function validateCredentials({ email, password }) {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AppError("Invalid email or password", 401);
  }

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  };
}