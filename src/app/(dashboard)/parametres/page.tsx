"use client";

import { useState } from "react";
import { usePreferences } from "@/hooks/usePreferences";
import { useTransactions } from "@/context/TransactionsContext";
import { useAuth } from "@/hooks/useAuth";
import { Currency, CURRENCIES } from "@/types";
import { Check, Download, User, Settings2, Database, Info } from "lucide-react";

export default function ParametresPage() {
  const { preferences, updatePreferences } = usePreferences();
  const { transactions } = useTransactions();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const cardStyle = {
    background: "linear-gradient(145deg, #1C1610, #1A1410)",
    border: "1px solid #3A281830",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  };

  const handleUpdate = async (updates: Partial<{ currency: Currency; month_start_day: number }>) => {
    await updatePreferences(updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportCSV = () => {
    const header = "Date,Libellé,Catégorie,Type,Montant\n";
    const rows = transactions
      .map((t) =>
        `${t.date},"${t.label}",${t.category},${t.type === "income" ? "Entrée" : "Sortie"},${t.amount}`
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
    <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 pb-20 px-4 md:px-0">
      <div className="pt-4 md:pt-0">
        <h1 className="text-2xl font-bold text-[#F2E8D8]" style={{ fontFamily: "var(--font-sora)" }}>
          Paramètres
        </h1>
        <p className="text-xs text-[#9A8060] font-medium uppercase tracking-widest mt-1 opacity-60">
          Configuration de votre espace
        </p>
      </div>

      {/* Section Compte */}
      <div className="rounded-[2rem] p-5 md:p-6 transition-all" style={cardStyle}>
        <div className="flex items-center gap-3 mb-6">
          <User size={18} className="text-[#C8A050]" />
          <h2 className="text-base font-semibold text-[#F2E8D8]" style={{ fontFamily: "var(--font-sora)" }}>
            Profil
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[#0E0B08]/40 border border-[#3A281830]">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#C8A05010] border border-[#C8A05020] shrink-0">
            <span className="text-xl font-bold text-[#C8A050]">
              {user?.email?.substring(0, 2).toUpperCase() ?? "?"}
            </span>
          </div>
          <div className="text-center sm:text-left overflow-hidden w-full">
            <p className="text-sm font-medium text-[#F2E8D8] truncate">{user?.email}</p>
            <p className="text-[10px] uppercase tracking-wider text-[#9A8060] font-bold mt-0.5">Utilisateur Kera</p>
          </div>
        </div>
      </div>

      {/* Section Préférences */}
      <div className="rounded-[2rem] p-5 md:p-6 space-y-8" style={cardStyle}>
        <div className="flex items-center gap-3">
          <Settings2 size={18} className="text-[#C8A050]" />
          <h2 className="text-base font-semibold text-[#F2E8D8]" style={{ fontFamily: "var(--font-sora)" }}>
            Préférences d&apos;affichage
          </h2>
        </div>

        {/* Choix de la Devise */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9A8060]">
            Devise de référence
          </label>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2.5">
            {CURRENCIES.map((c) => {
              const isActive = preferences?.currency === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => handleUpdate({ currency: c.code })}
                  className={`py-4 px-2 rounded-2xl transition-all border group relative overflow-hidden ${
                    isActive
                      ? "bg-[#D4522A10] border-[#D4522A50] text-[#D4522A] shadow-[0_0_20px_#D4522A08]"
                      : "bg-[#0E0B08]/40 border-[#3A281830] text-[#9A8060] hover:border-[#C8A05030]"
                  }`}
                >
                  <span className={`block text-xl mb-0.5 transition-colors ${isActive ? "text-[#D4522A]" : "text-[#F2E8D8]"}`}>
                    {c.symbol}
                  </span>
                  <span className="block text-[10px] font-black uppercase tracking-tighter opacity-70">
                    {c.code}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-3 p-4 rounded-2xl bg-[#C8A05008] border border-[#C8A05015]">
            <Info size={16} className="text-[#C8A050] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#9A8060] leading-relaxed">
              Le changement de devise modifie uniquement le <span className="text-[#C8A050] font-bold">symbole visuel</span>. 
              Aucune conversion automatique n&apos;est effectuée sur vos montants enregistrés.
            </p>
          </div>
        </div>

        {/* Début du cycle mensuel */}
        <div className="space-y-4 pt-6 border-t border-[#3A281820]">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9A8060]">
            Jour de réinitialisation mensuelle
          </label>
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
            {[1, 5, 10, 15, 20, 25].map((day) => {
              const isActive = preferences?.month_start_day === day;
              return (
                <button
                  key={day}
                  onClick={() => handleUpdate({ month_start_day: day })}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl text-sm font-black transition-all border ${
                    isActive
                      ? "bg-[#D4522A] text-white border-transparent shadow-[0_8px_16px_#D4522A30]"
                      : "bg-[#0E0B08]/40 border-[#3A281830] text-[#9A8060] hover:border-[#C8A05030]"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-2 text-[#4A8A6A] text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-1">
            <Check size={14} strokeWidth={3} />
            <span>Modifications enregistrées</span>
          </div>
        )}
      </div>

      {/* Section Export Data */}
      <div className="rounded-[2rem] p-5 md:p-6" style={cardStyle}>
        <div className="flex items-center gap-3 mb-6">
          <Database size={18} className="text-[#C8A050]" />
          <h2 className="text-base font-semibold text-[#F2E8D8]" style={{ fontFamily: "var(--font-sora)" }}>
            Données & Export
          </h2>
        </div>
        <div className="p-5 rounded-2xl bg-[#0E0B08]/40 border border-[#3A281830]">
          <p className="text-xs md:text-sm text-[#9A8060] mb-5 leading-relaxed">
            Téléchargez l&apos;intégralité de votre historique au format CSV pour l&apos;importer dans Excel ou Google Sheets.
          </p>
          <button
            onClick={exportCSV}
            disabled={transactions.length === 0}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#D4522A] text-white text-xs font-black uppercase tracking-widest hover:bg-[#b04322] disabled:opacity-20 disabled:grayscale transition-all shadow-lg active:scale-95"
          >
            <Download size={18} />
            Exporter {transactions.length} transactions
          </button>
        </div>
      </div>
    </div>
  );
}