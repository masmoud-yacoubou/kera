"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { Transaction, TransactionInsert } from "@/types";
import { toast } from "@/components/ui/Toast";
import { formatAmount } from "@/lib/utils";

interface TransactionsContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  addTransaction: (payload: TransactionInsert) => Promise<Transaction | null>;
  updateTransaction: (id: string, payload: Partial<TransactionInsert>) => Promise<Transaction | null>;
  deleteTransaction: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | null>(null);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (fetchError) throw fetchError;
      setTransactions(data ?? []);
    } catch (err) {
      console.error("Kera Fetch Error:", err);
      setError("Erreur lors du chargement des activités.");
      toast.error("Une erreur est survenue", (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const { balance, totalIncome, totalExpenses } = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        const amount = Number(t.amount);
        if (t.type === "income") {
          acc.totalIncome += amount;
          acc.balance += amount;
        } else {
          acc.totalExpenses += amount;
          acc.balance -= amount;
        }
        return acc;
      },
      { balance: 0, totalIncome: 0, totalExpenses: 0 }
    );
  }, [transactions]);

  const addTransaction = async (payload: TransactionInsert) => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setError("Session expirée. Veuillez vous reconnecter.");
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from("transactions")
        .insert({ ...payload, user_id: session.user.id })
        .select()
        .single();

      if (insertError) throw insertError;
      
      setTransactions((prev) => [data, ...prev]);
      toast.success("Transaction ajoutée", `${data.label} — ${formatAmount(data.amount)}`);
      return data;
    } catch (err) {
      console.error("Kera Insert Error:", err);
      setError("Impossible d'enregistrer la transaction.");
      toast.error("Une erreur est survenue", (err as Error).message);
      return null;
    }
  };

  const updateTransaction = async (id: string, payload: Partial<TransactionInsert>) => {
    try {
      const supabase = createClient();
      const { data, error: updateError } = await supabase
        .from("transactions")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      setTransactions((prev) => prev.map((t) => (t.id === id ? data : t)));
      return data;
    } catch (err) {
      console.error("Kera Update Error:", err);
      setError("Échec de la modification.");
      toast.error("Une erreur est survenue", (err as Error).message);
      return null;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success("Transaction supprimée");
      return true;
    } catch (err) {
      console.error("Kera Delete Error:", err);
      setError("Échec de la suppression.");
      toast.error("Une erreur est survenue", (err as Error).message);
      return false;
    }
  };

  return (
    <TransactionsContext.Provider value={{
      transactions, loading, error,
      balance, totalIncome, totalExpenses,
      addTransaction, updateTransaction, deleteTransaction,
      refetch: fetchTransactions,
    }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error("useTransactions doit être utilisé dans TransactionsProvider");
  return ctx;
}