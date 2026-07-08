export async function fetchOrderByTrackingId(trackingId) {
  const res = await fetch(`/api/tracking/${trackingId}`);
  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.error || "Commande introuvable");
  }

  return body;
}