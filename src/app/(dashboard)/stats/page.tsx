/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransactions } from "@/context/TransactionsContext";
import { usePreferences } from "@/hooks/usePreferences";
import { CATEGORY_COLORS, CATEGORIES } from "@/types";
import { groupByCategory, groupByMonth } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet, Target, PieChart as PieIcon, BarChart3 } from "lucide-react";

export default function StatsPage() {
  const { transactions, totalIncome, totalExpenses, balance } = useTransactions();
  const { formatAmount } = usePreferences();

  const pieData = groupByCategory(transactions);
  const barData = groupByMonth(transactions);

  const savingsRate =
    totalIncome > 0
      ? Math.max(0, ((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
      : "0";

  // Thème Sahara - Identique à la page paramètres
  const cardStyle = {
    background: "linear-gradient(145deg, #1C1610, #1A1410)",
    border: "1px solid var(--color-bordure)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 pb-24 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col gap-1 pt-4 md:pt-0">
        <h1 
          className="text-2xl md:text-3xl font-black text-[var(--color-texte)] tracking-tight" 
          style={{ fontFamily: "var(--font-sora)" }}
        >
          Statistiques
        </h1>
        <p className="text-[10px] md:text-xs text-[var(--color-muted)] font-bold uppercase tracking-[0.2em] opacity-80">
          Analyse de santé financière
        </p>
      </div>

      {/* KPIs - Grid Responsive */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Revenus", value: formatAmount(totalIncome), color: "var(--color-succes)", icon: <TrendingUp size={14} /> },
          { label: "Dépenses", value: formatAmount(totalExpenses), color: "var(--color-accent)", icon: <TrendingDown size={14} /> },
          { label: "Solde", value: formatAmount(balance), color: "var(--color-or)", icon: <Wallet size={14} /> },
          { label: "Épargne", value: `${savingsRate}%`, color: "var(--color-muted)", icon: <Target size={14} /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="rounded-3xl p-5 md:p-6 transition-all border border-transparent hover:border-[var(--color-or-soft)]" style={cardStyle}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg" style={{ background: `${color}15`, color }}>{icon}</div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] font-black">{label}</p>
            </div>
            <p className="text-xl md:text-2xl font-black text-[var(--color-texte)] tracking-tighter" style={{ fontFamily: "var(--font-sora)" }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Section Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pie Chart - Répartition */}
        <div className="rounded-[2rem] p-6 md:p-8" style={cardStyle}>
          <div className="flex items-center gap-3 mb-8">
            <PieIcon size={18} className="text-[var(--color-or)]" />
            <h3 className="text-sm font-bold text-[var(--color-texte)] uppercase tracking-tighter">Répartition</h3>
          </div>
          <div className="h-[280px] md:h-[320px] w-full">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[var(--color-muted)] text-[10px] font-black uppercase tracking-widest opacity-30">
                Aucune donnée
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="total"
                    nameKey="category"
                    cx="50%" cy="50%"
                    innerRadius={65} outerRadius={85}
                    paddingAngle={8} stroke="none"
                  >
                    {pieData.map((entry) => (
                      <Cell 
                        key={entry.category} 
                        fill={CATEGORY_COLORS[entry.category as keyof typeof CATEGORY_COLORS] ?? "var(--color-carte)"} 
                        className="hover:opacity-80 transition-all outline-none border-none cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-bordure)', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: 'var(--color-texte)', fontSize: '11px', fontWeight: '900' }}
                    formatter={(value: any) => [formatAmount(Number(value) || 0), ""]}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    iconType="circle" 
                    formatter={(value) => <span className="text-[10px] text-[var(--color-muted)] font-black uppercase px-2">{value}</span>} 
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bar Chart - Flux */}
        <div className="rounded-[2rem] p-6 md:p-8" style={cardStyle}>
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 size={18} className="text-[var(--color-or)]" />
            <h3 className="text-sm font-bold text-[var(--color-texte)] uppercase tracking-tighter">Flux de trésorerie</h3>
          </div>
          <div className="h-[280px] md:h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-bordure)" opacity={0.15} vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-muted)', fontSize: 10, fontWeight: '900' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-muted)', fontSize: 10 }} />
                <Tooltip 
                   cursor={{ fill: 'var(--color-or-soft)' }}
                   contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-bordure)', borderRadius: '16px' }}
                   formatter={(value: any) => [formatAmount(Number(value) || 0), ""]}
                />
                <Bar dataKey="income" fill="var(--color-succes)" radius={[4, 4, 0, 0]} barSize={10} name="Revenus" />
                <Bar dataKey="expenses" fill="var(--color-terracotta)" radius={[4, 4, 0, 0]} barSize={10} name="Dépenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Analyse par catégorie - Barres de progression */}
      <div className="rounded-[2rem] p-6 md:p-10 shadow-2xl" style={cardStyle}>
        <div className="mb-10 text-center md:text-left">
          <h3 className="text-lg font-bold text-[var(--color-texte)] tracking-tight">Analyse des sorties</h3>
          <p className="text-[11px] text-[var(--color-muted)] mt-1 font-medium uppercase tracking-widest opacity-60">Répartition du poids financier par poste</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
          {CATEGORIES.filter((c) => c !== "Revenus").map((cat) => {
            const total = transactions
              .filter((t) => t.type === "expense" && t.category === cat)
              .reduce((acc, t) => acc + t.amount, 0);

            const pct = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
            const color = CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] ?? "var(--color-muted)";

            return (
              <div key={cat} className="group">
                <div className="flex justify-between items-end mb-3 px-1">
                   <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--color-muted)] group-hover:text-[var(--color-texte)] transition-colors">{cat}</p>
                     <p className="text-sm font-bold text-[var(--color-texte)]">{formatAmount(total)}</p>
                   </div>
                   <p className="text-[10px] font-black text-[var(--color-or)] opacity-80">{pct.toFixed(0)}%</p>
                </div>
                <div className="h-1 w-full bg-[var(--color-fond)] rounded-full overflow-hidden border border-[var(--color-bordure)]">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: color,
                      boxShadow: `0 0 12px ${color}30`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}