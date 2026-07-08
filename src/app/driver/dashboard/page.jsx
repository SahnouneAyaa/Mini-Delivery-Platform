"use client";
import { useEffect, useState } from "react";
import { Package, Truck, CheckCircle2 } from "lucide-react";
import StatCard from "@/components/general/StatCard";
import DataTable from "@/components/general/DataTable";
import StatusBadge from "@/components/general/StatusBadge";
import { fetchDriverStats, fetchDriverOrders } from "@/api/driverApi";

const RECENT_LIMIT = 10;

const columns = [
  { key: "customerName", label: "Client", render: (row) => row.customerName },
  {
    key: "deliveryAddress",
    label: "Adresse",
    render: (row) => row.deliveryAddress,
  },
  {
    key: "status",
    label: "Statut",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "createdAt",
    label: "Date",
    render: (row) => new Date(row.createdAt).toLocaleDateString("fr-FR"),
  },
];

export default function DriverDashboardPage() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchDriverStats(), fetchDriverOrders()])
      .then(([statsData, ordersData]) => {
        setStats(statsData);
        setOrders(ordersData.slice(0, RECENT_LIMIT));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Chargement du tableau de bord...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );

  const cards = [
    {
      title: "Total des commandes",
      stat: stats.total,
      detail: "Toutes vos livraisons",
      icon: Package,
      color: "#0F172A",
      gradientTo: "#F1F5F9",
      shadowColor: "#0F172A",
      href: "/driver/orders",
    },
    {
      title: "En livraison",
      stat: stats.in_delivery,
      detail: "En cours actuellement",
      icon: Truck,
      color: "#EA580C",
      gradientTo: "#FFEDD5",
      shadowColor: "#EA580C",
      href: "/driver/orders",
    },
    {
      title: "Livrées",
      stat: stats.delivered,
      detail: "Commandes terminées",
      icon: CheckCircle2,
      color: "#059669",
      gradientTo: "#D1FAE5",
      shadowColor: "#059669",
      href: "/driver/orders",
    },
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
        emptyText="Aucune commande assignée pour le moment"
      />
    </div>
  );
}