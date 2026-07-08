import { getDriverStats } from "@/services/orderService";
import { requireUser } from "@/lib/authGuard";
import { ok, apiError } from "@/app/api/apiHelpers";

export async function GET() {
  try {
    const user = await requireUser(["driver"]);
    const stats = await getDriverStats(user.id);
    return ok(stats);
  } catch (err) {
    return apiError(err);
  }
}