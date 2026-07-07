"use client";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/modal/Modal";
import ModalButton from "@/components/modal/ModalButton";
import ModalInput from "@/components/forms/ModalInput";
import { orderSchema } from "@/lib/validation/orderSchemas";
import { createOrder } from "@/api/orderApi";

const emptyProduct = { name: "", quantity: 1 };

function AddOrderModal({ isOpen, onClose, onCreated }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: { customerName: "", deliveryAddress: "", products: [emptyProduct], total: "" },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "products" });

  useEffect(() => {
    if (isOpen) {
      reset({ customerName: "", deliveryAddress: "", products: [emptyProduct], total: "" });
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      const order = await createOrder(data);
      onCreated?.(order);
      handleClose();
    } catch (err) {
      setError("root", { message: err.message });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[520px] p-6 lg:p-8">
      <div className="flex flex-col gap-5">
        <div>
          <h5 className="text-xl font-semibold text-slate-900 mb-1">Nouvelle commande</h5>
          <p className="text-sm text-slate-400">Renseignez les informations de la commande</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <ModalInput
            label="Nom du client"
            placeholder="Nom complet"
            error={errors.customerName?.message}
            {...register("customerName")}
          />

          <ModalInput
            label="Adresse de livraison"
            placeholder="Adresse complète"
            error={errors.deliveryAddress?.message}
            {...register("deliveryAddress")}
          />

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-slate-700">Produits</label>
              <button
                type="button"
                onClick={() => append(emptyProduct)}
                className="flex items-center gap-1 text-[12px] font-semibold text-orange-600 border-none bg-transparent cursor-pointer"
              >
                <Plus size={14} /> Ajouter un produit
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="flex-1">
                  <ModalInput
                    placeholder="Nom du produit"
                    error={errors.products?.[index]?.name?.message}
                    {...register(`products.${index}.name`)}
                  />
                </div>
                <div className="w-24">
                  <ModalInput
                    type="number"
                    placeholder="Qté"
                    error={errors.products?.[index]?.quantity?.message}
                    {...register(`products.${index}.quantity`)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fields.length > 1 && remove(index)}
                  disabled={fields.length === 1}
                  className="mt-2.5 text-slate-400 hover:text-red-500 border-none bg-transparent cursor-pointer disabled:opacity-30"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {errors.products?.message && (
              <span className="text-xs text-red-500">{errors.products.message}</span>
            )}
          </div>

          <ModalInput
            label="Total (DZD)"
            type="number"
            placeholder="0"
            error={errors.total?.message}
            {...register("total")}
          />

          {errors.root?.message && (
            <p className="text-sm text-red-500 text-center">{errors.root.message}</p>
          )}

          <div className="flex gap-2.5 justify-end pt-1">
            <ModalButton onClick={handleClose}>Annuler</ModalButton>
            <ModalButton type="submit" bgColor="bg-orange-600" textColor="text-white" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer la commande"}
            </ModalButton>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AddOrderModal;