"use client";
import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { Modal } from "@/components/modal/Modal";
import ModalButton from "@/components/modal/ModalButton";
import { fetchAvailableDrivers, assignDriverToOrder } from "@/api/orderApi";

function AssignDriverModal({ isOpen, onClose, order, onAssigned }) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setError("");
    setSelectedDriver(null);

    fetchAvailableDrivers()
      .then(setDrivers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleClose = () => {
    setSelectedDriver(null);
    onClose();
  };

  const handleAssign = async () => {
    if (!selectedDriver) return;

    setSubmitting(true);
    setError("");

    try {
      const updatedOrder = await assignDriverToOrder(order._id, selectedDriver);
      onAssigned?.(updatedOrder);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[440px] p-6 lg:p-8">
      <div className="flex flex-col gap-5">
        <div>
          <h5 className="text-xl font-semibold text-slate-900 mb-1">Assigner un livreur</h5>
          <p className="text-sm text-slate-400">Commande de {order?.customerName}</p>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400 text-center py-6">Chargement des livreurs...</p>
        ) : drivers.length === 0 && !error ? (
          <p className="text-sm text-slate-400 text-center py-6">Aucun livreur disponible pour le moment</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto">
            {drivers.map((driver) => (
              <button
                key={driver._id}
                type="button"
                onClick={() => setSelectedDriver(driver._id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-colors ${
                  selectedDriver === driver._id
                    ? "border-orange-500 bg-orange-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                  <Truck size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{driver.username}</p>
                  <p className="text-xs text-slate-400">{driver.email}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <div className="flex gap-2.5 justify-end pt-1">
          <ModalButton onClick={handleClose}>Annuler</ModalButton>
          <ModalButton
            bgColor="bg-orange-600"
            textColor="text-white"
            onClick={handleAssign}
            disabled={!selectedDriver || submitting}
          >
            {submitting ? "Assignation..." : "Assigner"}
          </ModalButton>
        </div>
      </div>
    </Modal>
  );
}

export default AssignDriverModal;