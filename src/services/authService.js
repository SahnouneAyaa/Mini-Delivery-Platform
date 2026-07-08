import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { AppError } from "@/app/api/apiHelpers";

export async function registerUser({ username, email, password, role }) {
  if (!username || !email || !password || !role) {
    throw new AppError("Tous les champs sont requis", 400);
  }

  if (!["merchant", "driver"].includes(role)) {
    throw new AppError("Rôle invalide", 400);
  }

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("Une erreur est survenue, veuillez réessayer", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ username, email, password: hashedPassword, role });

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

export async function validateCredentials({ email, password }) {
  if (!email || !password) {
    throw new AppError("Email et mot de passe requis", 400);
  }

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Email ou mot de passe incorrect", 401);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AppError("Email ou mot de passe incorrect", 401);
  }

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  };
}