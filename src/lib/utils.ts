import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Transaction, Category } from "@/types";

// Combiner les classes Tailwind proprement
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Grouper les transactions par catégorie (pour le camembert)
export function groupByCategory(
  transactions: Transaction[]
): { category: Category; total: number }[] {
  const map = new Map<Category, number>();

  transactions.forEach((t) => {
    if (t.type === "expense") {
      const current = map.get(t.category as Category) ?? 0;
      map.set(t.category as Category, current + t.amount);
    }
  });

  return Array.from(map.entries()).map(([category, total]) => ({
    category,
    total,
  }));
}

// Grouper par mois pour le graphique en barres (3 derniers mois)
export function groupByMonth(transactions: Transaction[]): {
  month: string;
  income: number;
  expenses: number;
}[] {
  const now = new Date();
  const months = [];

  for (let i = 2; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    });

    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return (
        tDate.getMonth() === date.getMonth() &&
        tDate.getFullYear() === date.getFullYear()
      );
    });

    months.push({
      month: key,
      income: monthTransactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0),
      expenses: monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0),
    });
  }

  return months;
}

// Formater une date en français
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
