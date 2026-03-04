"use client";

import { useState } from "react";
import { useTransactions } from "@/context/TransactionsContext";
import { usePreferences } from "@/hooks/usePreferences";
import { TransactionInsert } from "@/types";
import BalanceCard from "@/components/dashboard/BalanceCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import PieChartWidget from "@/components/dashboard/PieChartWidget";
import BarChartWidget from "@/components/dashboard/BarChartWidget";
import TransactionModal from "@/components/transactions/TransactionModal";
import FAB from "@/components/ui/FAB";
import { Sparkles, LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    transactions,
    loading,
    balance,
    totalIncome,
    totalExpenses,
    addTransaction,
    deleteTransaction,
  } = useTransactions();
  const { formatAmount } = usePreferences();

  const cardStyle = {
    background: "linear-gradient(145deg, #1C1610, #1A1410)",
    border: "1px solid #3A281830",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-6 md:space-y-10 pb-32 pt-4">
        
        {/* En-tête de bienvenue dynamique */}
        {!loading && transactions.length > 0 && (
          <div className="flex items-center gap-2.5 px-1 animate-in fade-in slide-in-from-left duration-700">
            <div className="w-6 h-6 rounded-lg bg-[#C8A05010] flex items-center justify-center border border-[#C8A05020]">
              <Sparkles size={12} className="text-[#C8A050]" />
            </div>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#9A8060] opacity-80">
              Analyse de performance financière
            </p>
          </div>
        )}

        {/* Section Solde : Impact visuel immédiat */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#D4522A10] to-[#C8A05010] rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000" />
          <div className="relative">
            <BalanceCard
              balance={balance}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              formatAmount={formatAmount}
              loading={loading}
            />
          </div>
        </section>

        {/* Grid Adaptatif : 1 col sur mobile, 12 cols sur desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Colonne Analyse (Graphiques) - Priorité haute sur mobile pour la vue d'ensemble */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              <div className="transition-all hover:translate-y-[-4px] duration-300">
                <PieChartWidget 
                  transactions={transactions} 
                  formatAmount={formatAmount} 
                />
              </div>
              <div className="transition-all hover:translate-y-[-4px] duration-300">
                <BarChartWidget
                  transactions={transactions}
                  formatAmount={formatAmount}
                />
              </div>
            </div>
          </div>

          {/* Colonne Transactions - Liste détaillée */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <RecentTransactions
              transactions={transactions.slice(0, 10)}
              formatAmount={formatAmount}
              loading={loading}
              onDelete={deleteTransaction}
              onEdit={() => {}} 
            />
          </div>
        </div>

        {/* Empty State : Si aucune donnée n'est présente */}
        {!loading && transactions.length === 0 && (
          <div
            className="rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden border border-[#3A281840]"
            style={cardStyle}
          >
            {/* Texture de fond discrète */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            
            <div className="w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 bg-[#1A1410] border border-[#3A2818] shadow-inner">
               <LayoutDashboard size={32} className="text-[#C8A050] opacity-40" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-[#F2E8D8] mb-4 tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
              Prêt à piloter ?
            </h2>
            <p className="text-sm md:text-base text-[#9A8060] max-w-sm mx-auto leading-relaxed font-medium">
              Votre cockpit financier est configuré. Il ne manque plus que vos premières données pour générer vos analyses.
            </p>
            
            <button 
              onClick={() => setModalOpen(true)}
              className="mt-10 px-10 py-4 rounded-2xl bg-[#D4522A] text-white text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#D4522A40] hover:bg-[#E85D35] transition-all hover:scale-105 active:scale-95"
            >
              Lancer ma première saisie
            </button>
          </div>
        )}
      </div>

      <FAB onClick={() => setModalOpen(true)} />

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={async (data: TransactionInsert) => {
          await addTransaction(data);
          setModalOpen(false);
        }}
      />
    </>
  );
}