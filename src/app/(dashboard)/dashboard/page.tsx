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
// Constante : clé localStorage pour le banner
// Modifier cette clé forcera le banner à réapparaître
// pour tous les utilisateurs (utile après une mise à jour)
// ─────────────────────────────────────────────
const SETTINGS_BANNER_KEY = "kera_settings_banner_v1";

// ─────────────────────────────────────────────
// Composant : Banner de notification paramètres
// Affiché une seule fois par utilisateur
// Disparaît définitivement après fermeture
// ─────────────────────────────────────────────
function SettingsBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="relative flex items-center gap-4 px-5 py-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500"
      style={{
        background: "linear-gradient(135deg, #C8A05015 0%, #D4522A10 100%)",
        border: "1px solid #C8A05030",
      }}
    >
      {/* Icône */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "#C8A05020", border: "1px solid #C8A05030" }}
      >
        <Settings size={16} className="text-[#C8A050]" />
      </div>

      {/* Texte */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-[#F2E8D8]">
          Personnalisez votre expérience
        </p>
        <p className="text-[11px] text-[#9A8060] mt-0.5">
          Choisissez votre devise et vos préférences dans{" "}
          <Link
            href="/parametres"
            className="text-[#C8A050] hover:text-[#D4B860] underline underline-offset-2 transition-colors font-semibold"
          >
            Paramètres
          </Link>
        </p>
      </div>

      {/* Bouton fermer */}
      <button
        onClick={onDismiss}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9A8060] hover:text-[#F2E8D8] transition-colors shrink-0"
        style={{ background: "#3A281840" }}
        aria-label="Fermer la notification"
      >
        <X size={13} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page principale : Dashboard
// ─────────────────────────────────────────────
export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);

  // ── État du banner paramètres ──────────────
  // Pattern lazy: initialise une seule fois côté client
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

  // ── Fermeture définitive du banner ──────────
  const dismissSettingsBanner = () => {
    localStorage.setItem(SETTINGS_BANNER_KEY, "true");
    setShowSettingsBanner(false);
  };

  // ── Style de carte réutilisable ──────────────
  const cardStyle = {
    background: "linear-gradient(145deg, #1C1610, #1A1410)",
    border: "1px solid #3A281830",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-6 md:space-y-8 pb-32 pt-4">

        {/* ── Banner paramètres ──────────────────
            Affiché uniquement si l'utilisateur ne l'a
            pas encore fermé (vérifié via localStorage)
        ─────────────────────────────────────────── */}
        {showSettingsBanner === true && (
          <SettingsBanner onDismiss={dismissSettingsBanner} />
        )}

        {/* ── En-tête de section ─────────────────
            Visible uniquement quand des transactions
            existent, pour éviter le bruit visuel
        ─────────────────────────────────────────── */}
        {!loading && transactions.length > 0 && (
          <div className="flex items-center gap-2.5 px-1 animate-in fade-in slide-in-from-left duration-700">
            <div className="w-6 h-6 rounded-lg bg-[#C8A05010] flex items-center justify-center border border-[#C8A05020]">
              <Sparkles size={12} className="text-[#C8A050]" />
            </div>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#9A8060] opacity-80">
              Analyse de performance financière
            </p>
          </div>
        )}

        {/* ── Carte de solde ─────────────────────
            Pièce maîtresse du dashboard
            L'anneau de glow réagit au hover du groupe
        ─────────────────────────────────────────── */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#D4522A10] to-[#C8A05010] rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000 pointer-events-none" />
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

        {/* ── Grille principale ──────────────────
            - Mobile  : 1 colonne, graphiques en haut
            - Desktop : 12 colonnes, transactions à gauche
            L'ordre CSS (order-X) inverse la priorité visuelle
            entre mobile et desktop sans dupliquer le JSX
        ─────────────────────────────────────────── */}
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

        {/* ── Skeleton loading ───────────────────
            Affiché pendant le chargement initial
            pour éviter le layout shift
        ─────────────────────────────────────────── */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 h-64 rounded-3xl animate-pulse" style={{ background: "#1C1610" }} />
            <div className="lg:col-span-5 space-y-6">
              <div className="h-48 rounded-3xl animate-pulse" style={{ background: "#1C1610" }} />
              <div className="h-48 rounded-3xl animate-pulse" style={{ background: "#1C1610" }} />
            </div>
          </div>
        )}

        {/* ── Empty state ────────────────────────
            Affiché uniquement si aucune transaction
            et que le chargement est terminé
        ─────────────────────────────────────────── */}
        {!loading && transactions.length === 0 && (
          <div
            className="rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden"
            style={cardStyle}
          >
            <div className="w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 bg-[#1A1410] border border-[#3A2818] shadow-inner">
              <LayoutDashboard size={32} className="text-[#C8A050] opacity-40" />
            </div>

            <h2
              className="text-2xl md:text-3xl font-black text-[#F2E8D8] mb-4 tracking-tight"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Prêt à piloter ?
            </h2>
            <p className="text-sm md:text-base text-[#9A8060] max-w-sm mx-auto leading-relaxed font-medium">
              Votre cockpit financier est configuré. Il ne manque plus que vos premières données pour générer vos analyses.
            </p>

            <button
              onClick={() => setModalOpen(true)}
              className="mt-10 px-10 py-4 rounded-2xl bg-[#D4522A] text-white text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#D4522A]/25 hover:bg-[#E85D35] transition-all hover:scale-105 active:scale-95"
            >
              Lancer ma première saisie
            </button>
          </div>
        )}
      </div>

      {/* ── FAB ────────────────────────────────
          Toujours visible, indépendant du scroll
      ─────────────────────────────────────────── */}
      <FAB onClick={() => setModalOpen(true)} />

      {/* ── Modal de transaction ────────────────
          Contrôlé par modalOpen
          onSubmit ajoute et ferme automatiquement
      ─────────────────────────────────────────── */}
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