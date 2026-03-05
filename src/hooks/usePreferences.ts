"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserPreferences, CURRENCIES } from "@/types";

/**
 * Hook gérant les préférences utilisateur (Devise, Thème, Cycle mensuel).
 * Centralise le formatage monétaire pour assurer la cohérence visuelle dans Kera.
 */
export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("user_preferences")
          .select("*")
          .single();

        if (error) throw error;
        setPreferences(data);
      } catch (err) {
        console.error("Erreur préférences:", err);
        // Fallback local si la DB est inaccessible ou entrée inexistante
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  /**
   * Met à jour les préférences en base de données et synchronise l'état local.
   */
  const updatePreferences = async (
    updates: Partial<Pick<UserPreferences, "currency" | "month_start_day" | "theme">>
  ) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_preferences")
        .update(updates)
        .eq("user_id", preferences?.user_id ?? "")
        .select()
        .single();

      if (error) throw error;
      setPreferences(data);
      return true;
    } catch (err) {
      console.error("Update Preferences Error:", err);
      return false;
    }
  };

  /**
   * Formate un montant numérique selon la devise choisie.
   * @param amount Le montant à formater
   */
  const formatAmount = (amount: number): string => {
    const code = preferences?.currency ?? "XOF";
    const currencyInfo = CURRENCIES.find((c) => c.code === code);
    const symbol = currencyInfo?.symbol ?? code;

    const formatted = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));

    const prefix = ["$"];
    if (prefix.includes(symbol)) return `${symbol}${formatted}`;
    return `${formatted} ${symbol}`;
  };

  return {
    preferences,
    loading,
    updatePreferences,
    formatAmount,
  };
}