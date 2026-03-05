"use client";

import { useAuth } from "@/hooks/useAuth";
import { Target, Calendar } from "lucide-react";
import { MobileMenuButton } from "@/components/layout/Sidebar";

// ─────────────────────────────────────────────
// Props
// onMenuToggle et sidebarOpen sont nécessaires
// pour contrôler le drawer mobile depuis le header
// ─────────────────────────────────────────────
interface HeaderProps {
  sidebarOpen: boolean;
  onMenuToggle: () => void;
}

export default function Header({ sidebarOpen, onMenuToggle }: HeaderProps) {
  const { user, getInitials } = useAuth();

  // ── Nom d'affichage ──────────────────────────
  // Extrait la partie locale de l'email et capitalise
  const displayName = user?.email?.split("@")[0] ?? "Pilote";
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  // ── Salutation contextuelle ──────────────────
  // Bonsoir à partir de 18h ou avant 5h du matin
  const hour = new Date().getHours();
  const greeting = (hour >= 18 || hour < 5) ? "Bonsoir" : "Bonjour";

  // ── Date formatée ────────────────────────────
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <header
      className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30"
      style={{
        background: "rgba(14, 11, 8, 0.92)",
        borderBottom: "1px solid #3A281830",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* ── Gauche : hamburger mobile + identité ── */}
      <div className="flex items-center gap-3">

        {/* Bouton hamburger — mobile uniquement (lg:hidden géré dans le composant) */}
        <MobileMenuButton onClick={onMenuToggle} isOpen={sidebarOpen} />

        {/* Icône décorative — cachée sur mobile pour économiser l'espace */}
        <div
          className="hidden sm:flex w-10 h-10 rounded-2xl items-center justify-center shrink-0"
          style={{ background: "#C8A05008", border: "1px solid #C8A05020" }}
          aria-hidden="true"
        >
          <Target size={18} className="text-[#C8A050]" />
        </div>

        {/* Salutation + date */}
        <div>
          <h2
            className="text-sm md:text-base font-semibold text-[#F2E8D8] flex items-center gap-1.5 flex-wrap"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            <span className="opacity-70 font-medium">{greeting},</span>
            {/* Gradient sur le prénom — dégradé terre cuite → or */}
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

          {/* Date — cachée sur très petits écrans */}
          <div className="hidden xs:flex items-center gap-1.5 mt-0.5 opacity-50">
            <Calendar size={10} className="text-[#9A8060]" aria-hidden="true" />
            <time
              className="text-[9px] font-bold text-[#9A8060] uppercase tracking-widest"
              dateTime={new Date().toISOString().split("T")[0]}
            >
              {today}
            </time>
          </div>
        </div>
      </div>

      {/* ── Droite : carte profil ─────────────── */}
      <div
        className="flex items-center gap-2 pl-2 pr-2 md:pr-4 py-1.5 rounded-2xl border transition-colors duration-300"
        style={{
          background: "#1A1410",
          borderColor: "#3A281860",
        }}
      >
        {/* Avatar initiales */}
        <div
          className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center shrink-0"
          aria-label={`Avatar de ${formattedName}`}
          style={{
            background: "linear-gradient(135deg, #C8A05020, #C8A05005)",
            border: "1px solid #C8A05030",
          }}
        >
          <span className="text-[10px] md:text-[11px] font-black text-[#C8A050]">
            {getInitials()}
          </span>
        </div>

        {/* Nom + label — caché sur mobile */}
        <div className="hidden sm:block">
          <p className="text-[10px] font-bold text-[#F2E8D8] uppercase tracking-tighter leading-tight">
            {formattedName}
          </p>
          <p className="text-[8px] text-[#9A8060] font-black tracking-widest uppercase opacity-80">
            Espace Personnel
          </p>
        </div>
      </div>
    </header>
  );
}