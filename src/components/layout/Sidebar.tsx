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
const subscribe         = () => () => {};
const getSnapshot       = () => true;
const getServerSnapshot = () => false;

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// ─────────────────────────────────────────────
// Composant : item de navigation
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
        "relative flex items-center gap-3 px-4 py-3.5 rounded-2xl",
        "transition-all duration-200 group min-h-[44px]",
      )}
      style={{
        color: active ? "var(--texte)" : "var(--muted)",
        ...(active ? {
          background: "linear-gradient(135deg, var(--accent-15) 0%, var(--or-08) 100%)",
          border: "1px solid var(--accent-20)",
        } : {}),
      }}
    >
      {/* Barre active gauche */}
      {active && (
        <div
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
          style={{ background: "linear-gradient(180deg, var(--accent), var(--or))" }}
        />
      )}

      {/* Icône */}
      <Icon
        size={20}
        aria-hidden="true"
        className={cn(
          "shrink-0 transition-transform duration-200",
          active ? "scale-110" : "group-hover:scale-110"
        )}
        style={{ color: active ? "var(--accent)" : undefined }}
      />

      {/* Label */}
      {isOpen && (
        <span className="text-sm font-semibold tracking-wide truncate">
          {label}
        </span>
      )}

      {/* Tooltip sidebar fermée */}
      {!isOpen && (
        <div
          role="tooltip"
          className="absolute left-14 z-50 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{
            background: "var(--carte)",
            border: "1px solid var(--bordure)",
            color: "var(--texte)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
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

  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  }, []);

  // Fermeture auto sur mobile au changement de route
  useEffect(() => {
    if (window.innerWidth < 1024 && isOpen) onToggle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Blocage du scroll body sur mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar desktop — sticky, largeur animée */}
      <aside
        aria-label="Navigation principale"
        className={cn(
          "hidden lg:flex lg:flex-col lg:h-screen lg:sticky lg:top-0 lg:shrink-0",
          "transition-[width] duration-200 ease-out",
          isOpen ? "lg:w-56" : "lg:w-16",
        )}
        style={{
          background: "linear-gradient(180deg, var(--carte) 0%, var(--carte-2) 100%)",
          borderRight: "1px solid var(--bordure-20)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
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

      {/* Drawer mobile */}
      <div
        aria-label="Menu mobile"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-72 lg:hidden",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          background: "linear-gradient(180deg, var(--carte) 0%, var(--carte-2) 100%)",
          boxShadow: "8px 0 32px rgba(0,0,0,0.3)",
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
// Utilisé par sidebar desktop ET drawer mobile
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
        style={{ borderBottom: "1px solid var(--bordure-20)" }}
      >
        {/* Logo — gradient accent toujours fixe */}
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, var(--accent) 0%, #C04020 100%)",
            boxShadow: "0 4px 20px var(--accent-20)",
            transition: "transform 0.3s ease",
            transform: !isOpen && !isMobileDrawer ? "scale(0.9)" : "scale(1)",
          }}
        >
          <TrendingUp size={20} className="text-white" aria-hidden="true" />
        </div>

        {/* Nom */}
        {(isOpen || isMobileDrawer) && (
          <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
            <span
              className="text-xl font-bold tracking-tight block"
              style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
            >
              Kera
            </span>
            <p
              className="text-[10px] tracking-[0.2em] uppercase font-bold opacity-70"
              style={{ color: "var(--muted)" }}
            >
              Finance
            </p>
          </div>
        )}

        {/* Bouton fermer — mobile uniquement */}
        {isMobileDrawer && (
          <button
            onClick={onToggle}
            aria-label="Fermer le menu"
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors ml-auto"
            style={{
              background: "var(--bordure-40)",
              color: "var(--muted)",
            }}
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
                background: "linear-gradient(135deg, var(--accent-10), transparent)",
                border: "1px solid var(--accent-20)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--accent)" }}
                >
                  <Smartphone size={16} className="text-white" aria-hidden="true" />
                </div>
                <div>
                  <p
                    className="text-[11px] font-bold leading-tight"
                    style={{ color: "var(--texte)" }}
                  >
                    Kera Mobile
                  </p>
                  <p
                    className="text-[9px] uppercase tracking-tighter"
                    style={{ color: "var(--muted)" }}
                  >
                    Accès direct
                  </p>
                </div>
              </div>
              <button
                onClick={installApp}
                className="w-full py-2.5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 min-h-[44px]"
                style={{ background: "var(--accent)" }}
              >
                <Download size={12} aria-hidden="true" />
                Installer l&apos;app
              </button>
            </div>
          ) : isIOS ? (
            <div
              className="p-3 rounded-xl"
              style={{
                background: "var(--bordure-20)",
                border: "1px solid var(--bordure-30)",
              }}
            >
              <p
                className="text-[9px] text-center leading-relaxed italic"
                style={{ color: "var(--muted)" }}
              >
                Sur iPhone : <span style={{ color: "var(--texte)" }}>Partager</span> →{" "}
                &ldquo;Sur l&apos;écran d&apos;accueil&rdquo;
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* ── Footer compte + déconnexion ───────── */}
      <div
        className="p-4 space-y-2 shrink-0"
        style={{ borderTop: "1px solid var(--bordure-20)" }}
      >
        {/* Carte compte */}
        {(isOpen || isMobileDrawer) ? (
          <div
            className="flex items-center gap-3 px-3 py-3 rounded-2xl"
            style={{
              background: "var(--fond-40)",
              border: "1px solid var(--bordure-20)",
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "var(--or-15)",
                border: "1px solid var(--or-30)",
              }}
            >
              <span
                className="text-xs font-bold"
                style={{ color: "var(--or)" }}
                aria-hidden="true"
              >
                {getInitials()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[11px] font-bold truncate uppercase tracking-tighter"
                style={{ color: "var(--texte)" }}
              >
                Espace Personnel
              </p>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--succes)" }}
                  aria-hidden="true"
                />
                <span
                  className="text-[10px]"
                  style={{ color: "var(--muted)" }}
                >
                  Session active
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: "var(--or-10)",
                border: "1px solid var(--or-20)",
              }}
            >
              <span
                className="text-xs font-bold"
                style={{ color: "var(--or)" }}
                aria-hidden="true"
              >
                {getInitials()}
              </span>
            </div>
          </div>
        )}

        {/* Déconnexion */}
        <button
          onClick={signOut}
          aria-label="Se déconnecter de Kera"
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group min-h-[44px]"
          style={{ color: "var(--muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--accent)";
            e.currentTarget.style.background = "var(--accent-10)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--muted)";
            e.currentTarget.style.background = "transparent";
          }}
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

      {/* ── Bouton toggle desktop ─────────────── */}
      {!isMobileDrawer && (
        <button
          onClick={onToggle}
          aria-label={isOpen ? "Réduire le menu" : "Agrandir le menu"}
          className="absolute -right-3 top-24 w-6 h-6 rounded-full flex items-center justify-center text-white border-2 hover:scale-110 transition-transform shadow-lg z-50"
          style={{
            background: "var(--accent)",
            borderColor: "var(--carte-2)",
          }}
        >
          {isOpen
            ? <ChevronLeft  size={12} strokeWidth={3} aria-hidden="true" />
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
      className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors min-h-[44px]"
      style={{
        background: "var(--carte)",
        border: "1px solid var(--bordure)",
        color: "var(--muted)",
      }}
    >
      {isOpen
        ? <X    size={18} aria-hidden="true" />
        : <Menu size={18} aria-hidden="true" />
      }
    </button>
  );
}