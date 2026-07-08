import { assignDriverToOrder } from "@/services/orderService";
import { requireUser } from "@/lib/authGuard";
import { ok, apiError } from "@/app/api/apiHelpers";

export async function PATCH(req, { params }) {
  try {
    const user = await requireUser(["merchant"]);
    const { driverId } = await req.json();
    const { id } = await params;

    const order = await assignDriverToOrder(user.id, id, driverId);
    return ok(order);
  } catch (err) {
    return apiError(err);
  }
}