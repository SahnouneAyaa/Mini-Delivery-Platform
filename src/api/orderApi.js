


export async function fetchMerchantStats() {
  const res = await fetch("/api/orders/stats");
  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.error || "Erreur lors du chargement des statistiques");
  }

  return body;
}

export async function fetchMerchantOrders() {
  const res = await fetch("/api/orders");
  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.error || "Erreur lors du chargement des commandes");
  }

  return body;
}

export async function createOrder(data) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.error || "Erreur lors de la création de la commande");
  }

  return body;
}

export async function fetchAvailableDrivers() {
  const res = await fetch("/api/drivers/available");
  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.error || "Erreur lors du chargement des livreurs");
  }

  return body;
}

export async function assignDriverToOrder(orderId, driverId) {
  const res = await fetch(`/api/orders/${orderId}/assign`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ driverId }),
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.error || "Erreur lors de l'assignation du livreur");
  }

  return body;
}