"use client";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Package } from "lucide-react";
import Menu from "@/components/general/Menu";
import Navbar from "@/components/general/Navbar";

const merchantLinks = [
  { href: "/marchand/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/marchand/orders", label: "Commandes", icon: Package },
];

export default function MerchantLayout({ children }) {
  return (
    <div className="h-screen flex bg-slate-100">
      <aside className="xl:w-[20%] lg:w-[260px] w-[80px] bg-slate-900 px-4 py-6 flex flex-col shadow-[4px_0_10px_rgba(0,0,0,0.05)] overflow-auto">
        <Link
          href="/marchand/dashboard"
          className="flex items-center gap-3 no-underline px-2 pb-6 border-b border-white/20"
        >
          <Image src="/logo.png" alt="Tawsil" width={42} height={40} className="rounded-md" />
          <span className="hidden lg:block text-white font-bold text-[19px] tracking-[-0.03em] uppercase">
            Tawsil
          </span>
        </Link>
        <Menu links={merchantLinks} />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}