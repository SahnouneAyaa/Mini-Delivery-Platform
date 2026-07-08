import { getOrderByTrackingId } from "@/services/orderService";
import { ok, apiError } from "@/app/api/apiHelpers";

export async function GET(req, { params }) {
  try {
    const { trackingId } = await params;
    const order = await getOrderByTrackingId(trackingId);
    return ok(order);
  } catch (err) {
    return apiError(err);
  }
}