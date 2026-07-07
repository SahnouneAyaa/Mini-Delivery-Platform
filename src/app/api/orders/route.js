import { createOrder, getMerchantOrders } from "@/services/orderService";
import { requireUser } from "@/lib/authGuard";
import { ok, created, apiError } from "@/app/api/apiHelpers";

export async function POST(req) {
  try {
    const user = await requireUser(["merchant"]);
    const body = await req.json();
    const order = await createOrder(user.id, body);
    return created(order);
  } catch (err) {
    return apiError(err);
  }
}

export async function GET() {
  try {
    const user = await requireUser(["merchant"]);
    const orders = await getMerchantOrders(user.id);
    return ok(orders);
  } catch (err) {
    return apiError(err);
  }
}