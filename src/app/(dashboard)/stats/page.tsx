/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransactions } from "@/context/TransactionsContext";
import { usePreferences } from "@/hooks/usePreferences";
import { CATEGORY_COLORS, CATEGORIES } from "@/types";
import { groupByCategory, groupByMonth } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";
import {
  TrendingUp, TrendingDown, Wallet, Target,
  PieChart as PieIcon, BarChart3,
} from "lucide-react";

// ─────────────────────────────────────────────
// Styles partagés — définis en dehors du composant
// pour éviter les recréations à chaque render
// ─────────────────────────────────────────────
const cardStyle = {
  background: "linear-gradient(145deg, var(--carte), var(--surface))",
  border: "1px solid var(--bordure-30)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
};

// Note : tooltipStyle utilise des valeurs statiques car recharts
// n'injecte pas les styles dans un contexte React — les CSS
// variables ne sont pas résolues dans cet objet de style
const tooltipStyle = {
  backgroundColor: "#1A1410",
  border: "1px solid #3A2818",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
};
const tooltipItemStyle = {
  color: "#F2E8D8",
  fontSize: "11px",
  fontWeight: "900" as const,
};

// ─────────────────────────────────────────────
// Sous-composant : KPI card
// ─────────────────────────────────────────────
function KpiCard({
  label, value, color, icon,
}: {
  label: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 transition-all border"
      style={{
        ...cardStyle,
        borderColor: "var(--bordure-30)",
      }}
      aria-label={`${label} : ${value}`}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--or-20)"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--bordure-30)"}
    >
      {/* Icône + label */}
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <div
          className="p-1.5 rounded-lg shrink-0"
          style={{ background: `${color}15`, color }}
          aria-hidden="true"
        >
          {icon}
        </div>
        <p
          className="text-[9px] sm:text-[10px] uppercase tracking-widest font-black truncate"
          style={{ color: "var(--muted)" }}
        >
          {label}
        </p>
      </div>

      {/* Valeur */}
      <p
        className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter tabular-nums truncate"
        style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
      >
        {value}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sous-composant : état vide graphique
