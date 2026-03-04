"use client";

import { useAuth } from "@/hooks/useAuth";
import { Target, Calendar } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
}

export default function Header({ sidebarOpen }: HeaderProps) {
  const { user, getInitials } = useAuth();

  const displayName = user?.email?.split("@")[0] ?? "Pilote";
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  // Correction de la logique de salutation
  const hour = new Date().getHours();
  let greeting = "Bonjour";
  if (hour >= 18 || hour < 5) greeting = "Bonsoir";

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <header
      className="h-20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30"
      style={{
        background: "rgba(14, 11, 8, 0.9)", 
        borderBottom: "1px solid #3A281830",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Gauche : Identité & Date */}
      <div className="flex items-center gap-3 md:gap-5">
        <div className="hidden sm:flex w-10 h-10 rounded-2xl items-center justify-center bg-[#C8A05008] border border-[#C8A05020]">
          <Target size={18} className="text-[#C8A050]" />
        </div>
        <div>
          <h2
            className="text-sm md:text-base font-semibold text-[#F2E8D8] flex items-center gap-2"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            <span className="opacity-70 font-medium">{greeting},</span>
            <span
              className="font-bold tracking-tight"
              style={{
                background: "linear-gradient(90deg, #D4522A, #C8A050)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {formattedName}
            </span>
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5 opacity-50">
            <Calendar size={10} className="text-[#9A8060]" />
            <p className="text-[9px] font-bold text-[#9A8060] uppercase tracking-widest truncate">
              {today}
            </p>
          </div>
        </div>
      </div>

      {/* Droite : Profil sans mention premium/vérifié */}
      <div className="flex items-center">
        <div
          className="flex items-center gap-3 pl-1 pr-1 md:pr-4 py-1 rounded-2xl border transition-all duration-300"
          style={{ 
            background: "#1A1410", 
            borderColor: "#3A281860" 
          }}
        >
          <div
            className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #C8A05020, #C8A05005)",
              border: "1px solid #C8A05030",
            }}
          >
            <span className="text-[10px] md:text-[11px] font-black text-[#C8A050]">
              {getInitials()}
            </span>
          </div>
          
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold text-[#F2E8D8] uppercase tracking-tighter">
              {formattedName}
            </p>
            <p className="text-[8px] text-[#9A8060] font-black tracking-widest uppercase opacity-80">
              Espace Personnel
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}