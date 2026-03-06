"use client";

import { useState, useEffect, useRef, memo } from "react";
import { Transaction, CATEGORY_COLORS } from "@/types";
import { Trash2, ArrowUpRight, ArrowDownRight, Clock, AlertCircle, Inbox } from "lucide-react";

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface Props {
  transactions: Transaction[];
  formatAmount: (n: number) => string;
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (t: Transaction) => void;
}

// ─────────────────────────────────────────────
// Sous-composant : ligne skeleton
// ─────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl">
      <div
        className="w-10 h-10 rounded-xl animate-pulse shrink-0"
        style={{ background: "var(--bordure-40)" }}
      />
      <div className="flex-1 space-y-2">
        <div
          className="h-3 rounded-lg animate-pulse w-1/2"
          style={{ background: "var(--bordure-40)" }}
        />
        <div
          className="h-2 rounded-lg animate-pulse w-1/4"
          style={{ background: "var(--bordure-20)" }}
        />
      </div>
      <div
        className="h-3 w-16 rounded-lg animate-pulse"
        style={{ background: "var(--bordure-40)" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// Sous-composant : état vide
// ─────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-14 gap-3">
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl flex items-center justify-center"
        style={{
          background: "var(--carte)",
          border: "1px solid var(--bordure)",
        }}
        aria-hidden="true"
      >
        <Inbox size={22} style={{ color: "var(--muted)" }} />
      </div>
      <div className="text-center">
        <p
          className="text-xs font-bold"
          style={{ color: "var(--muted)" }}
        >
          Aucun mouvement
        </p>
        <p
          className="text-[10px] mt-0.5"
          style={{ color: "var(--muted)", opacity: 0.5 }}
        >
          Ajoutez votre première transaction
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sous-composant : ligne de transaction
// ─────────────────────────────────────────────
function TransactionRow({
  transaction: t,
  formatAmount,
  isConfirming,
  onDeleteClick,
  onEdit,
}: {
  transaction: Transaction;
  formatAmount: (n: number) => string;
  isConfirming: boolean;
  onDeleteClick: (e: React.MouseEvent, id: string) => void;
  onEdit: (t: Transaction) => void;
}) {
  const color = CATEGORY_COLORS[t.category as keyof typeof CATEGORY_COLORS] ?? "#9A8060";
  const isIncome = t.type === "income";

  // Couleurs montants via variables de thème
  const amountColor = isIncome ? "var(--succes)" : "var(--accent)";

  return (
    <div
      role="listitem"
      onClick={() => onEdit(t)}
      className="group flex items-center gap-3 p-3 sm:p-4 rounded-2xl transition-all duration-200 border border-transparent cursor-pointer relative"
      style={{ WebkitTapHighlightColor: "transparent" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bordure-40)";
        e.currentTarget.style.borderColor = "var(--bordure-40)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.borderColor = "transparent";
      }}
      aria-label={`${t.label} — ${isIncome ? "+" : "−"}${formatAmount(t.amount)}`}
    >
      {/* ── Icône catégorie / confirmation ──────── */}
      <div
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
        style={{
          background: isConfirming ? "rgba(239,68,68,0.1)" : `${color}15`,
          border: `1px solid ${isConfirming ? "rgba(239,68,68,0.3)" : `${color}25`}`,
        }}
        aria-hidden="true"
      >
        {isConfirming ? (
          <AlertCircle size={16} className="text-red-400 animate-pulse" />
        ) : isIncome ? (
          <ArrowUpRight  size={16} style={{ color: "var(--succes)" }} />
        ) : (
          <ArrowDownRight size={16} style={{ color: "var(--accent)" }} />
        )}
      </div>

      {/* ── Libellé + badge catégorie ────────────── */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs sm:text-sm font-bold truncate transition-colors"
          style={{ color: isConfirming ? "#f87171" : "var(--texte)" }}
        >
          {isConfirming ? "Supprimer ce flux ?" : t.label}
        </p>

        {/* Badge catégorie */}
        {!isConfirming && (
          <span
            className="inline-block mt-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded max-w-[120px] truncate"
            style={{
              color,
              background: "var(--fond)",
              border: "1px solid var(--bordure-60)",
            }}
          >
            {t.category}
          </span>
        )}
      </div>

      {/* ── Montant + bouton supprimer ───────────── */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

        {/* Montant */}
        {!isConfirming && (
          <p
            className="text-xs sm:text-sm font-black tabular-nums"
            style={{ color: amountColor }}
            aria-label={`${isIncome ? "Entrée" : "Sortie"} de ${formatAmount(t.amount)}`}
          >
            {isIncome ? "+" : "−"}{formatAmount(t.amount)}
          </p>
        )}

        {/* Bouton supprimer
            Mobile  : toujours visible
            Desktop : apparaît au hover
            Confirmation : rouge plein
        */}
        <button
          onClick={(e) => onDeleteClick(e, t.id)}
          aria-label={
            isConfirming
              ? `Confirmer la suppression de ${t.label}`
              : `Supprimer ${t.label}`
          }
          className={`
            flex items-center justify-center gap-1.5 rounded-xl
            font-bold text-[10px] uppercase tracking-tighter
            transition-all duration-200 min-h-[36px]
            ${isConfirming
              ? "bg-red-500 text-white shadow-lg shadow-red-500/20 px-3 sm:px-4"
              : "w-9 h-9 hover:bg-red-500/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
            }
          `}
          style={!isConfirming ? { color: "var(--muted)" } : {}}
        >
          {isConfirming
            ? <span className="whitespace-nowrap">Confirmer</span>
            : <Trash2 size={14} aria-hidden="true" />
          }
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Composant principal : RecentTransactions
// ─────────────────────────────────────────────
const RecentTransactions = memo(function RecentTransactions({
  transactions,
  formatAmount,
  loading,
  onDelete,
  onEdit,
}: Props) {
  // ── Confirmation suppression ─────────────────
  // Double-clic requis, annulation après 3s
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (confirmingId) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setConfirmingId(null), 3000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [confirmingId]);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirmingId === id) {
      onDelete(id);
      setConfirmingId(null);
    } else {
      setConfirmingId(id);
    }
  };

  return (
    <div
      className="rounded-[2rem] p-4 sm:p-6 md:p-8 h-full transition-all duration-500"
      style={{
        background: "linear-gradient(145deg, var(--carte) 0%, var(--carte-2) 100%)",
        border: "1px solid var(--bordure-30)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      }}
    >
      {/* ── Header ──────────────────────────────── */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8 px-1">
        <div className="flex items-center gap-2.5 sm:gap-3">

          {/* Icône horloge */}
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "var(--or-08)",
              border: "1px solid var(--or-20)",
            }}
            aria-hidden="true"
          >
            <Clock size={15} style={{ color: "var(--or)" }} />
          </div>

          {/* Titre */}
          <div>
            <h3
              className="text-sm font-bold tracking-tight leading-tight"
              style={{
                color: "var(--texte)",
                fontFamily: "var(--font-sora)",
              }}
            >
              Activités
            </h3>
            <p
              className="text-[9px] font-black uppercase tracking-[0.15em] opacity-50"
              style={{ color: "var(--muted)" }}
            >
              Flux récents
            </p>
          </div>
        </div>

        {/* Compteur de transactions */}
        {!loading && transactions.length > 0 && (
          <span
            className="text-[10px] font-black tabular-nums px-2.5 py-1 rounded-xl"
            style={{
              background: "var(--or-10)",
              color: "var(--or)",
              border: "1px solid var(--or-20)",
            }}
            aria-label={`${transactions.length} transactions`}
          >
            {transactions.length}
          </span>
        )}
      </div>

      {/* ── Liste ────────────────────────────────── */}
      <div
        role="list"
        aria-label="Liste des transactions récentes"
        aria-busy={loading}
        className="space-y-0.5"
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
        ) : transactions.length === 0 ? (
          <EmptyState />
        ) : (
          transactions.map((t) => (
            <TransactionRow
              key={t.id}
              transaction={t}
              formatAmount={formatAmount}
              isConfirming={confirmingId === t.id}
              onDeleteClick={handleDeleteClick}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
});

export default RecentTransactions;