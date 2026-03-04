"use client";

import { useState, useEffect, useRef, memo } from "react";
import { Transaction, CATEGORY_COLORS } from "@/types";
import { Trash2, ArrowUpRight, ArrowDownRight, Clock, AlertCircle } from "lucide-react";

interface Props {
  transactions: Transaction[];
  formatAmount: (n: number) => string;
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (t: Transaction) => void;
}

const RecentTransactions = memo(function RecentTransactions({ 
  transactions, 
  formatAmount, 
  loading, 
  onDelete, 
  onEdit 
}: Props) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Gestion intelligente du timer de confirmation
  useEffect(() => {
    if (confirmingId) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setConfirmingId(null), 3000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [confirmingId]);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Évite de déclencher l'édition au clic sur supprimer
    if (confirmingId === id) {
      onDelete(id);
      setConfirmingId(null);
    } else {
      setConfirmingId(id);
    }
  };

  return (
    <div
      className="rounded-[2rem] p-5 md:p-8 h-full transition-all duration-500"
      style={{
        background: "linear-gradient(145deg, #1C1610 0%, #161008 100%)",
        border: "1px solid #3A281830",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8 px-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#C8A05008] border border-[#C8A05020]">
            <Clock size={16} className="text-[#C8A050]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F2E8D8] tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
              Activités
            </h3>
            <p className="text-[9px] text-[#9A8060] font-black uppercase tracking-[0.15em] opacity-50">Flux récents</p>
          </div>
        </div>
      </div>

      {/* Liste avec Skeleton State */}
      <div className="space-y-1">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 w-full rounded-2xl animate-pulse bg-[#251C1440] mb-2" />
          ))
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[10px] font-black text-[#9A8060] uppercase tracking-widest opacity-30">Aucun mouvement</p>
          </div>
        ) : (
          transactions.map((t) => {
            const color = CATEGORY_COLORS[t.category as keyof typeof CATEGORY_COLORS] ?? "#9A8060";
            const isIncome = t.type === "income";
            const isConfirming = confirmingId === t.id;

            return (
              <div
                key={t.id}
                onClick={() => onEdit(t)}
                className="group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl transition-all duration-300 hover:bg-[#251C1480] border border-transparent hover:border-[#3A281840] cursor-pointer relative"
              >
                {/* Icône de Flux Dynamique */}
                <div
                  className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center shrink-0 transition-all"
                  style={{
                    background: isConfirming ? "rgba(239, 68, 68, 0.1)" : `${color}10`,
                    border: `1px solid ${isConfirming ? "rgba(239, 68, 68, 0.3)" : `${color}20`}`,
                  }}
                >
                  {isConfirming ? (
                    <AlertCircle size={16} className="text-red-500 animate-pulse" />
                  ) : isIncome ? (
                    <ArrowUpRight size={16} className="text-[#4A8A6A]" />
                  ) : (
                    <ArrowDownRight size={16} className="text-[#D4522A]" />
                  )}
                </div>

                {/* Détails de la transaction */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs md:text-sm font-bold truncate transition-colors ${isConfirming ? 'text-red-400' : 'text-[#F2E8D8]'}`}>
                    {isConfirming ? "Supprimer ce flux ?" : t.label}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#0E0B08] border border-[#3A281860]" style={{ color: isConfirming ? '#ef4444' : color }}>
                      {t.category}
                    </span>
                  </div>
                </div>

                {/* Montant & Actions Rapides */}
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                  {!isConfirming && (
                    <p className={`text-xs md:text-sm font-black tabular-nums ${isIncome ? 'text-[#00E676]' : 'text-[#FF4D4D]'}`}>
                      {isIncome ? "+" : "−"}{formatAmount(t.amount)}
                    </p>
                  )}
                  
                  <button
                    onClick={(e) => handleDeleteClick(e, t.id)}
                    className={`h-9 px-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold text-[10px] uppercase tracking-tighter ${
                      isConfirming 
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/20 px-4" 
                      : "text-[#9A8060] hover:bg-red-500/10 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100"
                    }`}
                  >
                    {isConfirming ? "Confirmer" : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

export default RecentTransactions;