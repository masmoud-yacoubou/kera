"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, useMemo, useEffect } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePWA } from "@/hooks/usePWA";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Constantes de navigation
// Ajouter un item ici suffit pour l'afficher
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  { href: "/dashboard",  label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/historique", label: "Historique",       icon: History         },
  { href: "/stats",      label: "Analyses",         icon: BarChart2       },
  { href: "/parametres", label: "Paramètres",       icon: Settings        },
];

// ─────────────────────────────────────────────
// Helpers pour useSyncExternalStore
// Évite les erreurs d'hydratation SSR/client
// ─────────────────────────────────────────────
const subscribe        = () => () => {};
const getSnapshot      = () => true;
const getServerSnapshot = () => false;

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// ─────────────────────────────────────────────
// Composant : item de navigation
// Extrait pour la lisibilité et la réutilisabilité
// ─────────────────────────────────────────────
function NavItem({
  href,
  label,
  icon: Icon,
  active,
  isOpen,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  isOpen: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        // Base — touch target minimum 44px (accessibilité)
        "relative flex items-center gap-3 px-4 py-3.5 rounded-2xl",
        "transition-all duration-200 group min-h-[44px]",
        active ? "text-[#F2E8D8]" : "text-[#9A8060] hover:text-[#F2E8D8]"
      )}
      style={active ? {
        background: "linear-gradient(135deg, #D4522A15 0%, #C8A05008 100%)",
        border: "1px solid #D4522A25",
      } : {}}
    >
      {/* Barre active gauche */}
      {active && (
        <div
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
          style={{ background: "linear-gradient(180deg, #D4522A, #C8A050)" }}
        />
      )}

      {/* Icône */}
      <Icon
        size={20}
        aria-hidden="true"
        className={cn(
          "shrink-0 transition-transform duration-200",
          active ? "text-[#D4522A] scale-110" : "group-hover:scale-110"
        )}
      />

      {/* Label — visible si sidebar ouverte */}
      {isOpen && (
        <span className="text-sm font-semibold tracking-wide truncate">
          {label}
        </span>
      )}

      {/* Tooltip — visible si sidebar fermée (desktop) */}
      {!isOpen && (
        <div
          role="tooltip"
          className={cn(
            "absolute left-14 z-50 px-3 py-1.5 rounded-xl",
            "text-xs font-semibold text-[#F2E8D8] whitespace-nowrap",
            "pointer-events-none opacity-0 group-hover:opacity-100",
            "transition-opacity duration-150"
          )}
          style={{
            background: "#251C14",
            border: "1px solid #3A2818",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {label}
        </div>
      )}
    </Link>
  );
}

