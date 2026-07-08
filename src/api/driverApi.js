export async function fetchDriverStats() {
  const res = await fetch("/api/driver/stats");
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || "Erreur lors du chargement des statistiques");
  return body;
}

export async function fetchDriverOrders() {
  const res = await fetch("/api/driver/orders");
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || "Erreur lors du chargement des commandes");
  return body;
}

export async function advanceOrderStatus(orderId, status) {
  const res = await fetch(`/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || "Erreur lors de la mise à jour du statut");
  return body;
}