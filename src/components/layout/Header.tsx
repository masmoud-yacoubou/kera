"use client";

import { useAuth } from "@/hooks/useAuth";
import { Target, Calendar } from "lucide-react";
import { MobileMenuButton } from "@/components/layout/Sidebar";

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface HeaderProps {
  sidebarOpen: boolean;
  onMenuToggle: () => void;
}

export default function Header({ sidebarOpen, onMenuToggle }: HeaderProps) {
  const { user, getInitials } = useAuth();

  // ── Nom d'affichage ──────────────────────────
  const displayName = user?.email?.split("@")[0] ?? "Pilote";
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  // ── Salutation contextuelle ──────────────────
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
        // Fond semi-transparent avec variable de thème
        background: "color-mix(in srgb, var(--fond) 92%, transparent)",
        borderBottom: "1px solid var(--bordure-30)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* ── Gauche : hamburger + identité ─────── */}
      <div className="flex items-center gap-3">

        {/* Hamburger mobile */}
        <MobileMenuButton onClick={onMenuToggle} isOpen={sidebarOpen} />

        {/* Icône décorative — desktop uniquement */}
        <div
          className="hidden sm:flex w-10 h-10 rounded-2xl items-center justify-center shrink-0"
          style={{
            background: "var(--or-08)",
            border: "1px solid var(--or-20)",
          }}
          aria-hidden="true"
        >
          <Target size={18} style={{ color: "var(--or)" }} />
        </div>

        {/* Salutation + date */}
        <div>
          <h2
            className="text-sm md:text-base font-semibold flex items-center gap-1.5 flex-wrap"
            style={{
              color: "var(--texte)",
              fontFamily: "var(--font-sora)",
            }}
          >
            <span style={{ opacity: 0.7, fontWeight: 500 }}>{greeting},</span>

            {/* Gradient prénom — accent → or */}
            <span
              className="font-bold tracking-tight"
              style={{
                background: "linear-gradient(90deg, var(--accent), var(--or))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {formattedName}
            </span>
          </h2>

          {/* Date */}
          <div className="hidden xs:flex items-center gap-1.5 mt-0.5" style={{ opacity: 0.5 }}>
            <Calendar size={10} style={{ color: "var(--muted)" }} aria-hidden="true" />
            <time
              className="text-[9px] font-bold uppercase tracking-widest"
              style={{ color: "var(--muted)" }}
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
          background: "var(--surface)",
          borderColor: "var(--bordure-60)",
        }}
      >
        {/* Avatar */}
        <div
          className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center shrink-0"
          aria-label={`Avatar de ${formattedName}`}
          style={{
            background: "linear-gradient(135deg, var(--or-20), var(--or-08))",
            border: "1px solid var(--or-30)",
          }}
        >
          <span
            className="text-[10px] md:text-[11px] font-black"
            style={{ color: "var(--or)" }}
          >
            {getInitials()}
          </span>
        </div>

        {/* Nom + label — desktop uniquement */}
        <div className="hidden sm:block">
          <p
            className="text-[10px] font-bold uppercase tracking-tighter leading-tight"
            style={{ color: "var(--texte)" }}
          >
            {formattedName}
          </p>
          <p
            className="text-[8px] font-black tracking-widest uppercase opacity-80"
            style={{ color: "var(--muted)" }}
          >
            Espace Personnel
          </p>
        </div>
      </div>
    </header>
  );
}