// ─────────────────────────────────────────────
// Composant principal : Sidebar
// ─────────────────────────────────────────────
export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { signOut, getInitials } = useAuth();
  const { isInstallable, installApp } = usePWA();

  // Détection côté client (SSR-safe)
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Détection iOS mémorisée — ne change jamais après montage
  const isIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  }, []);

  // ── Fermeture automatique sur mobile au changement de route ──
  // Évite que la sidebar reste ouverte après navigation
  useEffect(() => {
    if (window.innerWidth < 1024 && isOpen) {
      onToggle();
    }
    // On veut seulement réagir au changement de pathname
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ── Blocage du scroll body quand sidebar ouverte sur mobile ──
  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* ── Overlay mobile ──────────────────────
          Fond semi-transparent cliquable pour fermer
          Visible uniquement sur mobile (lg:hidden)
      ─────────────────────────────────────────── */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* ── Sidebar ─────────────────────────────
          Mobile  : position fixe, glisse depuis la gauche
          Desktop : position sticky, largeur animée
      ─────────────────────────────────────────── */}
      <aside
        aria-label="Navigation principale"
        className={cn(
          // Desktop : sticky, largeur animée
          "hidden lg:flex lg:flex-col lg:h-screen lg:sticky lg:top-0 lg:shrink-0",
          "transition-[width] duration-200 ease-out",
          isOpen ? "lg:w-56" : "lg:w-16",
        )}
        style={{
          background: "linear-gradient(180deg, #1C1610 0%, #161008 100%)",
          borderRight: "1px solid #3A281820",
          boxShadow: "4px 0 24px rgba(0,0,0,0.3)",
          willChange: "width",
        }}
      >
        <SidebarContent
          isOpen={isOpen}
          onToggle={onToggle}
          pathname={pathname}
          signOut={signOut}
          getInitials={getInitials}
          isInstallable={isInstallable}
          installApp={installApp}
          isIOS={isIOS}
          isClient={isClient}
        />
      </aside>

      {/* ── Drawer mobile ───────────────────────
          Séparé du sidebar desktop pour éviter
          les conflits de classes responsive
      ─────────────────────────────────────────── */}
      <div
        aria-label="Menu mobile"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-72 lg:hidden",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          background: "linear-gradient(180deg, #1C1610 0%, #161008 100%)",
          boxShadow: "8px 0 32px rgba(0,0,0,0.5)",
        }}
      >
        <SidebarContent
          isOpen={true}
          onToggle={onToggle}
          pathname={pathname}
          signOut={signOut}
          getInitials={getInitials}
          isInstallable={isInstallable}
          installApp={installApp}
          isIOS={isIOS}
          isClient={isClient}
          isMobileDrawer
        />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Composant interne : contenu partagé
