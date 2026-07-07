import Link from "next/link";
import { MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FA] px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-6">
        <MapPinOff size={28} className="text-orange-600" />
      </div>
      <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
      <p className="text-lg font-medium text-slate-700 mb-2">
        Cette page n'existe pas
      </p>
      <p className="text-sm text-slate-500 max-w-sm mb-8">
        La page que vous cherchez a été déplacée ou n'existe pas.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-orange-600 text-white font-medium px-6 py-2.5 hover:bg-orange-700 transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}