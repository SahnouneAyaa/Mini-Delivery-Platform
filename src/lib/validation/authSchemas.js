import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email invalide").min(1, "L'email est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const registerSchema = z
  .object({
    username: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.email("Email invalide").min(1, "L'email est requis"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
    role: z.any().refine((val) => val === "merchant" || val === "driver", {
      message: "Veuillez sélectionner un rôle",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });