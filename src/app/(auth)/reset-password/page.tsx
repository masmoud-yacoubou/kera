"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TrendingUp, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const handleReset = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) setError("Adresse email introuvable.");
    else setSent(true);
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "var(--body-bg)",
        backgroundImage: `
          radial-gradient(ellipse at 15% 15%, var(--body-radial-1) 0%, transparent 45%),
          radial-gradient(ellipse at 85% 85%, var(--body-radial-2) 0%, transparent 45%)
        `,
      }}
    >
      <div className="w-full max-w-md z-10">

        {/* ── Logo ────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="relative inline-flex mb-5">
            <div
              className="w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl"
              style={{
                background: "var(--accent)",
                boxShadow: "0 20px 40px var(--accent-20)",
              }}
            >
              <TrendingUp className="text-white" size={32} strokeWidth={2.5} aria-hidden="true" />
            </div>
            <div
              className="absolute inset-0 rounded-[2rem] scale-110"
              style={{ border: "2px solid var(--or-20)" }}
              aria-hidden="true"
            />
          </div>
          <h1
            className="text-5xl font-bold tracking-tight"
            style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
          >
            Kera
          </h1>
        </div>

        {/* ── Card ────────────────────────────────── */}
        <div
          className="rounded-[2.5rem] p-8"
          style={{
            background: "linear-gradient(145deg, var(--surface) 0%, var(--carte) 100%)",
            border: "1px solid var(--bordure-60)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.3), inset 0 1px 0 var(--or-08)",
          }}
        >
          {!sent ? (
            <>
              {/* Formulaire */}
              <div className="mb-8">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
                >
                  Mot de passe oublié
                </h2>
                <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Entrez votre email et nous vous enverrons un lien de réinitialisation.
                </p>
              </div>

              <div className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2.5 ml-1"
                    style={{ color: "var(--muted)" }}
                  >
                    Identifiant Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      aria-hidden="true"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--muted)" }}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleReset()}
                      placeholder="nom@exemple.com"
                      aria-label="Adresse email"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl focus:outline-none transition-all text-sm min-h-[52px]"
                      style={{
                        background: "var(--fond-40)",
                        border: "1px solid var(--bordure)",
                        color: "var(--texte)",
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "var(--or-30)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "var(--bordure)"}
                    />
                  </div>
                </div>

                {/* Erreur */}
                {error && (
                  <div
                    className="flex items-center gap-3 text-xs font-medium px-4 py-3.5 rounded-2xl"
                    style={{
                      background: "var(--accent-10)",
                      border: "1px solid var(--accent-20)",
                      color: "var(--accent)",
                    }}
                    role="alert"
                    aria-live="polite"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "var(--accent)" }}
                      aria-hidden="true"
                    />
                    {error}
                  </div>
                )}

                {/* Bouton */}
                <button
                  onClick={handleReset}
                  disabled={loading || !email}
                  className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-30 active:scale-[0.98] min-h-[52px]"
                  style={{
                    background: "linear-gradient(135deg, var(--accent) 0%, #C04020 100%)",
                    boxShadow: "0 12px 24px var(--accent-20)",
                  }}
                >
                  {loading ? (
                    <div
                      className="w-5 h-5 border-2 rounded-full animate-spin mx-auto"
                      style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "white" }}
                      aria-label="Chargement"
                    />
                  ) : (
                    "Envoyer le lien"
                  )}
                </button>
              </div>
            </>
          ) : (
            /* ── État succès ──────────────────────── */
            <div className="text-center py-4 space-y-4">
              <div
                className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto"
                style={{
                  background: "var(--succes-soft)",
                  border: "1px solid var(--succes)",
                }}
                aria-hidden="true"
              >
                <Mail size={28} style={{ color: "var(--succes)" }} />
              </div>
              <div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
                >
                  Email envoyé !
                </h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--muted)" }}>
                  Vérifiez votre boîte mail à{" "}
                  <span className="font-medium" style={{ color: "var(--or)" }}>
                    {email}
                  </span>{" "}
                  et cliquez sur le lien pour réinitialiser votre mot de passe.
                </p>
              </div>
              <p className="text-xs opacity-50" style={{ color: "var(--muted)" }}>
                Pas reçu ? Vérifiez vos spams.
              </p>
            </div>
          )}

          {/* ── Retour login ──────────────────────── */}
          <div className="flex items-center gap-3 mt-8" aria-hidden="true">
            <div className="flex-1 h-px" style={{ background: "var(--bordure)" }} />
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
              style={{ color: "var(--muted)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--or)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
            >
              <ArrowLeft size={13} aria-hidden="true" />
              Retour à la connexion
            </Link>
            <div className="flex-1 h-px" style={{ background: "var(--bordure)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}