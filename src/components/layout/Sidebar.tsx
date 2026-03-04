"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, useMemo } from "react";
import {
  LayoutDashboard,
  History,
  BarChart2,
  Settings,
  LogOut,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Download,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePWA } from "@/hooks/usePWA";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/historique", label: "Historique", icon: History },
  { href: "/stats", label: "Analyses", icon: BarChart2 },
  { href: "/parametres", label: "Paramètres", icon: Settings },
];

// Fonctions pour useSyncExternalStore (évite les erreurs d'hydratation)
const subscribe = () => () => {}; // Pas d'écoute d'événement nécessaire ici
const getSnapshot = () => true;   // Côté client
const getServerSnapshot = () => false; // Côté serveur

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { signOut, getInitials } = useAuth();
  const { isInstallable, installApp } = usePWA();
  
  // Cette méthode remplace useEffect + setState. 
  // Elle est synchrone et sans danger pour le linter.
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Détection mémorisée
  const isIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  }, []);

  const sidebarBg = "linear-gradient(180deg, #1C1610 0%, #161008 100%)";

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col transition-all duration-500 ease-in-out shrink-0 z-40",
        isOpen ? "w-64" : "w-20"
      )}
      style={{
        background: sidebarBg,
        borderRight: "1px solid #3A281830",
        boxShadow: "4px 0 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Logo Section */}
      <div
        className="flex items-center gap-3 px-5 py-6"
        style={{ borderBottom: "1px solid #3A281820" }}
      >
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500"
          style={{
            background: "linear-gradient(135deg, #D4522A 0%, #C04020 100%)",
            boxShadow: "0 4px 20px rgba(212,82,42,0.3)",
            transform: !isOpen ? "scale(0.9)" : "scale(1)",
          }}
        >
          <TrendingUp size={20} className="text-white" />
        </div>

        {isOpen && (
          <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
            <span
              className="text-xl font-bold text-[#F2E8D8] tracking-tight block"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Kera
            </span>
            <p className="text-[10px] text-[#9A8060] tracking-[0.2em] uppercase font-bold opacity-70">
              Finance
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-8 px-3 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                active ? "text-[#F2E8D8]" : "text-[#9A8060] hover:text-[#F2E8D8]"
              )}
              style={active ? {
                background: "linear-gradient(135deg, #D4522A15 0%, #C8A05008 100%)",
                border: "1px solid #D4522A25",
              } : {}}
            >
              {active && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                  style={{ background: "linear-gradient(180deg, #D4522A, #C8A050)" }}
                />
              )}
              <Icon
                size={20}
                className={cn(
                  "shrink-0 transition-all duration-300",
                  active ? "text-[#D4522A] scale-110" : "group-hover:scale-110"
                )}
              />
              {isOpen && <span className="text-sm font-semibold tracking-wide">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Section Installation Mobile (PWA) */}
      {isOpen && isClient && (
        <div className="px-4 mb-4">
          {isInstallable ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D4522A15] to-transparent border border-[#D4522A20] animate-in zoom-in-95 duration-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4522A] flex items-center justify-center shadow-lg shadow-[#D4522A]/20">
                  <Smartphone size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#F2E8D8] leading-tight">Kera Mobile</p>
                  <p className="text-[9px] text-[#9A8060] uppercase tracking-tighter">Accès direct</p>
                </div>
              </div>
              <button
                onClick={installApp}
                className="w-full py-2 rounded-xl bg-[#D4522A] text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#C04020] transition-all active:scale-95"
              >
                <Download size={12} />
                Installer l&apos;app
              </button>
            </div>
          ) : isIOS ? (
            <div className="p-3 rounded-xl bg-[#3A281820] border border-[#3A281830]">
              <p className="text-[9px] text-[#9A8060] text-center leading-relaxed italic">
                Sur iPhone : cliquez sur <span className="text-[#F2E8D8]">Partager</span> puis {` "Sur l'écran d'accueil" `} pour installer l&apos;app
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Toggle & Account Footer */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-24 w-6 h-6 rounded-full flex items-center justify-center bg-[#D4522A] text-white border-2 border-[#161008] hover:scale-110 transition-transform shadow-lg z-50"
      >
        {isOpen ? <ChevronLeft size={12} strokeWidth={3} /> : <ChevronRight size={12} strokeWidth={3} />}
      </button>

      <div className="p-4 space-y-3" style={{ borderTop: "1px solid #3A281820" }}>
        {isOpen ? (
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-[#0E0B08]/40 border border-[#3A281820]">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#C8A05015] border border-[#C8A05030]">
              <span className="text-xs font-bold text-[#C8A050]">{getInitials()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-[#F2E8D8] truncate uppercase tracking-tighter">Espace Personnel</p>
              <div className="flex items-center gap-1.5 text-[10px] text-[#9A8060]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4A8A6A] animate-pulse" />
                <span>Session active</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#C8A05010] border border-[#C8A05020]">
              <span className="text-xs font-bold text-[#C8A050]">{getInitials()}</span>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#9A8060] hover:text-[#D4522A] hover:bg-[#D4522A08] transition-all group"
        >
          <LogOut size={20} className="shrink-0 transition-transform group-hover:-translate-x-1" />
          {isOpen && <span className="text-sm font-bold tracking-tight">Quitter Kera</span>}
        </button>
      </div>
    </aside>
  );
} 