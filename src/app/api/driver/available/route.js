import { getAvailableDrivers } from "@/services/orderService";
import { requireUser } from "@/lib/authGuard";
import { ok, apiError } from "@/app/api/apiHelpers";

export async function GET() {
  try {
    await requireUser(["merchant"]);
    const drivers = await getAvailableDrivers();
    return ok(drivers);
  } catch (err) {
    return apiError(err);
  }
}