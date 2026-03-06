/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { X, ArrowDownRight, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { TransactionInsert, CATEGORIES, Category, CATEGORY_COLORS } from "@/types";

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionInsert) => Promise<void>;
  initialData?: Partial<TransactionInsert>;
}

export default function TransactionModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [type, setType]         = useState<"income" | "expense">("expense");
  const [amount, setAmount]     = useState("");
  const [label, setLabel]       = useState("");
  const [category, setCategory] = useState<Category>("Alimentation");
  const [date, setDate]         = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading]   = useState(false);

  // ── Sync formulaire + blocage scroll ────────
  useEffect(() => {
    if (isOpen) {
      setAmount(initialData?.amount?.toString() || "");
      setLabel(initialData?.label || "");
      setType(initialData?.type || "expense");
      setCategory(initialData?.category || "Alimentation");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, initialData]);

  // ── Fermeture via Echap ──────────────────────
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ── Soumission ───────────────────────────────
  const handleSubmit = async () => {
    const parsed = parseFloat(amount.replace(",", "."));
    if (!parsed || parsed <= 0 || !label.trim()) return;

    setLoading(true);
    try {
      await onSubmit({ type, amount: parsed, label, category, date });
      onClose();
    } catch (error) {
      console.error("Kera Error (Submit):", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isIncome = type === "income";
  // Couleur dynamique selon le type — hardcodée car utilisée
  // dans des dégradés inline qui ne supportent pas CSS variables
  const accentColor = isIncome ? "#4A8A6A" : "#D4522A";
  const isValid = !!amount && !!label && !loading;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">

      {/* ── Overlay ───────────────────────────── */}
      <div
        className="absolute inset-0 backdrop-blur-md transition-opacity duration-500 cursor-pointer"
        style={{ background: "rgba(10, 8, 6, 0.85)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Modal ─────────────────────────────────
          Drawer sur mobile (slide from bottom)
          Dialog centré sur desktop
      ─────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={initialData ? "Modifier la transaction" : "Nouvelle transaction"}
        className="relative w-full sm:max-w-[440px] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 pb-10 sm:pb-8 animate-in slide-in-from-bottom duration-300 outline-none"
        style={{
          background: "linear-gradient(165deg, var(--carte) 0%, var(--carte-2) 100%)",
          border: "1px solid var(--bordure-60)",
          boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}10`,
        }}
      >
        {/* Handle mobile */}
        <div className="flex justify-center mb-6 sm:hidden" aria-hidden="true">
          <div
            className="w-12 h-1.5 rounded-full"
            style={{ background: "var(--bordure)" }}
          />
        </div>

        {/* ── Header ────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className="text-xl font-black tracking-tight"
              style={{
                color: "var(--texte)",
                fontFamily: "var(--font-sora)",
              }}
            >
              {initialData ? "Modifier" : "Nouvelle Saisie"}
            </h2>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1 opacity-60"
              style={{ color: "var(--muted)" }}
            >
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>

          {/* Bouton fermer */}
          <button
            onClick={onClose}
            aria-label="Fermer la modal"
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all min-h-[44px]"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--bordure-60)",
              color: "var(--muted)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--texte)";
              e.currentTarget.style.borderColor = "var(--or-40)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--muted)";
              e.currentTarget.style.borderColor = "var(--bordure-60)";
            }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-6">

          {/* ── Sélecteur type : Dépense / Revenu ── */}
          <div
            className="grid grid-cols-2 p-1.5 rounded-2xl"
            style={{
              background: "var(--fond)",
              border: "1px solid var(--bordure-40)",
            }}
            role="radiogroup"
            aria-label="Type de transaction"
          >
            {(["expense", "income"] as const).map((t) => {
              const active = type === t;
              const color = t === "income" ? "#4A8A6A" : "#D4522A";
              return (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setType(t)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 min-h-[44px] ${
                    active ? "shadow-lg scale-[1.02]" : "opacity-40 grayscale"
                  }`}
                  style={active
                    ? { background: `${color}15`, border: `1px solid ${color}30`, color }
                    : { color: "var(--muted)" }
                  }
                >
                  {t === "income"
                    ? <ArrowUpRight   size={14} aria-hidden="true" />
                    : <ArrowDownRight size={14} aria-hidden="true" />
                  }
                  {t === "income" ? "Revenu" : "Dépense"}
                </button>
              );
            })}
          </div>

          {/* ── Saisie du montant ────────────────── */}
          <div className="relative group">
            <div
              className="flex flex-col items-center py-6 px-4 rounded-[2rem] transition-all"
              style={{
                background: "var(--fond)",
                border: "1px solid var(--bordure-40)",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "var(--or-30)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "var(--bordure-40)"}
            >
              <span
                className="text-[9px] font-black uppercase tracking-[0.3em] mb-3 opacity-50"
                style={{ color: "var(--muted)" }}
              >
                Valeur numérique
              </span>
              <div className="flex items-center gap-3">
                <span
                  className="text-4xl font-black"
                  style={{ color: accentColor }}
                  aria-hidden="true"
                >
                  {isIncome ? "+" : "−"}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  autoFocus
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
                  placeholder="0.00"
                  aria-label="Montant de la transaction"
                  className="text-4xl font-black bg-transparent focus:outline-none w-48 text-center tabular-nums"
                  style={{
                    color: "var(--texte)",
                    caretColor: accentColor,
                    fontFamily: "var(--font-sora)",
                    // Placeholder via CSS car inline style ne supporte pas ::placeholder
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── Champs description + catégorie ───── */}
          <div className="space-y-4">

            {/* Description */}
            <div className="space-y-2">
              <label
                className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-70"
                style={{ color: "var(--muted)" }}
              >
                Description
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ex: Abonnement Netflix"
                aria-label="Description de la transaction"
                className="w-full px-5 py-4 rounded-2xl text-sm focus:outline-none transition-all min-h-[44px]"
                style={{
                  background: "var(--fond)",
                  border: "1px solid var(--bordure-40)",
                  color: "var(--texte)",
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--or-30)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--bordure-40)"}
              />
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <label
                className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-70"
                style={{ color: "var(--muted)" }}
              >
                Catégorie
              </label>
              <div
                className="grid grid-cols-3 gap-2 max-h-[140px] overflow-y-auto pr-1"
                role="radiogroup"
                aria-label="Catégorie de la transaction"
              >
                {CATEGORIES.map((c) => {
                  const color = CATEGORY_COLORS[c] ?? "#9A8060";
                  const active = category === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setCategory(c)}
                      className="py-2.5 rounded-xl text-[10px] font-bold transition-all border uppercase tracking-tighter text-center min-h-[36px]"
                      style={active
                        ? { background: `${color}15`, borderColor: `${color}60`, color }
                        : { background: "var(--fond)", borderColor: "var(--bordure-40)", color: "var(--muted)" }
                      }
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Bouton validation ────────────────── */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            aria-label={initialData ? "Mettre à jour la transaction" : "Confirmer la transaction"}
            className="w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 min-h-[52px]"
            style={{
              background: isValid ? accentColor : "var(--surface)",
              color: isValid ? "#fff" : "var(--bordure)",
              boxShadow: isValid ? `0 15px 30px ${accentColor}40` : "none",
              cursor: isValid ? "pointer" : "not-allowed",
            }}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              <>
                <Check size={18} strokeWidth={3} aria-hidden="true" />
                <span>{initialData ? "Mettre à jour" : "Confirmer la transaction"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}