"use client";

import { useState, useEffect } from "react";
import { useTransactions } from "@/context/TransactionsContext";
import { usePreferences } from "@/hooks/usePreferences";
import { CATEGORIES, Category } from "@/types";
import { CATEGORY_COLORS } from "@/types";
import { formatDate } from "@/lib/utils";
import { Trash2, Search, ArrowUpRight, ArrowDownRight, History, AlertCircle, X } from "lucide-react";
import TransactionModal from "@/components/transactions/TransactionModal";
import FAB from "@/components/ui/FAB";

export default function HistoriquePage() {
  const { transactions, loading, addTransaction, deleteTransaction } = useTransactions();
  const { formatAmount } = usePreferences();
  
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    if (confirmingId) {
      const timer = setTimeout(() => setConfirmingId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmingId]);

  const filtered = transactions.filter((t) => {
    const matchSearch = t.label.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || t.type === filterType;
    const matchCategory = filterCategory === "all" || t.category === filterCategory;
    return matchSearch && matchType && matchCategory;
  });

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 pb-32 pt-4">

        {/* Header Responsif */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#F2E8D8] tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
              Historique
            </h1>
            <p className="text-xs md:text-sm text-[#9A8060] font-medium mt-1">
              <span className="text-[#C8A050] font-bold">{filtered.length}</span> transaction{filtered.length > 1 ? "s" : ""} répertoriée{filtered.length > 1 ? "s" : ""}
            </p>
          </div>

          {(search || filterType !== "all" || filterCategory !== "all") && (
            <button
              onClick={() => { setSearch(""); setFilterType("all"); setFilterCategory("all"); }}
              className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all bg-[#D4522A10] text-[#D4522A] border border-[#D4522A20] hover:bg-[#D4522A20]"
            >
              <X size={12} /> Effacer les filtres
            </button>
          )}
        </div>

        {/* Barre de Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-[2rem] border border-[#3A281830]" style={{ background: "linear-gradient(145deg, #1C1610, #161008)" }}>
          <div className="md:col-span-5 relative group">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8060] group-focus-within:text-[#C8A050] transition-colors" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm bg-[#0E0B08] border border-[#3A2818] text-[#F2E8D8] focus:outline-none focus:border-[#C8A05050] transition-all"
            />
          </div>

          <div className="md:col-span-4 flex bg-[#0E0B08] p-1 rounded-2xl border border-[#3A2818]">
            {(["all", "income", "expense"] as const).map((t) => {
              const active = filterType === t;
              return (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                    active ? "bg-[#1C1610] text-[#C8A050] shadow-lg border border-[#3A2818]" : "text-[#9A8060] opacity-50"
                  }`}
                >
                  {t === "all" ? "Tout" : t === "income" ? "Entrées" : "Sorties"}
                </button>
              );
            })}
          </div>

          <div className="md:col-span-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as Category | "all")}
              className="w-full px-4 py-3 rounded-2xl text-xs font-bold bg-[#0E0B08] border border-[#3A2818] text-[#9A8060] focus:outline-none appearance-none cursor-pointer"
              style={{ colorScheme: "dark" }}
            >
              <option value="all">Catégories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Liste des Transactions */}
        <div className="rounded-[2.5rem] overflow-hidden border border-[#3A281830]" style={{ background: "linear-gradient(145deg, #1C1610, #161008)" }}>
          {loading ? (
             <div className="p-6 space-y-4">
               {[1, 2, 3, 4].map(i => <div key={i} className="h-16 w-full bg-[#3A281820] animate-pulse rounded-2xl" />)}
             </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center px-6">
              <div className="w-20 h-20 rounded-[2.5rem] bg-[#1A1410] border border-[#3A2818] flex items-center justify-center mb-6 opacity-40">
                <History size={32} className="text-[#9A8060]" />
              </div>
              <p className="text-sm font-bold text-[#9A8060] uppercase tracking-[0.2em]">Aucun résultat</p>
            </div>
          ) : (
            <div className="divide-y divide-[#3A281820]">
              {filtered.map((t) => {
                const color = CATEGORY_COLORS[t.category as keyof typeof CATEGORY_COLORS] ?? "#9A8060";
                const isIncome = t.type === "income";
                const isConfirming = confirmingId === t.id;

                return (
                  <div key={t.id} className={`flex items-center gap-3 md:gap-4 px-4 md:px-8 py-5 transition-all relative group ${isConfirming ? "bg-red-500/5" : "hover:bg-[#251C1440]"}`}>
                    
                    <div 
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all"
                      style={{ 
                        background: isConfirming ? "rgba(239, 68, 68, 0.1)" : `${color}08`, 
                        borderColor: isConfirming ? "rgba(239, 68, 68, 0.2)" : `${color}20` 
                      }}
                    >
                      {isConfirming ? (
                        <AlertCircle size={18} className="text-red-500 animate-pulse" />
                      ) : isIncome ? (
                        <ArrowUpRight size={18} className="text-[#4A8A6A]" />
                      ) : (
                        <ArrowDownRight size={18} className="text-[#D4522A]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs md:text-sm font-bold truncate tracking-tight transition-colors ${isConfirming ? 'text-red-400' : 'text-[#F2E8D8]'}`}>
                        {isConfirming ? "Voulez-vous supprimer ?" : t.label}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#0E0B08] border border-[#3A281860]" style={{ color: isConfirming ? '#ef4444' : color }}>
                          {t.category}
                        </span>
                        <span className="text-[10px] text-[#9A8060] font-medium opacity-60">· {formatDate(t.date)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6 shrink-0">
                      {!isConfirming && (
                        <p className={`text-xs md:text-sm font-black tabular-nums ${
  isIncome ? 'text-[#00E676]' : 'text-[#FF4D4D]'
}`}>
  {isIncome ? "+" : "-"}{formatAmount(t.amount)}
</p>
                      )}
                      
                      <button
                        onClick={() => handleDelete(t.id)}
                        className={`h-9 flex items-center justify-center rounded-xl transition-all duration-300 ${
                          isConfirming 
                          ? "bg-red-500 text-white px-4 text-[10px] font-black uppercase tracking-widest" 
                          : "w-9 text-[#9A8060] hover:bg-red-500/10 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100"
                        }`}
                      >
                        {isConfirming ? "Confirmer" : <Trash2 size={14} />}
                      </button>
                    </div>

                    <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: isConfirming ? "#ef4444" : color }} />
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