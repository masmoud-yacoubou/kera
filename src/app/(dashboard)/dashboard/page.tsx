"use client";

import { useState } from "react";
import { useTransactions } from "@/context/TransactionsContext";
import { usePreferences } from "@/hooks/usePreferences";
import { TransactionInsert } from "@/types";
import BalanceCard from "@/components/dashboard/BalanceCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import PieChartWidget from "@/components/dashboard/PieChartWidget";
import BarChartWidget from "@/components/dashboard/BarChartWidget";
import TransactionModal from "@/components/transactions/TransactionModal";
import FAB from "@/components/ui/FAB";
import { Sparkles, LayoutDashboard, Settings, X } from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────
// Clé localStorage du banner paramètres
// Changer la version force le banner à réapparaître
// ─────────────────────────────────────────────
const SETTINGS_BANNER_KEY = "kera_settings_banner_v1";

// ─────────────────────────────────────────────
// Sous-composant : Banner paramètres
// Affiché une seule fois, fermé définitivement
// ─────────────────────────────────────────────
function SettingsBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="relative flex items-center gap-4 px-5 py-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500"
      style={{
        background: "linear-gradient(135deg, var(--or-15) 0%, var(--accent-10) 100%)",
        border: "1px solid var(--or-30)",
      }}
      role="status"
      aria-live="polite"
    >
      {/* Icône */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: "var(--or-20)",
          border: "1px solid var(--or-30)",
        }}
        aria-hidden="true"
      >
        <Settings size={16} style={{ color: "var(--or)" }} />
      </div>

      {/* Texte */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold" style={{ color: "var(--texte)" }}>
          Personnalisez votre expérience
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
          Choisissez votre devise et vos préférences dans{" "}
          <Link
            href="/parametres"
            className="underline underline-offset-2 transition-colors font-semibold"
            style={{ color: "var(--or)" }}
          >
            Paramètres
          </Link>
        </p>
      </div>

      {/* Bouton fermer */}
      <button
        onClick={onDismiss}
        aria-label="Fermer la notification"
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 min-h-[44px] min-w-[44px]"
        style={{
          background: "var(--bordure-40)",
          color: "var(--muted)",
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--texte)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
      >
        <X size={13} aria-hidden="true" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page principale : Dashboard
// ─────────────────────────────────────────────
export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);

  // ── Banner — initialisé une seule fois côté client ──
  const [showSettingsBanner, setShowSettingsBanner] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(SETTINGS_BANNER_KEY);
  });

  const {
    transactions,
    loading,
    balance,
    totalIncome,
    totalExpenses,
    addTransaction,
    deleteTransaction,
  } = useTransactions();

  const { formatAmount } = usePreferences();

  const dismissSettingsBanner = () => {
    localStorage.setItem(SETTINGS_BANNER_KEY, "true");
    setShowSettingsBanner(false);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-6 md:space-y-8 pb-32 pt-4">

        {/* ── Banner paramètres ──────────────────── */}
        {showSettingsBanner && (
          <SettingsBanner onDismiss={dismissSettingsBanner} />
        )}

        {/* ── En-tête de section ─────────────────── */}
        {!loading && transactions.length > 0 && (
          <div className="flex items-center gap-2.5 px-1 animate-in fade-in slide-in-from-left duration-700">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{
                background: "var(--or-10)",
                border: "1px solid var(--or-20)",
              }}
              aria-hidden="true"
            >
              <Sparkles size={12} style={{ color: "var(--or)" }} />
            </div>
            <p
              className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-80"
              style={{ color: "var(--muted)" }}
            >
              Analyse de performance financière
            </p>
          </div>
        )}

        {/* ── Carte de solde ─────────────────────── */}
        <section className="relative group">
          {/* Halo de glow — réagit au hover */}
          <div
            className="absolute -inset-1 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000 pointer-events-none"
            style={{
              background: "linear-gradient(to right, var(--accent-10), var(--or-10))",
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <BalanceCard
              balance={balance}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              formatAmount={formatAmount}
              loading={loading}
            />
          </div>
        </section>

        {/* ── Grille principale ──────────────────── */}
        {!loading && transactions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

            {/* Graphiques — priorité visuelle sur mobile */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                <div className="transition-transform hover:-translate-y-1 duration-300">
                  <PieChartWidget
                    transactions={transactions}
                    formatAmount={formatAmount}
                  />
                </div>
                <div className="transition-transform hover:-translate-y-1 duration-300">
                  <BarChartWidget
                    transactions={transactions}
                    formatAmount={formatAmount}
                  />
                </div>
              </div>
            </div>

            {/* Transactions récentes */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <RecentTransactions
                transactions={transactions.slice(0, 10)}
                formatAmount={formatAmount}
                loading={loading}
                onDelete={deleteTransaction}
                onEdit={() => {}}
              />
            </div>
          </div>
        )}

        {/* ── Skeleton loading ───────────────────── */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div
              className="lg:col-span-7 h-64 rounded-3xl animate-pulse"
              style={{ background: "var(--carte)" }}
            />
            <div className="lg:col-span-5 space-y-6">
              <div
                className="h-48 rounded-3xl animate-pulse"
                style={{ background: "var(--carte)" }}
              />
              <div
                className="h-48 rounded-3xl animate-pulse"
                style={{ background: "var(--carte)" }}
              />
            </div>
          </div>
        )}

        {/* ── Empty state ────────────────────────── */}
        {!loading && transactions.length === 0 && (
          <div
            className="rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, var(--carte), var(--surface))",
              border: "1px solid var(--bordure-30)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            {/* Icône */}
            <div
              className="w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--bordure)",
              }}
              aria-hidden="true"
            >
              <LayoutDashboard
                size={32}
                style={{ color: "var(--or)", opacity: 0.4 }}
              />
            </div>

            <h2
              className="text-2xl md:text-3xl font-black mb-4 tracking-tight"
              style={{
                color: "var(--texte)",
                fontFamily: "var(--font-sora)",
              }}
            >
              Prêt à piloter ?
            </h2>
            <p
              className="text-sm md:text-base max-w-sm mx-auto leading-relaxed font-medium"
              style={{ color: "var(--muted)" }}
            >
              Votre cockpit financier est configuré. Il ne manque plus que vos
              premières données pour générer vos analyses.
            </p>

            <button
              onClick={() => setModalOpen(true)}
              className="mt-10 px-10 py-4 rounded-2xl text-white text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 min-h-[48px]"
              style={{
                background: "var(--accent)",
                boxShadow: "0 20px 40px var(--accent-20)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              Lancer ma première saisie
            </button>
          </div>
        )}
      </div>

      {/* FAB — toujours visible */}
      <FAB onClick={() => setModalOpen(true)} />

      {/* Modal de transaction */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={async (data: TransactionInsert) => {
          await addTransaction(data);
          setModalOpen(false);
        }}
      />
    </>
  );
}