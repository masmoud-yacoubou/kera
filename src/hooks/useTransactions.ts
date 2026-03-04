"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Transaction, TransactionInsert } from "@/types";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      setError("Erreur lors du chargement des transactions.");
    } else {
      setTransactions(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      setError(null);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        setError("Erreur lors du chargement des transactions.");
      } else {
        setTransactions(data ?? []);
      }
      setLoading(false);
    };

    loadTransactions();
  }, []);

  // --- AJOUTER ---
  const addTransaction = async (payload: TransactionInsert) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("transactions")
      .insert(payload)
      .select()
      .single();

    if (error) {
      setError("Erreur lors de l'ajout.");
      return null;
    }

    setTransactions((prev) => [data, ...prev]);
    return data;
  };

  // --- MODIFIER ---
  const updateTransaction = async (
    id: string,
    payload: Partial<TransactionInsert>
  ) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("transactions")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      setError("Erreur lors de la modification.");
      return null;
    }

    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? data : t))
    );
    return data;
  };

  // --- SUPPRIMER ---
  const deleteTransaction = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      setError("Erreur lors de la suppression.");
      return false;
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));
    return true;
  };

  // --- CALCULS ---
  const balance = transactions.reduce((acc, t) => {
    return t.type === "income" ? acc + t.amount : acc - t.amount;
  }, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  return {
    transactions,
    loading,
    error,
    balance,
    totalIncome,
    totalExpenses,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
}