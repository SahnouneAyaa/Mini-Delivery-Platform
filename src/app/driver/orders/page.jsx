"use client";
import { useEffect, useMemo, useState } from "react";
import DataTable from "@/components/general/DataTable";
import ToolBar from "@/components/general/ToolBar";
import StatusBadge from "@/components/general/StatusBadge";
import {
  ORDER_STATUSES,
  getNextStatus,
  getStatusMeta,
} from "@/lib/orderStatus";
import { fetchDriverOrders, advanceOrderStatus } from "@/api/driverApi";

const DRIVER_STATUSES = ORDER_STATUSES.filter(
  (s) => s.value !== "pending_assignment",
);

export default function DriverOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchDriverOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = o.customerName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = statusFilter ? o.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const handleAdvance = async (order) => {
    const next = getNextStatus(order.status);
    if (!next) return;

    setUpdatingId(order._id);
    setError("");

    try {
      const updated = await advanceOrderStatus(order._id, next);
      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o)),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    { key: "customerName", label: "Client", render: (row) => row.customerName },
    {
      key: "deliveryAddress",
      label: "Adresse",
      render: (row) => row.deliveryAddress,
    },
    {
      key: "products",
      label: "Produits",
      render: (row) =>
        `${row.products.length} article${row.products.length > 1 ? "s" : ""}`,
    },
    { key: "total", label: "Total", render: (row) => `${row.total} DZD` },
    {
      key: "status",
      label: "Statut",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "merchant",
      label: "Commerçant",
      render: (row) => row.merchant?.username || "—",
    },
    {
      key: "action",
      label: "Actions",
      render: (row) => {
        const next = getNextStatus(row.status);
        if (!next) return null;

        const nextLabel = getStatusMeta(next).label;

        return (
          <button
            onClick={() => handleAdvance(row)}
            disabled={updatingId === row._id}
            className="text-[12px] font-semibold text-orange-600 border-none bg-transparent cursor-pointer hover:underline disabled:opacity-50"
          >
            {updatingId === row._id ? "Mise à jour..." : `Marquer ${nextLabel}`}
          </button>
        );
      },
    },
  ];

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Mes commandes</h1>

      <DataTable
        title="Commandes assignées"
        rows={filteredOrders}
        columns={columns}
        loading={loading}
        badge={`${filteredOrders.length} commande${filteredOrders.length > 1 ? "s" : ""}`}
        emptyText="Aucune commande assignée"
        filterBar={
          <ToolBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Rechercher par client..."
            filterSlot={
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 text-[13px] px-3 rounded-lg outline-none w-[170px]"
                style={{ border: "0.5px solid rgba(0,0,0,0.12)" }}
              >
                <option value="">Tous les statuts</option>
                {DRIVER_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            }
          />
        }
      />
    </div>
  );
}
