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

function CustomTooltip({ active, payload, label, formatAmount }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="px-3 py-2.5 rounded-xl text-sm space-y-1"
      style={{
        background: "#251C14",
        border: "1px solid #3A2818",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <p className="text-[11px] text-[#9A8060] uppercase tracking-wider mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-[#9A8060] text-xs">{p.name}</span>
          <span className="text-[#F2E8D8] text-xs font-semibold ml-auto pl-4">
            {formatAmount(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function BarChartWidget({ transactions, formatAmount }: Props) {
  const data = groupByMonth(transactions);
  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expenses]), 1);

  return (
    <div
      className="rounded-[2rem] p-6 group transition-all duration-500"
      style={{
        background: "linear-gradient(145deg, #1C1610 0%, #161008 100%)",
        border: "1px solid #3A281840",
      }}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#C8A05008] border border-[#C8A05020]">
            <BarChart2 size={16} className="text-[#C8A050]" />
          </div>
          <div>
            <h3
              className="text-sm font-bold text-[#F2E8D8] tracking-tight"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Flux de Trésorerie
            </h3>
            <p className="text-[10px] text-[#9A8060] font-medium">Comparatif mensuel</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#0E0B08]/40 px-3 py-1.5 rounded-full border border-[#3A281820]">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4A8A6A]" />
            <span className="text-[9px] font-bold text-[#9A8060] uppercase">In</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4522A]" />
            <span className="text-[9px] font-bold text-[#9A8060] uppercase">Out</span>
          </div>
        </div>
      </div>

      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={6}
            margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="barIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4A8A6A" stopOpacity={1} />
                <stop offset="100%" stopColor="#4A8A6A" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4522A" stopOpacity={1} />
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
              tick={{ fontSize: 10, fill: "#9A8060", fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis hide domain={[0, maxVal * 1.2]} />
            <Tooltip
              content={(props) => <CustomTooltip {...props} formatAmount={formatAmount} />}
              cursor={{ fill: "rgba(200, 160, 80, 0.03)", radius: 12 }}
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