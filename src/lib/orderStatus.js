export const ORDER_STATUSES = [
  { value: "pending_assignment", label: "En attente", color: "#D97706", bg: "#FEF3C7" },
  { value: "assigned", label: "Assignée", color: "#2563EB", bg: "#DBEAFE" },
  { value: "in_delivery", label: "En livraison", color: "#EA580C", bg: "#FFEDD5" },
  { value: "delivered", label: "Livrée", color: "#059669", bg: "#D1FAE5" },
];

export const NEXT_STATUS = {
  assigned: "in_delivery",
  in_delivery: "delivered",
};

export function getStatusMeta(status) {
  return ORDER_STATUSES.find((s) => s.value === status) || ORDER_STATUSES[0];
}

export function getNextStatus(status) {
  return NEXT_STATUS[status] || null;
}