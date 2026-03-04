/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Transaction } from "@/types";
import { CATEGORY_COLORS } from "@/types";
import { groupByCategory } from "@/lib/utils";
import { PieChart as PieIcon } from "lucide-react";

interface Props {
  transactions: Transaction[];
  formatAmount: (n: number) => string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  formatAmount: (n: number) => string;
}

function CustomTooltip({ active, payload, formatAmount }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { category, total } = payload[0].payload;
  const color = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ?? "#9A8060";

  return (
    <div
      className="px-4 py-2.5 rounded-2xl border backdrop-blur-xl shadow-2xl"
      style={{
        background: "rgba(28, 22, 16, 0.95)",
        borderColor: `${color}40`,
      }}
    >
      <p className="text-[10px] font-black text-[#9A8060] uppercase tracking-widest mb-1">{category}</p>
      <p className="text-sm font-bold text-[#F2E8D8]">
        {formatAmount(total)}
      </p>
    </div>
  );
}

export default function PieChartWidget({ transactions, formatAmount }: Props) {
  const data = groupByCategory(transactions);
  const total = data.reduce((acc, d) => acc + d.total, 0);
  const sortedData = [...data].sort((a, b) => b.total - a.total);

  return (
    <div
      className="rounded-[2rem] p-6 h-full transition-all duration-500"
      style={{
        background: "linear-gradient(145deg, #1C1610 0%, #161008 100%)",
        border: "1px solid #3A281840",
      }}
    >
      {/* Header simple et pro */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#D4522A08] border border-[#D4522A20]">
          <PieIcon size={16} className="text-[#D4522A]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#F2E8D8] tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
            Répartition
          </h3>
          <p className="text-[10px] text-[#9A8060] font-medium uppercase tracking-tighter opacity-60">Dépenses par catégorie</p>
        </div>
      </div>

      {sortedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center bg-[#1A1410] border border-[#3A281840] border-dashed">
            <PieIcon size={24} className="text-[#3A2818]" />
          </div>
          <p className="text-xs font-bold text-[#9A8060] uppercase tracking-widest text-center">Aucune donnée</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Zone Graphique Donut */}
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
                      fill={CATEGORY_COLORS[entry.category as keyof typeof CATEGORY_COLORS] ?? "#9A8060"}
                      className="hover:opacity-80 transition-opacity outline-none cursor-crosshair"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip formatAmount={formatAmount} />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centre informatif dynamique */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
              <span className="text-[9px] font-black text-[#9A8060] uppercase tracking-[0.3em] mb-1 opacity-50">Total</span>
              <span className="text-xl font-black text-[#F2E8D8] leading-tight" style={{ fontFamily: "var(--font-sora)" }}>
                {formatAmount(total)}
              </span>
            </div>
          </div>

          {/* Liste des catégories avec barres de poids */}
          <div className="space-y-5 px-1">
            {sortedData.map((entry) => {
              const color = CATEGORY_COLORS[entry.category as keyof typeof CATEGORY_COLORS] ?? "#9A8060";
              const pct = Math.round((entry.total / total) * 100);
              return (
                <div key={entry.category} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                       <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                       <span className="text-[11px] font-bold text-[#9A8060] group-hover:text-[#F2E8D8] transition-colors uppercase tracking-tight">
                         {entry.category}
                       </span>
                    </div>
                    <span className="text-[11px] font-black text-[#F2E8D8]">{pct}%</span>
                  </div>
                  <div className="h-1 w-full bg-[#0E0B08] rounded-full overflow-hidden border border-[#3A281815]">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.2)]"
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