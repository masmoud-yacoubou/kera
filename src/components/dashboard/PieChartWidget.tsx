/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Transaction, CATEGORY_COLORS } from "@/types";
import { groupByCategory } from "@/lib/utils";
import { PieChart as PieIcon } from "lucide-react";

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface Props {
  transactions: Transaction[];
  formatAmount: (n: number) => string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  formatAmount: (n: number) => string;
}

// ─────────────────────────────────────────────
// Tooltip personnalisé
// ─────────────────────────────────────────────
function CustomTooltip({ active, payload, formatAmount }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { category, total } = payload[0].payload;
  const color = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ?? "#9A8060";

  return (
    <div
      className="px-4 py-2.5 rounded-2xl border backdrop-blur-xl shadow-2xl"
      style={{
        background: "var(--carte)",
        borderColor: `${color}40`,
      }}
    >
      <p
        className="text-[10px] font-black uppercase tracking-widest mb-1"
        style={{ color: "var(--muted)" }}
      >
        {category}
      </p>
      <p
        className="text-sm font-bold tabular-nums"
        style={{ color: "var(--texte)" }}
      >
        {formatAmount(total)}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Composant principal : PieChartWidget
// ─────────────────────────────────────────────
export default function PieChartWidget({ transactions, formatAmount }: Props) {
  const data = groupByCategory(transactions);
  const total = data.reduce((acc, d) => acc + d.total, 0);
  const sortedData = [...data].sort((a, b) => b.total - a.total);

  return (
    <div
      className="rounded-[2rem] p-6 h-full transition-all duration-500"
      style={{
        background: "linear-gradient(145deg, var(--carte) 0%, var(--carte-2) 100%)",
        border: "1px solid var(--bordure-40)",
      }}
    >
      {/* ── Header ──────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "var(--accent-10)",
            border: "1px solid var(--accent-20)",
          }}
          aria-hidden="true"
        >
          <PieIcon size={16} style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h3
            className="text-sm font-bold tracking-tight"
            style={{
              color: "var(--texte)",
              fontFamily: "var(--font-sora)",
            }}
          >
            Répartition
          </h3>
          <p
            className="text-[10px] font-medium uppercase tracking-tighter opacity-60"
            style={{ color: "var(--muted)" }}
          >
            Dépenses par catégorie
          </p>
        </div>
      </div>

      {/* ── État vide ────────────────────────────── */}
      {sortedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center border border-dashed"
            style={{
              background: "var(--surface)",
              borderColor: "var(--bordure-40)",
            }}
            aria-hidden="true"
          >
            <PieIcon size={24} style={{ color: "var(--bordure)" }} />
          </div>
          <p
            className="text-xs font-bold uppercase tracking-widest text-center"
            style={{ color: "var(--muted)" }}
          >
            Aucune donnée
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">

          {/* ── Donut chart ──────────────────────── */}
          <div className="relative h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sortedData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={92}
                  paddingAngle={8}
                  strokeWidth={0}
                >
                  {sortedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        CATEGORY_COLORS[entry.category as keyof typeof CATEGORY_COLORS]
                        ?? "#9A8060"
                      }
                      className="hover:opacity-80 transition-opacity outline-none cursor-crosshair"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip formatAmount={formatAmount} />}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centre du donut — total global */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center"
              aria-label={`Total : ${formatAmount(total)}`}
            >
              <span
                className="text-[9px] font-black uppercase tracking-[0.3em] mb-1 opacity-50"
                style={{ color: "var(--muted)" }}
              >
                Total
              </span>
              <span
                className="text-xl font-black leading-tight tabular-nums"
                style={{
                  color: "var(--texte)",
                  fontFamily: "var(--font-sora)",
                }}
              >
                {formatAmount(total)}
              </span>
            </div>
          </div>

          {/* ── Légende avec barres de poids ─────── */}
          <div className="space-y-5 px-1" role="list" aria-label="Répartition par catégorie">
            {sortedData.map((entry) => {
              const color =
                CATEGORY_COLORS[entry.category as keyof typeof CATEGORY_COLORS]
                ?? "#9A8060";
              const pct = Math.round((entry.total / total) * 100);

              return (
                <div
                  key={entry.category}
                  className="group"
                  role="listitem"
                >
                  {/* Label + pourcentage */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: color }}
                        aria-hidden="true"
                      />
                      <span
                        className="text-[11px] font-bold uppercase tracking-tight transition-colors"
                        style={{ color: "var(--muted)" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "var(--texte)"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                      >
                        {entry.category}
                      </span>
                    </div>
                    <span
                      className="text-[11px] font-black tabular-nums"
                      style={{ color: "var(--texte)" }}
                    >
                      {pct}%
                    </span>
                  </div>

                  {/* Barre de progression */}
                  <div
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${entry.category} : ${pct}%`}
                    className="h-1 w-full rounded-full overflow-hidden"
                    style={{
                      background: "var(--fond)",
                      border: "1px solid var(--bordure-20)",
                    }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}