import { getMerchantStats } from "@/services/orderService";
import { requireUser } from "@/lib/authGuard";
import { ok, apiError } from "@/app/api/apiHelpers";

export async function GET() {
  try {
    const user = await requireUser(["merchant"]);
    const stats = await getMerchantStats(user.id);
    return ok(stats);
  } catch (err) {
    return apiError(err);
  }
}