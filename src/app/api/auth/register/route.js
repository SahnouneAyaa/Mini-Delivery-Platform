import { registerUser } from "@/services/authService";
import { created, apiError } from "@/app/api/apiHelpers";

export async function POST(req) {
  try {
    const body = await req.json();
    const user = await registerUser(body);
    return created(user);
  } catch (err) {
    return apiError(err);
  }
}