/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ArrowDownRight, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { TransactionInsert, CATEGORIES, Category, CATEGORY_COLORS } from "@/types";

/**
 * Interface des propriétés du TransactionModal.
 * @param isOpen - Contrôle la visibilité de la modal.
 * @param onClose - Fonction de fermeture.
 * @param onSubmit - Callback asynchrone pour traiter la transaction insérée.
 * @param initialData - (Optionnel) Pour transformer la modal en formulaire d'édition.
 */
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionInsert) => Promise<void>;
  initialData?: Partial<TransactionInsert>;
}

export default function TransactionModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState<Category>("Alimentation");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  // Synchronisation et Reset du formulaire
  useEffect(() => {
    if (isOpen) {
      setAmount(initialData?.amount?.toString() || "");
      setLabel(initialData?.label || "");
      setType(initialData?.type || "expense");
      setCategory(initialData?.category || "Alimentation");
      // Bloquer le scroll du body
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, initialData]);

  // Fermeture via la touche Echap
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /**
   * Valide et traite l'envoi de la transaction.
   */
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
  const accentColor = isIncome ? "#4A8A6A" : "#D4522A";

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Overlay Haute Densité avec flou */}
      <div
        className="absolute inset-0 backdrop-blur-md transition-opacity duration-500 cursor-pointer"
        style={{ background: "rgba(10, 8, 6, 0.85)" }}
        onClick={onClose}
      />

      {/* Modal / Drawer Mobile-Friendly */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full sm:max-w-[440px] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 pb-10 sm:pb-8 animate-in slide-in-from-bottom duration-300 outline-none"
        style={{
          background: "linear-gradient(165deg, #1C1610 0%, #110C08 100%)",
          border: "1px solid #3A281860",
          boxShadow: `0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px ${accentColor}10`,
        }}
      >
        {/* Handle de drag pour l'esthétique mobile */}
        <div className="flex justify-center mb-6 sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-[#3A2818]" />
        </div>

        {/* Header avec date dynamique */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black text-[#F2E8D8] tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
              {initialData ? "Modifier" : "Nouvelle Saisie"}
            </h2>
            <p className="text-[10px] font-bold text-[#9A8060] uppercase tracking-[0.2em] mt-1 opacity-60">
              {new Date().toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#9A8060] hover:text-[#F2E8D8] transition-all bg-[#1A1410] border border-[#3A281860] hover:border-[#C8A05040]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Sélecteur de Type (Tabs) */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#0E0B08] border border-[#3A281840]">
            {(["expense", "income"] as const).map((t) => {
              const active = type === t;
              const color = t === "income" ? "#4A8A6A" : "#D4522A";
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                    active ? 'shadow-lg scale-[1.02]' : 'opacity-40 grayscale'
                  }`}
                  style={active ? { background: `${color}15`, border: `1px solid ${color}30`, color } : { color: "#9A8060" }}
                >
                  {t === "income" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {t === "income" ? "Revenu" : "Dépense"}
                </button>
              );
            })}
          </div>

          {/* Input du Montant */}
          <div className="relative group">
            <div className="flex flex-col items-center py-6 px-4 rounded-[2rem] bg-[#0E0B08] border border-[#3A281840] group-focus-within:border-[#C8A05030] transition-all">
              <span className="text-[9px] font-black text-[#9A8060] uppercase tracking-[0.3em] mb-3 opacity-50">Valeur numérique</span>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black" style={{ color: accentColor }}>
                  {isIncome ? "+" : "−"}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  autoFocus
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
                  placeholder="0.00"
                  className="text-4xl font-black bg-transparent text-[#F2E8D8] placeholder-[#3A2818] focus:outline-none w-48 text-center tabular-nums"
                  style={{ fontFamily: "var(--font-sora)" }}
                />
              </div>
            </div>
          </div>

          {/* Formulaire descriptif */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#9A8060] uppercase tracking-widest ml-1 opacity-70">Description</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ex: Abonnement Netflix"
                className="w-full px-5 py-4 rounded-2xl bg-[#0E0B08] border border-[#3A281840] text-[#F2E8D8] text-sm focus:outline-none focus:border-[#C8A05060] transition-all placeholder-[#3A2818]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#9A8060] uppercase tracking-widest ml-1 opacity-70">Catégorie</label>
              <div className="grid grid-cols-3 gap-2 max-h-[140px] overflow-y-auto pr-1 scrollbar-hide">
                {CATEGORIES.map((c) => {
                  const color = CATEGORY_COLORS[c] ?? "#9A8060";
                  const active = category === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className="py-2.5 rounded-xl text-[10px] font-bold transition-all border uppercase tracking-tighter text-center"
                      style={active ? { 
                        background: `${color}15`, 
                        borderColor: `${color}60`, 
                        color: color 
                      } : { 
                        background: "#0E0B08", 
                        borderColor: "#3A281840", 
                        color: "#9A8060" 
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bouton de validation */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !amount || !label}
            className="w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
            style={{
              background: loading || !amount || !label ? "#1A1410" : accentColor,
              color: loading || !amount || !label ? "#3A2818" : "#FFF",
              boxShadow: !loading && amount && label ? `0 15px 30px ${accentColor}40` : "none"
            }}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Check size={18} strokeWidth={3} />
                <span>{initialData ? "Mettre à jour" : "Confirmer la transaction"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}