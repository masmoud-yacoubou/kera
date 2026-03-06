/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Transaction } from "@/types";
import { groupByMonth } from "@/lib/utils";
import { BarChart2 } from "lucide-react";

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface Props {
  transactions: Transaction[];
  formatAmount: (n: number) => string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: readonly any[];
  label?: string | number;
  formatAmount: (n: number) => string;
}

// ─────────────────────────────────────────────
// Tooltip personnalisé
// Reçoit formatAmount via wrapper arrow function
// ─────────────────────────────────────────────
function CustomTooltip({ active, payload, label, formatAmount }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="px-3 py-2.5 rounded-xl text-sm space-y-1"
      style={{
        background: "var(--carte)",
        border: "1px solid var(--bordure)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
      }}
    >
      <p
        className="text-[11px] uppercase tracking-wider mb-2"
        style={{ color: "var(--muted)" }}
      >
        {String(label ?? "")}
      </p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: p.color }}
            aria-hidden="true"
          />
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {p.name}
          </span>
          <span
            className="text-xs font-semibold ml-auto pl-4 tabular-nums"
            style={{ color: "var(--texte)" }}
          >
            {formatAmount(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Composant principal : BarChartWidget
// ─────────────────────────────────────────────
export default function BarChartWidget({ transactions, formatAmount }: Props) {
  const data = groupByMonth(transactions);
  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expenses]), 1);

  return (
    <div
      className="rounded-[2rem] p-6 transition-all duration-500"
      style={{
        background: "linear-gradient(145deg, var(--carte) 0%, var(--carte-2) 100%)",
        border: "1px solid var(--bordure-40)",
      }}
    >
      {/* ── Header ──────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">

          {/* Icône */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "var(--or-08)",
              border: "1px solid var(--or-20)",
            }}
            aria-hidden="true"
          >
            <BarChart2 size={16} style={{ color: "var(--or)" }} />
          </div>

          {/* Titre */}
          <div>
            <h3
              className="text-sm font-bold tracking-tight"
              style={{
                color: "var(--texte)",
                fontFamily: "var(--font-sora)",
              }}
            >
              Flux de Trésorerie
            </h3>
            <p
              className="text-[10px] font-medium"
              style={{ color: "var(--muted)" }}
            >
              Comparatif mensuel
            </p>
          </div>
        </div>

        {/* Légende In / Out */}
        <div
          className="flex items-center gap-4 px-3 py-1.5 rounded-full"
          style={{
            background: "var(--fond-40)",
            border: "1px solid var(--bordure-20)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--succes)" }}
              aria-hidden="true"
            />
            <span
              className="text-[9px] font-bold uppercase"
              style={{ color: "var(--muted)" }}
            >
              In
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent)" }}
              aria-hidden="true"
            />
            <span
              className="text-[9px] font-bold uppercase"
              style={{ color: "var(--muted)" }}
            >
              Out
            </span>
          </div>
        </div>
      </div>

      {/* ── Graphique ────────────────────────────── */}
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={6}
            margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
          >
            {/* Gradients — les couleurs de stop sont fixes car
                les defs SVG ne supportent pas les CSS variables */}
            <defs>
              <linearGradient id="barIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#4A8A6A" stopOpacity={1}   />
                <stop offset="100%" stopColor="#4A8A6A" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#D4522A" stopOpacity={1}   />
                <stop offset="100%" stopColor="#D4522A" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#3A281820"
              strokeDasharray="8 8"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "var(--muted)", fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis hide domain={[0, maxVal * 1.2]} />
            <Tooltip
              content={(props) => (
                <CustomTooltip {...props} formatAmount={formatAmount} />
              )}
              cursor={{ fill: "var(--or-08)", radius: 12 } as any}
              animationDuration={200}
            />
            <Bar
              dataKey="income"
              fill="url(#barIncome)"
              radius={[6, 6, 2, 2]}
              name="Revenus"
              barSize={12}
            />
            <Bar
              dataKey="expenses"
              fill="url(#barExpense)"
              radius={[6, 6, 2, 2]}
              name="Dépenses"
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}