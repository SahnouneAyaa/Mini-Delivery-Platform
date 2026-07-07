"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import StatCard from "@/components/signIn/StatCard";
import FloatingBubble from "@/components/signIn/FloatingBubble";
import { Package, Truck, MapPin, Clock, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function LeftSide() {
  const [featureIndex, setFeatureIndex] = useState(0);

  const features = [
    { label: "Commandes livrées", icon: Package, count: "+3 200" },
    { label: "Livreurs actifs", icon: Truck, count: "120" },
    { label: "Commerçants partenaires", icon: Store, count: "85" },
  ];

  const stats = [
    { icon: Package, label: "Commandes", value: "3 200", color: "bg-orange-500", delay: 0.5 },
    { icon: Truck, label: "Livreurs", value: "120", color: "bg-slate-700", delay: 0.65 },
    { icon: Clock, label: "Temps moyen", value: "28 min", color: "bg-orange-600", delay: 0.8 },
    { icon: MapPin, label: "Zones couvertes", value: "14", color: "bg-slate-800", delay: 0.95 },
  ];

  useEffect(() => {
    const id = setInterval(
      () => setFeatureIndex((i) => (i + 1) % features.length),
      2800
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-center p-10"
      style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 45%, #EA580C 100%)",
      }}
    >
      <FloatingBubble icon={Package} style={{ top: "22%", right: "10%" }} delay={0.5} />
      <FloatingBubble icon={Truck} style={{ bottom: "28%", left: "6%" }} delay={1} />
      <FloatingBubble icon={MapPin} style={{ bottom: "18%", right: "8%" }} delay={1.5} />

      <div className="relative z-10 flex flex-col items-center gap-12">
        <div className="flex flex-col items-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/logo.png"
              alt="Tawsil"
              width={80}
              height={80}
              className="w-28 h-24 rounded-3xl backdrop-blur mb-6 shadow-2xl object-contain"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-3xl font-bold text-white leading-tight mb-3"
          >
            Livrez plus vite, suivez en temps réel
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-white/80 text-md leading-relaxed max-w-xs"
          >
            La plateforme qui connecte commerçants et livreurs, du dépôt à la livraison.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 relative h-10 w-64"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={featureIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4"
              >
                {(() => {
                  const F = features[featureIndex];
                  return (
                    <>
                      <F.icon size={13} className="text-white/80" />
                      <span className="text-white/90 text-sm font-medium">
                        {F.label} — {F.count}
                      </span>
                    </>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-md px-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LeftSide;