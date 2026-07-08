import { updateOrderStatus } from "@/services/orderService";
import { requireUser } from "@/lib/authGuard";
import { ok, apiError } from "@/app/api/apiHelpers";

export async function PATCH(req, { params }) {
  try {
    const user = await requireUser(["driver"]);
    const { status } = await req.json();
    const { id } = await params;

    const order = await updateOrderStatus(user.id, id, status);
    return ok(order);
  } catch (err) {
    return apiError(err);
  }
}