import { z } from "zod";

export const orderSchema = z.object({
  customerName: z.string().min(2, "Le nom du client doit contenir au moins 2 caractères"),
  deliveryAddress: z
    .string()
    .min(1, "L'adresse de livraison est requise")
    .min(10, "L'adresse doit contenir au moins 10 caractères"),
  products: z
    .array(
      z.object({
        name: z.string().min(1, "Le nom du produit est requis"),
        quantity: z.coerce
          .number({ invalid_type_error: "Quantité invalide" })
          .min(1, "La quantité doit être au moins 1"),
      })
    )
    .min(1, "Ajoutez au moins un produit"),
  total: z.coerce.number({ invalid_type_error: "Total invalide" }).min(0, "Le total ne peut pas être négatif"),
});