"use client";

import { useState } from "react";
import { usePreferences } from "@/hooks/usePreferences";
import { useTransactions } from "@/context/TransactionsContext";
import { useAuth } from "@/hooks/useAuth";
import { Currency, CURRENCIES } from "@/types";
import { Check, Download, User, Settings2, Database, Info } from "lucide-react";
import { useTheme } from "next-themes";

// ─────────────────────────────────────────────
// Registre des thèmes disponibles
// Pour ajouter un thème : ajouter une entrée ici
// + le bloc CSS correspondant dans globals.css
// ─────────────────────────────────────────────
const THEMES = [
  { value: "dark",         label: "Sahara",  variant: "Dark",  emoji: "🏜️" },
  { value: "light",        label: "Sahara",  variant: "Light", emoji: "☀️" },
  { value: "ocean-dark",   label: "Ocean",   variant: "Dark",  emoji: "🌊" },
  { value: "ocean-light",  label: "Ocean",   variant: "Light", emoji: "🐚" },
  { value: "sun-dark",     label: "Sun",     variant: "Dark",  emoji: "🌙" },
  { value: "sun-light",    label: "Sun",     variant: "Light", emoji: "🍊" },
] as const;

type ThemeValue = typeof THEMES[number]["value"];

// ─────────────────────────────────────────────
// Style de carte réutilisable
// ─────────────────────────────────────────────
const cardStyle = {
  background: "linear-gradient(145deg, var(--carte), var(--surface))",
  border: "1px solid var(--bordure-30)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
};

// ─────────────────────────────────────────────
// Sous-composant : en-tête de section
// ─────────────────────────────────────────────
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
      <span style={{ color: "var(--or)" }} className="shrink-0" aria-hidden="true">
        {icon}
      </span>
      <h2
        className="text-sm sm:text-base font-semibold"
        style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
      >
        {title}
      </h2>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sous-composant : sélecteur de thème
