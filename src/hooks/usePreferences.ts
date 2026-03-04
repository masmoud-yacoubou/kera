"use client";

import { useState, useEffect, useCallback } from "react";
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
   * @param showSign Si true, conserve le signe négatif (par défaut true)
   */
  const formatAmount = useCallback((amount: number, showSign = true): string => {
    const code = preferences?.currency ?? "EUR"; // Fallback de sécurité
    const currencyInfo = CURRENCIES.find((c) => c.code === code);
    const symbol = currencyInfo?.symbol ?? code;

    const valueToFormat = showSign ? amount : Math.abs(amount);

    // Utilisation de Intl pour un formatage propre (milliers, décimales)
    const formatted = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valueToFormat);

    // Détermination intelligente de la position du symbole
    // Liste extensible des devises avec préfixe
    const prefixSymbols = ["$", "CA$", "¥", "£", "₦", "GH₵", "R", "US$"];
    
    if (prefixSymbols.includes(symbol)) {
      return `${symbol}${formatted}`;
    }
    
    return `${formatted} ${symbol}`;
  }, [preferences?.currency]);

  return {
    preferences,
    loading,
    updatePreferences,
    formatAmount,
  };
}