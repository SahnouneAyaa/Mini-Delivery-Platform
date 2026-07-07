import { getOrderByTrackingId } from "@/services/orderService";
import { ok, apiError } from "@/app/api/apiHelpers";

export async function GET(req, { params }) {
  try {
    const order = await getOrderByTrackingId(params.trackingId);
    return ok(order);
  } catch (err) {
    return apiError(err);
  }
}