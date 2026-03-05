"use client";

import { useState, memo } from "react";
import {
  Eye,
  EyeOff,
  Wallet,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface Props {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  formatAmount: (n: number) => string;
  loading: boolean;
}

/**
 * BalanceCard — Pièce maîtresse du dashboard
 *
 * Affiche le solde global, le taux d'épargne
 * et les flux entrants/sortants.
 *
 * Responsive : adapte la taille du solde et
 * les espacements entre mobile et desktop.
 *
 * Accessible : bouton masquer/afficher labellisé,
 * valeurs financières en tabular-nums.
 */
const BalanceCard = memo(function BalanceCard({
  balance,
  totalIncome,
  totalExpenses,
  formatAmount,
  loading,
}: Props) {
  const [hidden, setHidden] = useState(false);
  const mask = "••••••";

  // ── Taux d'épargne ───────────────────────────
  // Clampé entre 0 et 100 pour la barre de progression
  const savingsRate = totalIncome > 0
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
    : 0;
  const savingsRateClamped = Math.max(0, Math.min(savingsRate, 100));
  const isSavingsGood = savingsRate >= 20;

  const isPositive = balance >= 0;

  return (
    <div
      className="relative rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 overflow-hidden transition-all duration-500"
      style={{
        background: "linear-gradient(135deg, #1C1610 0%, #161008 100%)",
        border: "1px solid #3A281840",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
      }}
    >
      {/* ── Halo décoratif ──────────────────────
          Change de couleur selon le signe du solde
          Pointer-events-none pour ne pas bloquer les clics
      ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-[80px] pointer-events-none opacity-20 transition-colors duration-700"
        style={{ background: isPositive ? "#C8A050" : "#D4522A" }}
      />

      {/* ── Header ──────────────────────────────
          Identité de la carte + bouton confidentialité
      ─────────────────────────────────────────── */}
      <div className="relative flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Icône portefeuille */}
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "#C8A05008", border: "1px solid #C8A05020" }}
            aria-hidden="true"
          >
            <Wallet size={16} className="text-[#C8A050]" />
          </div>

          {/* Labels */}
          <div>
            <p className="text-[9px] sm:text-[10px] font-black text-[#9A8060] uppercase tracking-[0.15em] sm:tracking-[0.2em]">
              Patrimoine Disponible
            </p>
            <p className="text-[10px] sm:text-xs text-[#F2E8D8]/40 font-medium">
              Solde temps réel
            </p>
          </div>
        </div>

        {/* Bouton masquer / afficher — touch target 44px */}
        <button
          onClick={() => setHidden(!hidden)}
          aria-label={hidden ? "Afficher le solde" : "Masquer le solde"}
          aria-pressed={hidden}
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#9A8060] hover:text-[#F2E8D8] transition-all min-h-[44px] min-w-[44px]"
          style={{
            background: "#0E0B0840",
            border: "1px solid #3A281860",
          }}
        >
          {hidden
            ? <EyeOff size={16} aria-hidden="true" />
            : <Eye size={16} aria-hidden="true" />
          }
        </button>
      </div>

      {/* ── Solde principal ──────────────────────
          Skeleton pendant le chargement
          Gradient selon signe du solde
          tabular-nums pour éviter le layout shift
      ─────────────────────────────────────────── */}
      <div
        className="relative mb-6 sm:mb-8 min-h-[52px] sm:min-h-[64px] flex items-center"
        aria-live="polite"
        aria-label={hidden ? "Solde masqué" : `Solde : ${formatAmount(balance)}`}
      >
        {loading ? (
          // Skeleton adapté à la taille mobile
          <div className="h-10 sm:h-12 w-2/3 sm:w-3/4 rounded-2xl animate-pulse bg-[#3A281840]" />
        ) : (
          <p
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter transition-all duration-300"
            style={{
              fontFamily: "var(--font-sora)",
              background: hidden
                ? "none"
                : isPositive
                  ? "linear-gradient(135deg, #F2E8D8 30%, #C8A050 100%)"
                  : "linear-gradient(135deg, #F2E8D8 30%, #D4522A 100%)",
              WebkitBackgroundClip: hidden ? "none" : "text",
              WebkitTextFillColor: hidden ? "#3A2818" : "transparent",
              color: hidden ? "#3A2818" : undefined,
            }}
          >
            {hidden ? mask : formatAmount(balance)}
          </p>
        )}
      </div>

      {/* ── Jauge d'épargne ─────────────────────
          Visible uniquement si revenus > 0
          et données chargées et solde visible
      ─────────────────────────────────────────── */}
      {!hidden && !loading && totalIncome > 0 && (
        <div
          className="relative space-y-2 sm:space-y-3 mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700"
          aria-label={`Taux d'épargne : ${savingsRate}%`}
        >
          {/* Label + valeur */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Trophy
                size={11}
                aria-hidden="true"
                className={isSavingsGood ? "text-[#4A8A6A]" : "text-[#9A8060]"}
              />
              <span className="text-[9px] sm:text-[10px] font-bold text-[#9A8060] uppercase tracking-widest">
                Capacité d&apos;épargne
              </span>
            </div>
            <span
              className={`text-xs sm:text-sm font-black tabular-nums ${
                isSavingsGood ? "text-[#4A8A6A]" : "text-[#D4522A]"
              }`}
            >
              {savingsRate}%
            </span>
          </div>

          {/* Barre de progression */}
          <div
            role="progressbar"
            aria-valuenow={savingsRateClamped}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${savingsRate}% d'épargne`}
            className="h-1.5 w-full rounded-full overflow-hidden"
            style={{ background: "#0E0B08", border: "1px solid #3A281820" }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${savingsRateClamped}%`,
                background: isSavingsGood
                  ? "linear-gradient(90deg, #4A8A6A, #6AAA8A)"
                  : "linear-gradient(90deg, #D4522A, #E06040)",
                boxShadow: isSavingsGood
                  ? "0 0 12px rgba(74,138,106,0.3)"
                  : "none",
              }}
            />
          </div>
        </div>
      )}

      {/* ── Mini-widgets flux ────────────────────
          Grille 2 colonnes — s'adapte à toutes tailles
          touch target minimum respecté (p-4 = ~44px)
      ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">

        {/* Entrées */}
        <div
          className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl border transition-colors duration-300 hover:bg-[#4A8A6A08]"
          style={{ background: "#0E0B0840", borderColor: "#4A8A6A20" }}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
            <div
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "#4A8A6A15" }}
              aria-hidden="true"
            >
              <ArrowUpRight size={11} className="text-[#4A8A6A]" />
            </div>
            <span className="text-[8px] sm:text-[9px] font-black text-[#9A8060] uppercase tracking-tighter">
              Entrées
            </span>
          </div>
          <p
            className="text-sm sm:text-base font-bold text-[#4A8A6A] tabular-nums truncate"
            aria-label={hidden ? "Entrées masquées" : `Entrées : ${formatAmount(totalIncome)}`}
          >
            {hidden ? "•••" : formatAmount(totalIncome)}
          </p>
        </div>

        {/* Sorties */}
        <div
          className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl border transition-colors duration-300 hover:bg-[#D4522A08]"
          style={{ background: "#0E0B0840", borderColor: "#D4522A20" }}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
            <div
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "#D4522A15" }}
              aria-hidden="true"
            >
              <ArrowDownRight size={11} className="text-[#D4522A]" />
            </div>
            <span className="text-[8px] sm:text-[9px] font-black text-[#9A8060] uppercase tracking-tighter">
              Sorties
            </span>
          </div>
          <p
            className="text-sm sm:text-base font-bold text-[#D4522A] tabular-nums truncate"
            aria-label={hidden ? "Sorties masquées" : `Sorties : ${formatAmount(totalExpenses)}`}
          >
            {hidden ? "•••" : formatAmount(totalExpenses)}
          </p>
        </div>
      </div>
    </div>
  );
});

export default BalanceCard;