"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import ModalInput from "@/components/forms/ModalInput";
import { loginSchema, registerSchema } from "@/lib/validation/authSchemas";

const dashboardPath = (role) =>
  role === "merchant" ? "/marchand/dashboard" : "/driver/dashboard";

function RightSide() {
  const [mode, setMode] = useState("login");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isLogin = mode === "login";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const switchMode = () => {
    setServerError("");
    reset();
    setMode(isLogin ? "register" : "login");
  };

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    if (isLogin) {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setLoading(false);
        setServerError("Email ou mot de passe incorrect");
        return;
      }

      const session = await getSession();
      setLoading(false);
      router.push(dashboardPath(session?.user?.role));
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = await res.json();

      if (!res.ok) {
        setServerError(body.error || "Une erreur est survenue");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setLoading(false);
        setServerError("Compte créé, veuillez vous connecter");
        setMode("login");
        return;
      }

      setLoading(false);
      router.push(dashboardPath(data.role));
    } catch (err) {
      setServerError("Une erreur est survenue");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-[#F7F8FA]">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          {isLogin ? "Connexion" : "Créer un compte"}
        </h2>
        <p className="text-sm text-slate-500 mb-8">
          {isLogin
            ? "Connectez-vous pour accéder à votre espace"
            : "Remplissez les informations ci-dessous"}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {!isLogin && (
            <ModalInput
              label="Nom d'utilisateur"
              placeholder="Votre nom"
              icon={User}
              error={errors.username?.message}
              {...register("username")}
            />
          )}

          <ModalInput
            label="Email"
            type="email"
            placeholder="exemple@email.com"
            icon={Mail}
            error={errors.email?.message}
            {...register("email")}
          />

          <ModalInput
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.password?.message}
            {...register("password")}
          />

          {!isLogin && (
            <>
              <ModalInput
                label="Confirmer le mot de passe"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Vous êtes</label>
                <div className="flex gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 cursor-pointer has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50">
                    <input type="radio" value="merchant" className="hidden" {...register("role")} />
                    <span className="text-sm text-slate-700">Commerçant</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 cursor-pointer has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50">
                    <input type="radio" value="driver" className="hidden" {...register("role")} />
                    <span className="text-sm text-slate-700">Livreur</span>
                  </label>
                </div>
                {errors.role && (
                  <span className="text-xs text-red-500">{errors.role.message}</span>
                )}
              </div>
            </>
          )}

          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-orange-600 text-white font-medium py-2.5 hover:bg-orange-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-6">
          {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}{" "}
          <button onClick={switchMode} className="text-orange-600 font-medium hover:underline">
            {isLogin ? "S'inscrire" : "Se connecter"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default RightSide;