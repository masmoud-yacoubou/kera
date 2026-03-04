"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

/**
 * Hook de gestion de l'authentification pour Kera.
 * Gère la session utilisateur, l'écoute des changements d'état et la déconnexion.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Récupération initiale de l'utilisateur avec vérification du token
    const initAuth = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Écouteur en temps réel pour le login, logout et rafraîchissement de token
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        // Redirection automatique si la session expire ou si l'utilisateur se déconnecte
        if (event === "SIGNED_OUT") {
          router.push("/login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  /**
   * Déconnecte l'utilisateur et nettoie la session locale.
   */
  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      // La redirection est gérée par onAuthStateChange (SIGNED_OUT)
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  /**
   * Génère des initiales à partir de l'email ou du nom de l'utilisateur.
   */
  const getInitials = useCallback((): string => {
    if (!user?.email) return "??";
    // Si tu ajoutes un champ 'full_name' dans metadata plus tard, on pourra l'utiliser ici
    return user.email.slice(0, 2).toUpperCase();
  }, [user]);

  return { 
    user, 
    loading, 
    signOut, 
    getInitials,
    isAuthenticated: !!user 
  };
}