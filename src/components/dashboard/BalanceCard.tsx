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
 *
 * Thème : toutes les couleurs via CSS variables
 * pour support light/dark automatique.
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
        background: "linear-gradient(135deg, var(--carte) 0%, var(--carte-2) 100%)",
        border: "1px solid var(--bordure-40)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)",
      }}
    >
      {/* ── Halo décoratif ──────────────────────
          Change de couleur selon le signe du solde
      ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-[80px] pointer-events-none opacity-20 transition-colors duration-700"
        style={{ background: isPositive ? "var(--or)" : "var(--accent)" }}
      />

      {/* ── Header ──────────────────────────────
          Icône portefeuille + bouton masquer
      ─────────────────────────────────────────── */}
      <div className="relative flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5 sm:gap-3">

          {/* Icône portefeuille */}
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: "var(--or-08)",
              border: "1px solid var(--or-20)",
            }}
            aria-hidden="true"
          >
            <Wallet size={16} style={{ color: "var(--or)" }} />
          </div>

          {/* Labels */}
          <div>
            <p
              className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]"
              style={{ color: "var(--muted)" }}
            >
              Patrimoine Disponible
            </p>
            <p
              className="text-[10px] sm:text-xs font-medium"
              style={{ color: "var(--texte)", opacity: 0.4 }}
            >
              Solde temps réel
            </p>
          </div>
        </div>

        {/* Bouton masquer / afficher */}
        <button
          onClick={() => setHidden(!hidden)}
          aria-label={hidden ? "Afficher le solde" : "Masquer le solde"}
          aria-pressed={hidden}
          className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all min-h-[44px] min-w-[44px]"
          style={{
            background: "var(--fond-40)",
            border: "1px solid var(--bordure-60)",
            color: "var(--muted)",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--texte)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
        >
          {hidden
            ? <EyeOff size={16} aria-hidden="true" />
            : <Eye    size={16} aria-hidden="true" />
          }
        </button>
      </div>

      {/* ── Solde principal ──────────────────────
          Skeleton pendant le chargement
          Gradient selon signe du solde
      ─────────────────────────────────────────── */}
      <div
        className="relative mb-6 sm:mb-8 min-h-[52px] sm:min-h-[64px] flex items-center"
        aria-live="polite"
        aria-label={hidden ? "Solde masqué" : `Solde : ${formatAmount(balance)}`}
      >
        {loading ? (
          <div
            className="h-10 sm:h-12 w-2/3 sm:w-3/4 rounded-2xl animate-pulse"
            style={{ background: "var(--bordure-40)" }}
          />
        ) : (
          <p
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter transition-all duration-300"
            style={{
              fontFamily: "var(--font-sora)",
              // Masqué : couleur de la bordure (invisible mais présent)
              // Positif : dégradé texte → or
              // Négatif : dégradé texte → accent
              background: hidden
                ? "none"
                : isPositive
                  ? "linear-gradient(135deg, var(--texte) 30%, var(--or) 100%)"
                  : "linear-gradient(135deg, var(--texte) 30%, var(--accent) 100%)",
              WebkitBackgroundClip: hidden ? "none" : "text",
              WebkitTextFillColor: hidden ? "var(--bordure)" : "transparent",
              color: hidden ? "var(--bordure)" : undefined,
            }}
          >
            {hidden ? mask : formatAmount(balance)}
          </p>
        )}
      </div>

      {/* ── Jauge d'épargne ─────────────────────
          Visible si revenus > 0, données chargées,
          solde non masqué
      ─────────────────────────────────────────── */}
      {!hidden && !loading && totalIncome > 0 && (
        <div
          className="relative space-y-2 sm:space-y-3 mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700"
          aria-label={`Taux d'épargne : ${savingsRate}%`}
        >
          {/* Label + pourcentage */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Trophy
                size={11}
                aria-hidden="true"
                style={{ color: isSavingsGood ? "var(--succes)" : "var(--muted)" }}
              />
              <span
                className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--muted)" }}
              >
                Capacité d&apos;épargne
              </span>
            </div>
            <span
              className="text-xs sm:text-sm font-black tabular-nums"
              style={{ color: isSavingsGood ? "var(--succes)" : "var(--accent)" }}
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
            style={{
              background: "var(--fond)",
              border: "1px solid var(--bordure-20)",
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${savingsRateClamped}%`,
                background: isSavingsGood
                  ? "linear-gradient(90deg, var(--succes), #6AAA8A)"
                  : "linear-gradient(90deg, var(--accent), #E06040)",
                boxShadow: isSavingsGood
                  ? "0 0 12px rgba(74,138,106,0.3)"
                  : "none",
              }}
            />
          </div>
        </div>
      )}

      {/* ── Mini-widgets flux ────────────────────
          Entrées (vert) / Sorties (rouge)
      ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">

        {/* Entrées */}
        <div
          className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl border transition-colors duration-300"
          style={{
            background: "var(--fond-40)",
            borderColor: "var(--succes-soft)",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--succes-soft)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--fond-40)"}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
            <div
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "var(--succes-soft)" }}
              aria-hidden="true"
            >
              <ArrowUpRight size={11} style={{ color: "var(--succes)" }} />
            </div>
            <span
              className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter"
              style={{ color: "var(--muted)" }}
            >
              Entrées
            </span>
          </div>
          <p
            className="text-sm sm:text-base font-bold tabular-nums truncate"
            style={{ color: "var(--succes)" }}
            aria-label={hidden ? "Entrées masquées" : `Entrées : ${formatAmount(totalIncome)}`}
          >
            {hidden ? "•••" : formatAmount(totalIncome)}
          </p>
        </div>

        {/* Sorties */}
        <div
          className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl border transition-colors duration-300"
          style={{
            background: "var(--fond-40)",
            borderColor: "var(--accent-20)",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-10)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--fond-40)"}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
            <div
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "var(--accent-15)" }}
              aria-hidden="true"
            >
              <ArrowDownRight size={11} style={{ color: "var(--accent)" }} />
            </div>
            <span
              className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter"
              style={{ color: "var(--muted)" }}
            >
              Sorties
            </span>
          </div>
          <p
            className="text-sm sm:text-base font-bold tabular-nums truncate"
            style={{ color: "var(--accent)" }}
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