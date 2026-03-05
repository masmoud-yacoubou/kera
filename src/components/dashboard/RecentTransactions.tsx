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
// Utilisé pendant le chargement initial
// ─────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl animate-pulse shrink-0" style={{ background: "#251C1440" }} />
      {/* Texte */}
      <div className="flex-1 space-y-2">
        <div className="h-3 rounded-lg animate-pulse w-1/2" style={{ background: "#251C1440" }} />
        <div className="h-2 rounded-lg animate-pulse w-1/4" style={{ background: "#1C140E40" }} />
      </div>
      {/* Montant */}
      <div className="h-3 w-16 rounded-lg animate-pulse" style={{ background: "#251C1440" }} />
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
        style={{ background: "#251C14", border: "1px solid #3A2818" }}
        aria-hidden="true"
      >
        <Inbox size={22} className="text-[#9A8060]" />
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-[#9A8060]">Aucun mouvement</p>
        <p className="text-[10px] text-[#9A8060]/50 mt-0.5">
          Ajoutez votre première transaction
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sous-composant : ligne de transaction
// Extrait pour la lisibilité et éviter la
// répétition de logique dans le map parent
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

  // Couleurs des montants alignées sur la palette Sahara
  // (remplacement de #00E676 / #FF4D4D trop saturés)
  const amountColor = isIncome ? "#4A8A6A" : "#D4522A";

  return (
    <div
      role="listitem"
      onClick={() => onEdit(t)}
      className="group flex items-center gap-3 p-3 sm:p-4 rounded-2xl transition-all duration-200 border border-transparent hover:border-[#3A281840] cursor-pointer relative"
      style={{ WebkitTapHighlightColor: "transparent" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#251C1460")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      aria-label={`${t.label} — ${isIncome ? "+" : "−"}${formatAmount(t.amount)}`}
    >
      {/* ── Icône catégorie / confirmation ──────── */}
      <div
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
        style={{
          background: isConfirming ? "rgba(239,68,68,0.1)" : `${color}10`,
          border: `1px solid ${isConfirming ? "rgba(239,68,68,0.3)" : `${color}20`}`,
        }}
        aria-hidden="true"
      >
        {isConfirming ? (
          <AlertCircle size={16} className="text-red-400 animate-pulse" />
        ) : isIncome ? (
          <ArrowUpRight size={16} className="text-[#4A8A6A]" />
        ) : (
          <ArrowDownRight size={16} className="text-[#D4522A]" />
        )}
      </div>

      {/* ── Libellé + badge catégorie ────────────── */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs sm:text-sm font-bold truncate transition-colors ${
            isConfirming ? "text-red-400" : "text-[#F2E8D8]"
          }`}
        >
          {isConfirming ? "Supprimer ce flux ?" : t.label}
        </p>

        {/* Badge catégorie — tronqué sur très petit écran */}
        {!isConfirming && (
          <span
            className="inline-block mt-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded max-w-[120px] truncate"
            style={{
              color,
              background: "#0E0B08",
              border: "1px solid #3A281860",
            }}
          >
            {t.category}
          </span>
        )}
      </div>

      {/* ── Montant + bouton supprimer ───────────── */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Montant — masqué en mode confirmation */}
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
            - Mobile  : toujours visible (pas de hover)
            - Desktop : apparaît au hover du groupe
            - En confirmation : rouge plein avec texte
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
              : "w-9 h-9 text-[#9A8060] hover:bg-red-500/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
            }
          `}
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
  // ── Confirmation de suppression ──────────────
  // L'utilisateur doit cliquer deux fois pour supprimer
  // Le timer annule la confirmation après 3 secondes
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (confirmingId) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setConfirmingId(null), 3000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [confirmingId]);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    // Stoppe la propagation pour ne pas déclencher onEdit
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
        background: "linear-gradient(145deg, #1C1610 0%, #161008 100%)",
        border: "1px solid #3A281830",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
      }}
    >
      {/* ── Header ──────────────────────────────── */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8 px-1">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Icône */}
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#C8A05008", border: "1px solid #C8A05020" }}
            aria-hidden="true"
          >
            <Clock size={15} className="text-[#C8A050]" />
          </div>

          {/* Titre */}
          <div>
            <h3
              className="text-sm font-bold text-[#F2E8D8] tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Activités
            </h3>
            <p className="text-[9px] text-[#9A8060] font-black uppercase tracking-[0.15em] opacity-50">
              Flux récents
            </p>
          </div>
        </div>

        {/* Compteur — visible uniquement si des transactions existent */}
        {!loading && transactions.length > 0 && (
          <span
            className="text-[10px] font-black tabular-nums px-2.5 py-1 rounded-xl"
            style={{
              background: "#C8A05010",
              color: "#C8A050",
              border: "1px solid #C8A05020",
            }}
            aria-label={`${transactions.length} transactions`}
          >
            {transactions.length}
          </span>
        )}
      </div>

      {/* ── Contenu ─────────────────────────────── */}
      <div
        role="list"
        aria-label="Liste des transactions récentes"
        aria-busy={loading}
        className="space-y-0.5"
      >
        {loading ? (
          // Skeleton — 4 lignes pendant le chargement
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