// Utilisé par le sidebar desktop ET le drawer mobile
// ─────────────────────────────────────────────
function SidebarContent({
  isOpen,
  onToggle,
  pathname,
  signOut,
  getInitials,
  isInstallable,
  installApp,
  isIOS,
  isClient,
  isMobileDrawer = false,
}: {
  isOpen: boolean;
  onToggle: () => void;
  pathname: string;
  signOut: () => void;
  getInitials: () => string;
  isInstallable: boolean;
  installApp: () => void;
  isIOS: boolean;
  isClient: boolean;
  isMobileDrawer?: boolean;
}) {
  return (
    <>
      {/* ── Header logo ───────────────────────── */}
      <div
        className="flex items-center gap-3 px-5 py-6 shrink-0"
        style={{ borderBottom: "1px solid #3A281820" }}
      >
        {/* Logo */}
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #D4522A 0%, #C04020 100%)",
            boxShadow: "0 4px 20px rgba(212,82,42,0.3)",
            transition: "transform 0.3s ease",
            transform: !isOpen && !isMobileDrawer ? "scale(0.9)" : "scale(1)",
          }}
        >
          <TrendingUp size={20} className="text-white" aria-hidden="true" />
        </div>

        {/* Nom de l'app */}
        {(isOpen || isMobileDrawer) && (
          <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
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

        {/* Bouton fermer — drawer mobile uniquement */}
        {isMobileDrawer && (
          <button
            onClick={onToggle}
            aria-label="Fermer le menu"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#9A8060] hover:text-[#F2E8D8] transition-colors ml-auto"
            style={{ background: "#3A281840" }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Navigation ────────────────────────── */}
      <nav
        aria-label="Menu de navigation"
        className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden"
      >
        {NAV_ITEMS.map(({ href, label, icon }) => (
          <NavItem
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={pathname === href}
            isOpen={isOpen || isMobileDrawer}
            onClick={isMobileDrawer ? onToggle : undefined}
          />
        ))}
      </nav>

      {/* ── Bannière PWA ──────────────────────── */}
      {(isOpen || isMobileDrawer) && isClient && (
        <div className="px-4 mb-4 shrink-0">
          {isInstallable ? (
            <div
              className="p-4 rounded-2xl animate-in zoom-in-95 duration-500"
              style={{
                background: "linear-gradient(135deg, #D4522A12, transparent)",
                border: "1px solid #D4522A20",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4522A] flex items-center justify-center">
                  <Smartphone size={16} className="text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#F2E8D8] leading-tight">Kera Mobile</p>
                  <p className="text-[9px] text-[#9A8060] uppercase tracking-tighter">Accès direct</p>
                </div>
              </div>
              <button
                onClick={installApp}
                className="w-full py-2.5 rounded-xl bg-[#D4522A] text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#C04020] transition-all active:scale-95 min-h-[44px]"
              >
                <Download size={12} aria-hidden="true" />
                Installer l&apos;app
              </button>
            </div>
          ) : isIOS ? (
            <div
              className="p-3 rounded-xl"
              style={{ background: "#3A281820", border: "1px solid #3A281830" }}
            >
              <p className="text-[9px] text-[#9A8060] text-center leading-relaxed italic">
                Sur iPhone : <span className="text-[#F2E8D8]">Partager</span> →{" "}
                &ldquo;Sur l&apos;écran d&apos;accueil&rdquo;
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* ── Footer compte + déconnexion ───────── */}
      <div
        className="p-4 space-y-2 shrink-0"
        style={{ borderTop: "1px solid #3A281820" }}
      >
        {/* Carte compte */}
        {(isOpen || isMobileDrawer) ? (
          <div
            className="flex items-center gap-3 px-3 py-3 rounded-2xl"
            style={{ background: "#0E0B0840", border: "1px solid #3A281820" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "#C8A05015", border: "1px solid #C8A05030" }}
            >
              <span className="text-xs font-bold text-[#C8A050]" aria-hidden="true">
                {getInitials()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-[#F2E8D8] truncate uppercase tracking-tighter">
                Espace Personnel
              </p>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-[#4A8A6A]"
                  aria-hidden="true"
                />
                <span className="text-[10px] text-[#9A8060]">Session active</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "#C8A05010", border: "1px solid #C8A05020" }}
            >
              <span className="text-xs font-bold text-[#C8A050]" aria-hidden="true">
                {getInitials()}
              </span>
            </div>
          </div>
        )}

        {/* Bouton déconnexion */}
        <button
          onClick={signOut}
          aria-label="Se déconnecter de Kera"
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[#9A8060] hover:text-[#D4522A] hover:bg-[#D4522A08] transition-all group min-h-[44px]"
        >
          <LogOut
            size={20}
            aria-hidden="true"
            className="shrink-0 transition-transform group-hover:-translate-x-1"
          />
          {(isOpen || isMobileDrawer) && (
            <span className="text-sm font-bold tracking-tight">Quitter Kera</span>
          )}
        </button>
      </div>

      {/* ── Bouton toggle desktop ─────────────────
          Flottant sur le bord droit — desktop seulement
      ─────────────────────────────────────────── */}
      {!isMobileDrawer && (
        <button
          onClick={onToggle}
          aria-label={isOpen ? "Réduire le menu" : "Agrandir le menu"}
          className="absolute -right-3 top-24 w-6 h-6 rounded-full flex items-center justify-center bg-[#D4522A] text-white border-2 border-[#161008] hover:scale-110 transition-transform shadow-lg z-50"
        >
          {isOpen
            ? <ChevronLeft size={12} strokeWidth={3} aria-hidden="true" />
            : <ChevronRight size={12} strokeWidth={3} aria-hidden="true" />
          }
        </button>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// Composant exporté : bouton hamburger mobile
// À placer dans le Header pour ouvrir le drawer
// ─────────────────────────────────────────────
export function MobileMenuButton({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={isOpen}
      className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[#9A8060] hover:text-[#F2E8D8] transition-colors min-h-[44px]"
      style={{ background: "#251C14", border: "1px solid #3A2818" }}
    >
      {isOpen
        ? <X size={18} aria-hidden="true" />
        : <Menu size={18} aria-hidden="true" />
      }
    </button>
  );
}