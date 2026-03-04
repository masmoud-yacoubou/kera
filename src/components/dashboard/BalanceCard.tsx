"use client";

import { useState, memo } from "react";
import { 
  Eye, 
  EyeOff, 
  Wallet, 
  Trophy, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";

interface Props {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  formatAmount: (n: number) => string;
  loading: boolean;
}

/**
 * Composant vitrine de Kera. 
 * Affiche le solde global, le taux d'épargne et les flux entrants/sortants.
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

  // Calcul du taux d'épargne avec sécurité
  const savingsRate = totalIncome > 0
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
    : 0;

  const isPositive = balance >= 0;

  return (
    <div
      className="relative rounded-[2.5rem] p-8 overflow-hidden transition-all duration-500"
      style={{
        background: "linear-gradient(135deg, #1C1610 0%, #161008 100%)",
        border: "1px solid #3A281840",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Effet visuel dynamique selon l'état du solde */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-20 transition-colors duration-700"
        style={{ background: isPositive ? "#C8A050" : "#D4522A" }}
      />

      {/* Header : Identité & Confidentialité */}
      <div className="relative flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#C8A05008] border border-[#C8A05020]">
            <Wallet size={18} className="text-[#C8A050]" />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#9A8060] uppercase tracking-[0.2em]">
              Patrimoine Disponible
            </p>
            <p className="text-xs text-[#F2E8D8]/40 font-medium">Solde temps réel</p>
          </div>
        </div>
        
        <button
          onClick={() => setHidden(!hidden)}
          aria-label={hidden ? "Afficher le solde" : "Masquer le solde"}
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#9A8060] hover:text-[#F2E8D8] transition-all bg-[#0E0B08]/40 border border-[#3A281860] hover:border-[#C8A05040]"
        >
          {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Affichage du Solde avec Skeleton Support */}
      <div className="relative mb-8 min-h-[64px] flex items-center">
        {loading ? (
          <div className="h-12 w-3/4 rounded-2xl animate-pulse bg-[#3A281840]" />
        ) : (
          <p
            className="text-5xl md:text-6xl font-black tracking-tighter transition-all duration-300"
            style={{
              fontFamily: "var(--font-sora)",
              background: hidden
                ? "none"
                : isPositive
                  ? "linear-gradient(135deg, #F2E8D8 30%, #C8A050 100%)"
                  : "linear-gradient(135deg, #F2E8D8 30%, #D4522A 100%)",
              WebkitBackgroundClip: hidden ? "none" : "text",
              WebkitTextFillColor: hidden ? "#3A2818" : "transparent",
              color: hidden ? "#3A2818" : undefined,
            }}
          >
            {hidden ? mask : formatAmount(balance)}
          </p>
        )}
      </div>

      {/* Jauge de Capacité d'Épargne */}
      {!hidden && !loading && totalIncome > 0 && (
        <div className="relative space-y-3 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-[#9A8060]">
              <Trophy size={12} className={savingsRate >= 20 ? "text-[#4A8A6A]" : "text-[#9A8060]"} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Capacité d&apos;épargne</span>
            </div>
            <span className={`text-sm font-black ${savingsRate >= 20 ? "text-[#4A8A6A]" : "text-[#D4522A]"}`}>
              {savingsRate}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#0E0B08] rounded-full overflow-hidden border border-[#3A281820]">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${Math.max(0, Math.min(savingsRate, 100))}%`,
                background: savingsRate >= 20
                  ? "linear-gradient(90deg, #4A8A6A, #6AAA8A)"
                  : "linear-gradient(90deg, #D4522A, #E06040)",
                boxShadow: savingsRate >= 20 ? "0 0 12px rgba(74,138,106,0.3)" : "none"
              }}
            />
          </div>
        </div>
      )}

      {/* Mini-Widgets de Flux (Entrées / Sorties) */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="group p-4 rounded-3xl border transition-all duration-300 hover:bg-[#4A8A6A08]"
          style={{ background: "#0E0B0840", borderColor: "#4A8A6A20" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-[#4A8A6A15] flex items-center justify-center">
              <ArrowUpRight size={12} className="text-[#4A8A6A]" />
            </div>
            <span className="text-[9px] font-black text-[#9A8060] uppercase tracking-tighter">Entrées</span>
          </div>
          <p className="text-base font-bold text-[#4A8A6A] tabular-nums">
            {hidden ? "•••" : formatAmount(totalIncome)}
          </p>
        </div>

        <div
          className="group p-4 rounded-3xl border transition-all duration-300 hover:bg-[#D4522A08]"
          style={{ background: "#0E0B0840", borderColor: "#D4522A20" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-[#D4522A15] flex items-center justify-center">
              <ArrowDownRight size={12} className="text-[#D4522A]" />
            </div>
            <span className="text-[9px] font-black text-[#9A8060] uppercase tracking-tighter">Sorties</span>
          </div>
          <p className="text-base font-bold text-[#D4522A] tabular-nums">
            {hidden ? "•••" : formatAmount(totalExpenses)}
          </p>
        </div>
      </div>
    </div>
  );
});

export default BalanceCard;