//
// Grille de cartes cliquables — une par thème.
// Évolutif : ajouter une entrée dans THEMES suffit.
// ─────────────────────────────────────────────
function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Choisir un thème"
      className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3"
    >
      {THEMES.map((t) => {
        const isActive = theme === t.value;
        return (
          <button
            key={t.value}
            role="radio"
            aria-checked={isActive}
            aria-label={`Thème ${t.label} ${t.variant}`}
            onClick={() => setTheme(t.value)}
            className="flex items-center gap-2.5 px-3 py-3 rounded-2xl transition-all min-h-[52px] text-left"
            style={isActive ? {
              background: "var(--accent-10)",
              border: "1px solid var(--accent-20)",
              boxShadow: "0 0 16px var(--accent-10)",
            } : {
              background: "var(--fond-40)",
              border: "1px solid var(--bordure-30)",
            }}
          >
            {/* Emoji */}
            <span className="text-base leading-none shrink-0" aria-hidden="true">
              {t.emoji}
            </span>

            {/* Labels */}
            <div className="min-w-0">
              <p
                className="text-[10px] font-black uppercase tracking-tight leading-tight truncate"
                style={{ color: isActive ? "var(--accent)" : "var(--texte)" }}
              >
                {t.label}
              </p>
              <p
                className="text-[9px] font-bold uppercase tracking-widest opacity-60 truncate"
                style={{ color: isActive ? "var(--accent)" : "var(--muted)" }}
              >
                {t.variant}
              </p>
            </div>

            {/* Indicateur actif */}
            {isActive && (
              <div
                className="ml-auto w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "var(--accent)" }}
                aria-hidden="true"
              >
                <Check size={9} className="text-white" strokeWidth={3} />
              </div>
            )}
          </button>
        );
      })}
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
  const [saved, setSaved] = useState(false);

  const handleUpdate = async (
    updates: Partial<{ currency: Currency; month_start_day: number }>
  ) => {
    await updatePreferences(updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportCSV = () => {
    const header = "Date,Libellé,Catégorie,Type,Montant\n";
    const rows = transactions
      .map((t) =>
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
          className="text-xl sm:text-2xl font-bold tracking-tight"
          style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
        >
          Paramètres
        </h1>
        <p
          className="text-[9px] sm:text-xs font-medium uppercase tracking-widest mt-1 opacity-60"
          style={{ color: "var(--muted)" }}
        >
          Configuration de votre espace
        </p>
      </div>

      {/* ── Section Profil ───────────────────────── */}
      <div className="rounded-[1.75rem] sm:rounded-[2rem] p-4 sm:p-5 md:p-6" style={cardStyle}>
        <SectionHeader icon={<User size={17} />} title="Profil" />

        <div
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-4 rounded-2xl"
          style={{
            background: "var(--fond-40)",
            border: "1px solid var(--bordure-30)",
          }}
        >
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "var(--or-10)", border: "1px solid var(--or-20)" }}
            aria-hidden="true"
          >
            <span className="text-lg sm:text-xl font-bold" style={{ color: "var(--or)" }}>
              {user?.email?.substring(0, 2).toUpperCase() ?? "?"}
            </span>
          </div>
          <div className="text-center sm:text-left min-w-0 w-full">
            <p
              className="text-xs sm:text-sm font-medium truncate"
              style={{ color: "var(--texte)" }}
              aria-label={`Email : ${user?.email}`}
            >
              {user?.email}
            </p>
            <p
              className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold mt-0.5"
              style={{ color: "var(--muted)" }}
            >
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

        {/* ── Sélecteur de thème ────────────────── */}
        <div className="space-y-3">
          <p
            className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]"
            style={{ color: "var(--muted)" }}
          >
            Apparence
          </p>
          <ThemeSelector />
        </div>

        {/* ── Devise ────────────────────────────── */}
        <div className="space-y-3 sm:space-y-4">
          <label
            id="currency-label"
            className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]"
            style={{ color: "var(--muted)" }}
          >
            Devise de référence
          </label>

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
                    background: "var(--accent-10)",
                    border: "1px solid var(--accent-20)",
                    color: "var(--accent)",
                    boxShadow: "0 0 20px var(--accent-10)",
                  } : {
                    background: "var(--fond-40)",
                    border: "1px solid var(--bordure-30)",
                    color: "var(--muted)",
                  }}
                >
                  <span
                    className="block text-lg sm:text-xl mb-0.5 font-bold"
                    style={{ color: isActive ? "var(--accent)" : "var(--texte)" }}
                    aria-hidden="true"
                  >
                    {c.symbol}
                  </span>
                  <span className="block text-[9px] sm:text-[10px] font-black uppercase tracking-tighter opacity-70">
                    {c.code}
                  </span>
                  <span className="sr-only">{c.label}</span>
                </button>
              );
            })}
          </div>

          <div
            className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl"
            style={{ background: "var(--or-08)", border: "1px solid var(--or-15)" }}
            role="note"
          >
            <Info size={14} className="shrink-0 mt-0.5" style={{ color: "var(--or)" }} aria-hidden="true" />
            <p className="text-[10px] sm:text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
              Le changement de devise modifie uniquement le{" "}
              <span className="font-bold" style={{ color: "var(--or)" }}>symbole visuel</span>.
              Aucune conversion automatique n&apos;est effectuée sur vos montants.
            </p>
          </div>
        </div>

        {/* ── Jour de cycle ─────────────────────── */}
        <div
          className="space-y-3 sm:space-y-4 pt-5 sm:pt-6"
          style={{ borderTop: "1px solid var(--bordure-20)" }}
        >
          <label
            id="cycle-label"
            className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]"
            style={{ color: "var(--muted)" }}
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
                    background: "var(--accent)",
                    border: "1px solid transparent",
                    color: "#fff",
                    boxShadow: "0 8px 16px var(--accent-20)",
                  } : {
                    background: "var(--fond-40)",
                    border: "1px solid var(--bordure-30)",
                    color: "var(--muted)",
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
            className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-1"
            style={{ color: "var(--succes)" }}
            role="status"
            aria-live="polite"
          >
            <Check size={13} strokeWidth={3} aria-hidden="true" />
            <span>Modifications enregistrées</span>
          </div>
        )}
      </div>

      {/* ── Section Export ───────────────────────── */}
      <div className="rounded-[1.75rem] sm:rounded-[2rem] p-4 sm:p-5 md:p-6" style={cardStyle}>
        <SectionHeader icon={<Database size={17} />} title="Données & Export" />

        <div
          className="p-4 sm:p-5 rounded-2xl"
          style={{ background: "var(--fond-40)", border: "1px solid var(--bordure-30)" }}
        >
          <p
            className="text-[11px] sm:text-xs md:text-sm mb-4 sm:mb-5 leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Téléchargez l&apos;intégralité de votre historique au format CSV
            pour l&apos;importer dans Excel ou Google Sheets.
          </p>

          <button
            onClick={exportCSV}
            disabled={transactions.length === 0}
            aria-label={`Exporter ${transactions.length} transactions au format CSV`}
            className="w-full flex items-center justify-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl text-white text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed min-h-[48px]"
            style={{
              background: "linear-gradient(135deg, var(--accent), #C04020)",
              boxShadow: transactions.length > 0 ? "0 8px 24px var(--accent-20)" : "none",
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