// ─────────────────────────────────────────────
function ChartEmpty() {
  return (
    <div className="h-full flex items-center justify-center">
      <p
        className="text-[10px] font-black uppercase tracking-widest opacity-30"
        style={{ color: "var(--muted)" }}
      >
        Aucune donnée
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sous-composant : barre de progression catégorie
// ─────────────────────────────────────────────
function CategoryBar({
  category, total, pct, color, formatAmount,
}: {
  category: string;
  total: number;
  pct: number;
  color: string;
  formatAmount: (n: number) => string;
}) {
  const pctClamped = Math.max(0, Math.min(pct, 100));

  return (
    <div className="group">
      {/* Label + montant + pourcentage */}
      <div className="flex justify-between items-end mb-2 sm:mb-3 px-1">
        <div className="space-y-0.5 min-w-0 mr-4">
          <p
            className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] transition-colors truncate"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--texte)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
          >
            {category}
          </p>
          <p
            className="text-xs sm:text-sm font-bold tabular-nums"
            style={{ color: "var(--texte)" }}
          >
            {formatAmount(total)}
          </p>
        </div>
        <p
          className="text-[9px] sm:text-[10px] font-black opacity-80 tabular-nums shrink-0"
          style={{ color: "var(--or)" }}
        >
          {pct.toFixed(0)}%
        </p>
      </div>

      {/* Barre */}
      <div
        role="progressbar"
        aria-valuenow={pctClamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${category} : ${pct.toFixed(0)}% des dépenses`}
        className="h-1 w-full rounded-full overflow-hidden"
        style={{
          background: "var(--fond)",
          border: "1px solid var(--bordure-20)",
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${pctClamped}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}30`,
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page principale : Statistiques
// ─────────────────────────────────────────────
export default function StatsPage() {
  const { transactions, totalIncome, totalExpenses, balance } = useTransactions();
  const { formatAmount } = usePreferences();

  const pieData = groupByCategory(transactions);
  const barData = groupByMonth(transactions);

  const savingsRate = totalIncome > 0
    ? Math.max(0, ((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
    : "0";

  // KPIs — couleurs hardcodées car passées dans des dégradés inline
  const kpis = [
    { label: "Revenus",  value: formatAmount(totalIncome),   color: "#4A8A6A", icon: <TrendingUp  size={14} aria-hidden="true" /> },
    { label: "Dépenses", value: formatAmount(totalExpenses), color: "#D4522A", icon: <TrendingDown size={14} aria-hidden="true" /> },
    { label: "Solde",    value: formatAmount(balance),       color: "#C8A050", icon: <Wallet       size={14} aria-hidden="true" /> },
    { label: "Épargne",  value: `${savingsRate}%`,           color: "#9A8060", icon: <Target       size={14} aria-hidden="true" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6 md:space-y-8 pb-24 px-4 md:px-6">

      {/* ── Header ──────────────────────────────── */}
      <div className="flex flex-col gap-1 pt-2 md:pt-0">
        <h1
          className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight"
          style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
        >
          Statistiques
        </h1>
        <p
          className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] opacity-80"
          style={{ color: "var(--muted)" }}
        >
          Analyse de santé financière
        </p>
      </div>

      {/* ── KPIs ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* ── Graphiques ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">

        {/* Pie chart */}
        <div className="rounded-[1.75rem] sm:rounded-[2rem] p-5 sm:p-6 md:p-8" style={cardStyle}>
          <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-8">
            <PieIcon size={16} style={{ color: "var(--or)" }} aria-hidden="true" />
            <h3
              className="text-xs sm:text-sm font-bold uppercase tracking-tighter"
              style={{ color: "var(--texte)" }}
            >
              Répartition
            </h3>
          </div>

          <div className="h-[240px] sm:h-[280px] md:h-[320px] w-full">
            {pieData.length === 0 ? <ChartEmpty /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="total"
                    nameKey="category"
                    cx="50%" cy="45%"
                    innerRadius="40%" outerRadius="55%"
                    paddingAngle={8} stroke="none"
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.category}
                        fill={CATEGORY_COLORS[entry.category as keyof typeof CATEGORY_COLORS] ?? "#9A8060"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    itemStyle={tooltipItemStyle}
                    formatter={(value: any) => [formatAmount(Number(value) || 0), ""]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={6}
                    formatter={(value) => (
                      <span
                        className="text-[9px] sm:text-[10px] font-black uppercase px-1"
                        style={{ color: "var(--muted)" }}
                      >
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bar chart */}
        <div className="rounded-[1.75rem] sm:rounded-[2rem] p-5 sm:p-6 md:p-8" style={cardStyle}>
          <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-8">
            <BarChart3 size={16} style={{ color: "var(--or)" }} aria-hidden="true" />
            <h3
              className="text-xs sm:text-sm font-bold uppercase tracking-tighter"
              style={{ color: "var(--texte)" }}
            >
              Flux de trésorerie
            </h3>
          </div>

          <div className="h-[240px] sm:h-[280px] md:h-[320px] w-full">
            {barData.length === 0 ? <ChartEmpty /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#3A2818"
                    opacity={0.15}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false} tickLine={false}
                    // fill hardcodé : recharts n'accepte pas CSS variables dans tick
                    tick={{ fill: "#9A8060", fontSize: 9, fontWeight: 900 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    axisLine={false} tickLine={false}
                    tick={{ fill: "#9A8060", fontSize: 9 }}
                    width={40}
                  />
                  <Tooltip
                    cursor={{ fill: "#C8A05008" }}
                    contentStyle={tooltipStyle}
                    itemStyle={tooltipItemStyle}
                    formatter={(value: any) => [formatAmount(Number(value) || 0), ""]}
                  />
                  {/* fill SVG — CSS variables non supportées */}
                  <Bar dataKey="income"   fill="#4A8A6A" radius={[4,4,0,0]} barSize={10} name="Revenus"  />
                  <Bar dataKey="expenses" fill="#D4522A" radius={[4,4,0,0]} barSize={10} name="Dépenses" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* ── Analyse catégories ───────────────────── */}
      <div className="rounded-[1.75rem] sm:rounded-[2rem] p-5 sm:p-7 md:p-10" style={cardStyle}>
        <div className="mb-6 sm:mb-10">
          <h3
            className="text-base sm:text-lg font-bold tracking-tight"
            style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
          >
            Analyse des sorties
          </h3>
          <p
            className="text-[9px] sm:text-[11px] mt-1 font-medium uppercase tracking-widest opacity-60"
            style={{ color: "var(--muted)" }}
          >
            Répartition du poids financier par poste
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 md:gap-x-16 gap-y-6 sm:gap-y-8">
          {CATEGORIES.filter((c) => c !== "Revenus").map((cat) => {
            const total = transactions
              .filter((t) => t.type === "expense" && t.category === cat)
              .reduce((acc, t) => acc + t.amount, 0);
            const pct   = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
            const color = CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] ?? "#9A8060";

            return (
              <CategoryBar
                key={cat}
                category={cat}
                total={total}
                pct={pct}
                color={color}
                formatAmount={formatAmount}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}