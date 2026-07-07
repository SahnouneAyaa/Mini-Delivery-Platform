"use client";
import { useEffect, useState } from "react";
import { Package, Clock, Truck, CheckCircle2 } from "lucide-react";
import StatCard from "@/components/general/StatCard";
import DataTable from "@/components/general/DataTable";
import StatusBadge from "@/components/general/StatusBadge";
import { fetchMerchantStats, fetchMerchantOrders } from "@/api/orderApi";

const RECENT_LIMIT = 10;

const columns = [
  { key: "customerName", label: "Client", render: (row) => row.customerName },
  { key: "total", label: "Total", render: (row) => `${row.total} DZD` },
  { key: "status", label: "Statut", render: (row) => <StatusBadge status={row.status} /> },
  {
    key: "createdAt",
    label: "Date",
    render: (row) => new Date(row.createdAt).toLocaleDateString("fr-FR"),
  },
];

export default function MerchantDashboardPage() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchMerchantStats(), fetchMerchantOrders()])
      .then(([statsData, ordersData]) => {
        setStats(statsData);
        setOrders(ordersData.slice(0, RECENT_LIMIT));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-slate-500">Chargement du tableau de bord...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const cards = [
    { title: "Total des commandes", stat: stats.total, detail: "Toutes les commandes", icon: Package, color: "#0F172A", gradientTo: "#F1F5F9", shadowColor: "#0F172A", href: "/marchand/orders" },
    { title: "En attente d'assignation", stat: stats.pending_assignment, detail: "À assigner à un livreur", icon: Clock, color: "#D97706", gradientTo: "#FEF3C7", shadowColor: "#D97706", href: "/marchand/orders" },
    { title: "En livraison", stat: stats.in_delivery, detail: "En cours de livraison", icon: Truck, color: "#EA580C", gradientTo: "#FFEDD5", shadowColor: "#EA580C", href: "/marchand/orders" },
    { title: "Livrées", stat: stats.delivered, detail: "Commandes terminées", icon: CheckCircle2, color: "#059669", gradientTo: "#D1FAE5", shadowColor: "#059669", href: "/marchand/orders" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>

      <div className="flex flex-wrap gap-5">
        {cards.map((c) => (
          <StatCard key={c.title} {...c} />
        ))}
      </div>

      <DataTable
        title="Commandes récentes"
        rows={orders}
        columns={columns}
        badge={`${orders.length} commande${orders.length > 1 ? "s" : ""}`}
        paginate={false}
        emptyText="Aucune commande pour le moment"
      />
    </div>
  );
}