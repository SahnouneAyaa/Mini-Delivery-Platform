import { getDriverOrders } from "@/services/orderService";
import { requireUser } from "@/lib/authGuard";
import { ok, apiError } from "@/app/api/apiHelpers";

export async function GET() {
  try {
    const user = await requireUser(["driver"]);
    const orders = await getDriverOrders(user.id);
    return ok(orders);
  } catch (err) {
    return apiError(err);
  }
}