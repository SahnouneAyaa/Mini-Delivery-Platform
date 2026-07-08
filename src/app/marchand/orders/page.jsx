"use client";
import { useEffect, useMemo, useState } from "react";
import DataTable from "@/components/general/DataTable";
import ToolBar from "@/components/general/ToolBar";
import StatusBadge from "@/components/general/StatusBadge";
import AddOrderModal from "@/components/orders/AddOrderModal";
import AssignDriverModal from "@/components/orders/AssignDriverModal";
import { useModal } from "@/hooks/useModal";
import { ORDER_STATUSES } from "@/lib/orderStatus";
import { fetchMerchantOrders } from "@/api/orderApi";

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const addModal = useModal();
  const assignModal = useModal();

  const loadOrders = () => {
    setLoading(true);
    fetchMerchantOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
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

  const openAssign = (order) => {
    setActiveOrder(order);
    assignModal.openModal();
  };

  const handleOrderCreated = (order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const handleDriverAssigned = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)),
    );
  };

  const handleCopyTrackingLink = (order) => {
    const link = `${window.location.origin}/tracking/${order.trackingId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(order._id);
    setTimeout(() => setCopiedId(null), 1500);
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
      key: "driver",
      label: "Livreur",
      render: (row) => row.driver?.username || "—",
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => new Date(row.createdAt).toLocaleDateString("fr-FR"),
    },
    {
      key: "tracking",
      label: "Lien client",
      render: (row) => (
        <button
          onClick={() => handleCopyTrackingLink(row)}
          className="text-[12px] font-semibold text-slate-600 border-none bg-transparent cursor-pointer hover:underline"
        >
          {copiedId === row._id ? "Copié !" : "Copier le lien"}
        </button>
      ),
    },
    {
      key: "assign",
      label: "Actions",
      render: (row) =>
        row.status === "pending_assignment" ? (
          <button
            onClick={() => openAssign(row)}
            className="text-[12px] font-semibold text-orange-600 border-none bg-transparent cursor-pointer hover:underline"
          >
            Assigner
          </button>
        ) : null,
    },
  ];

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Commandes</h1>

      <DataTable
        title="Toutes les commandes"
        rows={filteredOrders}
        columns={columns}
        loading={loading}
        badge={`${filteredOrders.length} commande${filteredOrders.length > 1 ? "s" : ""}`}
        emptyText="Aucune commande trouvée"
        filterBar={
          <ToolBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Rechercher par client..."
            actionLabel="Nouvelle commande"
            onAction={addModal.openModal}
            filterSlot={
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 text-[13px] px-3 rounded-lg outline-none w-[170px]"
                style={{ border: "0.5px solid rgba(0,0,0,0.12)" }}
              >
                <option value="">Tous les statuts</option>
                {ORDER_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            }
          />
        }
      />

      <AddOrderModal
        isOpen={addModal.isOpen}
        onClose={addModal.closeModal}
        onCreated={handleOrderCreated}
      />

      <AssignDriverModal
        isOpen={assignModal.isOpen}
        onClose={assignModal.closeModal}
        order={activeOrder}
        onAssigned={handleDriverAssigned}
      />
    </div>
  );
}
