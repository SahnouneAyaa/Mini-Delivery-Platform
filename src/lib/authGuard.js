import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppError } from "@/app/api/apiHelpers";

export async function requireUser(allowedRoles = []) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new AppError("Non authentifié", 401);
  }

  if (allowedRoles.length && !allowedRoles.includes(session.user.role)) {
    throw new AppError("Accès refusé", 403);
  }

  return session.user;
}