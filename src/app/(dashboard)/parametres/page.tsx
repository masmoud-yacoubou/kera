"use client";

import { useState } from "react";
import { usePreferences } from "@/hooks/usePreferences";
import { useTransactions } from "@/context/TransactionsContext";
import { useAuth } from "@/hooks/useAuth";
import { Currency, CURRENCIES } from "@/types";
import { Check, Download, User, Settings2, Database, Info } from "lucide-react";

// ─────────────────────────────────────────────
// Style de carte réutilisable
// ─────────────────────────────────────────────
const cardStyle = {
  background: "linear-gradient(145deg, #1C1610, #1A1410)",
  border: "1px solid #3A281830",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
};

// ─────────────────────────────────────────────
// Sous-composant : en-tête de section
// Factorisation des headers de carte
// ─────────────────────────────────────────────
function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
      <span className="text-[#C8A050] shrink-0" aria-hidden="true">
        {icon}
      </span>
      <h2
        className="text-sm sm:text-base font-semibold text-[#F2E8D8]"
        style={{ fontFamily: "var(--font-sora)" }}
      >
        {title}
      </h2>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page principale : Paramètres
// ─────────────────────────────────────────────
export default function ParametresPage() {
  const { preferences, updatePreferences } = usePreferences();
  const { transactions } = useTransactions();
  const { user } = useAuth();

  // ── Feedback de sauvegarde ───────────────────
  // Affiché 2 secondes après chaque mise à jour
  const [saved, setSaved] = useState(false);

  const handleUpdate = async (
    updates: Partial<{ currency: Currency; month_start_day: number }>
  ) => {
    await updatePreferences(updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // ── Export CSV ───────────────────────────────
  // Génère un fichier CSV avec toutes les transactions
  // et le télécharge côté client sans appel serveur
  const exportCSV = () => {
    const header = "Date,Libellé,Catégorie,Type,Montant\n";
    const rows = transactions
      .map(
        (t) =>
          `${t.date},"${t.label}",${t.category},${
            t.type === "income" ? "Entrée" : "Sortie"
          },${t.amount}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kera-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 pb-24 px-4 md:px-0">

      {/* ── Header ──────────────────────────────── */}
      <div className="pt-2 md:pt-0">
        <h1
          className="text-xl sm:text-2xl font-bold text-[#F2E8D8] tracking-tight"
          style={{ fontFamily: "var(--font-sora)" }}
        >
          Paramètres
        </h1>
        <p className="text-[9px] sm:text-xs text-[#9A8060] font-medium uppercase tracking-widest mt-1 opacity-60">
          Configuration de votre espace
        </p>
      </div>

      {/* ── Section Profil ───────────────────────── */}
      <div
        className="rounded-[1.75rem] sm:rounded-[2rem] p-4 sm:p-5 md:p-6"
        style={cardStyle}
      >
        <SectionHeader icon={<User size={17} />} title="Profil" />

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-[#0E0B08]/40 border border-[#3A281830]">
          {/* Avatar */}
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "#C8A05010", border: "1px solid #C8A05020" }}
            aria-hidden="true"
          >
            <span className="text-lg sm:text-xl font-bold text-[#C8A050]">
              {user?.email?.substring(0, 2).toUpperCase() ?? "?"}
            </span>
          </div>

          {/* Infos */}
          <div className="text-center sm:text-left min-w-0 w-full">
            <p
              className="text-xs sm:text-sm font-medium text-[#F2E8D8] truncate"
              aria-label={`Email : ${user?.email}`}
            >
              {user?.email}
            </p>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#9A8060] font-bold mt-0.5">
              Utilisateur Kera
            </p>
          </div>
        </div>
      </div>

      {/* ── Section Préférences ──────────────────── */}
      <div
        className="rounded-[1.75rem] sm:rounded-[2rem] p-4 sm:p-5 md:p-6 space-y-6 sm:space-y-8"
        style={cardStyle}
      >
        <SectionHeader icon={<Settings2 size={17} />} title="Préférences d'affichage" />

        {/* ── Devise ────────────────────────────── */}
        <div className="space-y-3 sm:space-y-4">
          <label
            id="currency-label"
            className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#9A8060]"
          >
            Devise de référence
          </label>

          {/* Grille de devises
              3 devises : grid-cols-3 suffit à toutes les tailles
          */}
          <div
            role="radiogroup"
            aria-labelledby="currency-label"
            className="grid grid-cols-3 gap-2 sm:gap-3"
          >
            {CURRENCIES.map((c) => {
              const isActive = preferences?.currency === c.code;
              return (
                <button
                  key={c.code}
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => handleUpdate({ currency: c.code })}
                  className="py-3 sm:py-4 px-2 rounded-2xl transition-all border min-h-[64px] sm:min-h-[72px]"
                  style={isActive ? {
                    background: "#D4522A10",
                    border: "1px solid #D4522A50",
                    color: "#D4522A",
                    boxShadow: "0 0 20px #D4522A08",
                  } : {
                    background: "#0E0B0840",
                    border: "1px solid #3A281830",
                    color: "#9A8060",
                  }}
                >
                  {/* Symbole */}
                  <span
                    className="block text-lg sm:text-xl mb-0.5 font-bold transition-colors"
                    style={{ color: isActive ? "#D4522A" : "#F2E8D8" }}
                    aria-hidden="true"
                  >
                    {c.symbol}
                  </span>
                  {/* Code */}
                  <span className="block text-[9px] sm:text-[10px] font-black uppercase tracking-tighter opacity-70">
                    {c.code}
                  </span>
                  {/* Label accessible uniquement pour les lecteurs d'écran */}
                  <span className="sr-only">{c.label}</span>
                </button>
              );
            })}
          </div>

          {/* Note d'information */}
          <div
            className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl"
            style={{ background: "#C8A05008", border: "1px solid #C8A05015" }}
            role="note"
          >
            <Info size={14} className="text-[#C8A050] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[10px] sm:text-[11px] text-[#9A8060] leading-relaxed">
              Le changement de devise modifie uniquement le{" "}
              <span className="text-[#C8A050] font-bold">symbole visuel</span>.
              Aucune conversion automatique n&apos;est effectuée sur vos montants.
            </p>
          </div>
        </div>

        {/* ── Jour de début de cycle ────────────── */}
        <div
          className="space-y-3 sm:space-y-4 pt-5 sm:pt-6"
          style={{ borderTop: "1px solid #3A281820" }}
        >
          <label
            id="cycle-label"
            className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#9A8060]"
          >
            Jour de réinitialisation mensuelle
          </label>

          <div
            role="radiogroup"
            aria-labelledby="cycle-label"
            className="flex flex-wrap gap-2 sm:gap-2.5"
          >
            {[1, 5, 10, 15, 20, 25].map((day) => {
              const isActive = preferences?.month_start_day === day;
              return (
                <button
                  key={day}
                  role="radio"
                  aria-checked={isActive}
                  aria-label={`Jour ${day}`}
                  onClick={() => handleUpdate({ month_start_day: day })}
                  className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl text-xs sm:text-sm font-black transition-all min-h-[44px]"
                  style={isActive ? {
                    background: "#D4522A",
                    border: "1px solid transparent",
                    color: "#fff",
                    boxShadow: "0 8px 16px #D4522A30",
                  } : {
                    background: "#0E0B0840",
                    border: "1px solid #3A281830",
                    color: "#9A8060",
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Feedback sauvegarde ───────────────── */}
        {saved && (
          <div
            className="flex items-center gap-2 text-[#4A8A6A] text-[10px] sm:text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-1"
            role="status"
            aria-live="polite"
          >
            <Check size={13} strokeWidth={3} aria-hidden="true" />
            <span>Modifications enregistrées</span>
          </div>
        )}
      </div>

      {/* ── Section Export ───────────────────────── */}
      <div
        className="rounded-[1.75rem] sm:rounded-[2rem] p-4 sm:p-5 md:p-6"
        style={cardStyle}
      >
        <SectionHeader icon={<Database size={17} />} title="Données & Export" />

        <div
          className="p-4 sm:p-5 rounded-2xl"
          style={{ background: "#0E0B0840", border: "1px solid #3A281830" }}
        >
          <p className="text-[11px] sm:text-xs md:text-sm text-[#9A8060] mb-4 sm:mb-5 leading-relaxed">
            Téléchargez l&apos;intégralité de votre historique au format CSV
            pour l&apos;importer dans Excel ou Google Sheets.
          </p>

          <button
            onClick={exportCSV}
            disabled={transactions.length === 0}
            aria-label={`Exporter ${transactions.length} transactions au format CSV`}
            className="w-full flex items-center justify-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl text-white text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed min-h-[48px]"
            style={{
              background: "linear-gradient(135deg, #D4522A, #C04020)",
              boxShadow: transactions.length > 0
                ? "0 8px 24px rgba(212,82,42,0.3)"
                : "none",
            }}
          >
            <Download size={16} aria-hidden="true" />
            <span>
              Exporter{" "}
              <span className="tabular-nums">{transactions.length}</span>{" "}
              transaction{transactions.length !== 1 ? "s" : ""}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}