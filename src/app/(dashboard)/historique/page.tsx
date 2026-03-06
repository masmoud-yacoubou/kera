"use client";

import { useState, useEffect } from "react";
import { useTransactions } from "@/context/TransactionsContext";
import { usePreferences } from "@/hooks/usePreferences";
import { CATEGORIES, Category, CATEGORY_COLORS } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  Trash2, Search, ArrowUpRight, ArrowDownRight,
  History, AlertCircle, X,
} from "lucide-react";
import TransactionModal from "@/components/transactions/TransactionModal";
import FAB from "@/components/ui/FAB";

export default function HistoriquePage() {
  const { transactions, loading, addTransaction, deleteTransaction } = useTransactions();
  const { formatAmount } = usePreferences();

  const [search,          setSearch]          = useState("");
  const [filterType,      setFilterType]      = useState<"all" | "income" | "expense">("all");
  const [filterCategory,  setFilterCategory]  = useState<Category | "all">("all");
  const [modalOpen,       setModalOpen]       = useState(false);
  const [confirmingId,    setConfirmingId]    = useState<string | null>(null);

  // ── Timer de confirmation suppression ───────
  useEffect(() => {
    if (confirmingId) {
      const timer = setTimeout(() => setConfirmingId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmingId]);

  // ── Filtrage des transactions ────────────────
  const filtered = transactions.filter((t) => {
    const matchSearch   = t.label.toLowerCase().includes(search.toLowerCase());
    const matchType     = filterType === "all" || t.type === filterType;
    const matchCategory = filterCategory === "all" || t.category === filterCategory;
    return matchSearch && matchType && matchCategory;
  });

  const hasFilters = search || filterType !== "all" || filterCategory !== "all";

  // ── Suppression avec double confirmation ─────
  const handleDelete = (id: string) => {
    if (confirmingId === id) {
      deleteTransaction(id);
      setConfirmingId(null);
    } else {
      setConfirmingId(id);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5 sm:space-y-6 pb-32 pt-4">

        {/* ── Header ──────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1
              className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight"
              style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
            >
              Historique
            </h1>
            <p
              className="text-xs md:text-sm font-medium mt-1"
              style={{ color: "var(--muted)" }}
            >
              <span className="font-bold" style={{ color: "var(--or)" }}>
                {filtered.length}
              </span>{" "}
              transaction{filtered.length > 1 ? "s" : ""} répertoriée{filtered.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Bouton reset filtres */}
          {hasFilters && (
            <button
              onClick={() => {
                setSearch("");
                setFilterType("all");
                setFilterCategory("all");
              }}
              className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all min-h-[44px]"
              style={{
                background: "var(--accent-10)",
                color: "var(--accent)",
                border: "1px solid var(--accent-20)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-20)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent-10)"}
            >
              <X size={12} aria-hidden="true" />
              Effacer les filtres
            </button>
          )}
        </div>

        {/* ── Barre de filtres ─────────────────────
            1 colonne mobile, 12 colonnes desktop
        ─────────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-[1.75rem] sm:rounded-[2rem]"
          style={{
            background: "linear-gradient(145deg, var(--carte), var(--carte-2))",
            border: "1px solid var(--bordure-30)",
          }}
        >
          {/* Recherche */}
          <div className="md:col-span-5 relative group">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "var(--muted)" }}
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Rechercher une transaction"
              className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm focus:outline-none transition-all min-h-[44px]"
              style={{
                background: "var(--fond)",
                border: "1px solid var(--bordure)",
                color: "var(--texte)",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "var(--or-30)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "var(--bordure)"}
            />
          </div>

          {/* Toggle type */}
          <div
            className="md:col-span-4 flex p-1 rounded-2xl"
            style={{
              background: "var(--fond)",
              border: "1px solid var(--bordure)",
            }}
            role="radiogroup"
            aria-label="Filtrer par type"
          >
            {(["all", "income", "expense"] as const).map((t) => {
              const active = filterType === t;
              return (
                <button
                  key={t}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setFilterType(t)}
                  className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all min-h-[36px]"
                  style={active ? {
                    background: "var(--carte)",
                    color: "var(--or)",
                    border: "1px solid var(--bordure)",
                  } : {
                    color: "var(--muted)",
                    opacity: 0.5,
                  }}
                >
                  {t === "all" ? "Tout" : t === "income" ? "Entrées" : "Sorties"}
                </button>
              );
            })}
          </div>

          {/* Filtre catégorie */}
          <div className="md:col-span-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as Category | "all")}
              aria-label="Filtrer par catégorie"
              className="w-full px-4 py-3 rounded-2xl text-xs font-bold focus:outline-none appearance-none cursor-pointer min-h-[44px]"
              style={{
                background: "var(--fond)",
                border: "1px solid var(--bordure)",
                color: "var(--muted)",
                colorScheme: "dark",
              }}
            >
              <option value="all">Catégories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Liste des transactions ───────────────
            Skeleton / Empty state / Résultats
        ─────────────────────────────────────────── */}
        <div
          className="rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden"
          style={{
            background: "linear-gradient(145deg, var(--carte), var(--carte-2))",
            border: "1px solid var(--bordure-30)",
          }}
        >
          {/* Skeleton */}
          {loading && (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 w-full animate-pulse rounded-2xl"
                  style={{ background: "var(--bordure-20)" }}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center px-6">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center mb-6 opacity-40"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--bordure)",
                }}
                aria-hidden="true"
              >
                <History size={28} style={{ color: "var(--muted)" }} />
              </div>
              <p
                className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--muted)" }}
              >
                Aucun résultat
              </p>
            </div>
          )}

          {/* Résultats */}
          {!loading && filtered.length > 0 && (
            <div
              role="list"
              aria-label="Liste des transactions"
              className="divide-y"
              style={{ borderColor: "var(--bordure-20)" }}
            >
              {filtered.map((t) => {
                const color     = CATEGORY_COLORS[t.category as keyof typeof CATEGORY_COLORS] ?? "#9A8060";
                const isIncome  = t.type === "income";
                const isConfirming = confirmingId === t.id;

                return (
                  <div
                    key={t.id}
                    role="listitem"
                    className="flex items-center gap-3 md:gap-4 px-4 md:px-8 py-4 sm:py-5 transition-all relative group"
                    style={isConfirming
                      ? { background: "rgba(239,68,68,0.04)" }
                      : {}}
                    onMouseEnter={(e) => {
                      if (!isConfirming)
                        e.currentTarget.style.background = "var(--bordure-20)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isConfirming)
                        e.currentTarget.style.background = "transparent";
                    }}
                    aria-label={`${t.label} — ${isIncome ? "+" : "−"}${formatAmount(t.amount)}`}
                  >
                    {/* Icône */}
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all"
                      style={{
                        background: isConfirming ? "rgba(239,68,68,0.1)" : `${color}08`,
                        borderColor: isConfirming ? "rgba(239,68,68,0.2)" : `${color}20`,
                      }}
                      aria-hidden="true"
                    >
                      {isConfirming ? (
                        <AlertCircle size={18} className="text-red-400 animate-pulse" />
                      ) : isIncome ? (
                        <ArrowUpRight   size={18} style={{ color: "var(--succes)" }} />
                      ) : (
                        <ArrowDownRight size={18} style={{ color: "var(--accent)" }} />
                      )}
                    </div>

                    {/* Libellé + badges */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs md:text-sm font-bold truncate tracking-tight"
                        style={{ color: isConfirming ? "#f87171" : "var(--texte)" }}
                      >
                        {isConfirming ? "Voulez-vous supprimer ?" : t.label}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className="text-[8px] md:text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded"
                          style={{
                            color: isConfirming ? "#f87171" : color,
                            background: "var(--fond)",
                            border: "1px solid var(--bordure-60)",
                          }}
                        >
                          {t.category}
                        </span>
                        <span
                          className="text-[10px] font-medium opacity-60"
                          style={{ color: "var(--muted)" }}
                        >
                          · {formatDate(t.date)}
                        </span>
                      </div>
                    </div>

                    {/* Montant + bouton supprimer */}
                    <div className="flex items-center gap-3 md:gap-6 shrink-0">
                      {!isConfirming && (
                        <p
                          className="text-xs md:text-sm font-black tabular-nums"
                          style={{ color: isIncome ? "var(--succes)" : "var(--accent)" }}
                          aria-label={`${isIncome ? "Entrée" : "Sortie"} de ${formatAmount(t.amount)}`}
                        >
                          {isIncome ? "+" : "−"}{formatAmount(t.amount)}
                        </p>
                      )}

                      {/* Bouton supprimer
                          Mobile  : toujours visible
                          Desktop : apparaît au hover
                      */}
                      <button
                        onClick={() => handleDelete(t.id)}
                        aria-label={
                          isConfirming
                            ? `Confirmer la suppression de ${t.label}`
                            : `Supprimer ${t.label}`
                        }
                        className={`h-9 flex items-center justify-center rounded-xl transition-all duration-200 min-h-[36px] ${
                          isConfirming
                            ? "px-4 text-[10px] font-black uppercase tracking-widest bg-red-500 text-white"
                            : "w-9 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                        }`}
                        style={!isConfirming ? { color: "var(--muted)" } : {}}
                      >
                        {isConfirming
                          ? "Confirmer"
                          : <Trash2 size={14} aria-hidden="true" />
                        }
                      </button>
                    </div>

                    {/* Trait coloré gauche au hover */}
                    <div
                      aria-hidden="true"
                      className="absolute left-0 top-4 bottom-4 w-[2px] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: isConfirming ? "#ef4444" : color }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <FAB onClick={() => setModalOpen(true)} />

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={async (data) => {
          await addTransaction(data);
          setModalOpen(false);
        }}
      />
    </>
  );
}