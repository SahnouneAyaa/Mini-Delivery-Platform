"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StatusBadge from "@/components/general/StatusBadge";
import { fetchOrderByTrackingId } from "@/api/trackingApi";

export default function TrackingPage() {
  const { trackingId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderByTrackingId(trackingId)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [trackingId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-slate-400">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Suivi de commande</h1>
          <p className="text-sm text-slate-400">
            Commande de {order.customerName}
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Statut</span>
            <StatusBadge status={order.status} />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Adresse de livraison</span>
            <span className="text-sm font-medium text-slate-800 text-right">
              {order.deliveryAddress}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Date de commande</span>
            <span className="text-sm font-medium text-slate-800">
              {new Date(order.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Numéro de suivi</span>
            <span className="text-xs font-mono text-slate-400">
              {order.trackingId}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
          <span className="text-sm text-slate-500">Produits</span>
          <div className="flex flex-col gap-1.5">
            {order.products.map((p, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-700">{p.name}</span>
                <span className="text-slate-400">x{p.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-slate-100 pt-4">
          <span className="text-sm font-semibold text-slate-700">Total</span>
          <span className="text-sm font-semibold text-slate-900">
            {order.total} DZD
          </span>
        </div>
      </div>
    </div>
  );
}