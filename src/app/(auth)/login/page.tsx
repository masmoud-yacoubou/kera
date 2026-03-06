/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, TrendingUp, ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState<string | null>(null);
  const [mode,            setMode]            = useState<"login" | "signup">("login");

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const emailError = email.length > 0 && !isValidEmail(email);

  const handleSubmit = async () => {
    if (!isValidEmail(email)) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw new Error("Email ou mot de passe incorrect.");
        router.push("/dashboard");
      } else {
        if (password !== confirmPassword) throw new Error("Les mots de passe ne correspondent pas.");
        const { data, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) throw authError;
        if (data.session) {
          router.push("/dashboard");
        } else {
          setError("Vérifie ton email pour confirmer ton compte !");
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative"
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
          <div className="relative inline-flex mb-5 group">
            {/* Icône — accent fixe car logo de marque */}
            <div
              className="w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-105"
              style={{
                background: "var(--accent)",
                boxShadow: "0 20px 40px var(--accent-20)",
              }}
            >
              <TrendingUp className="text-white" size={32} strokeWidth={2.5} aria-hidden="true" />
            </div>
            {/* Anneau décoratif */}
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
          <p
            className="mt-2 text-sm tracking-[0.1em] font-medium"
            style={{ color: "var(--muted)" }}
          >
            La maîtrise sereine de vos finances
          </p>
        </div>

        {/* ── Card ────────────────────────────────── */}
        <div
          className="rounded-[2.5rem] p-8 md:p-10 backdrop-blur-md"
          style={{
            background: "linear-gradient(145deg, var(--surface) 0%, var(--carte) 100%)",
            border: "1px solid var(--bordure-60)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.3), inset 0 1px 0 var(--or-08)",
          }}
        >
          {/* Titre */}
          <div className="mb-8">
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
            >
              {mode === "login" ? "Bienvenue 👋" : "Nouveau compte"}
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              {mode === "login"
                ? "Accédez à votre espace personnel"
                : "Prenez le contrôle de vos flux dès aujourd'hui"}
            </p>
          </div>

          <div className="space-y-5">

            {/* ── Email ─────────────────────────────── */}
            <div className="group">
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: emailError ? "var(--accent)" : "var(--muted)" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="nom@exemple.com"
                  aria-label="Adresse email"
                  aria-invalid={emailError}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl focus:outline-none transition-all text-sm min-h-[52px]"
                  style={{
                    background: "var(--fond-40)",
                    border: `1px solid ${emailError ? "var(--accent-20)" : "var(--bordure)"}`,
                    color: "var(--texte)",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = emailError ? "var(--accent)" : "var(--or-30)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = emailError ? "var(--accent-20)" : "var(--bordure)"}
                />
              </div>
              {emailError && (
                <p
                  className="text-[10px] mt-1.5 ml-1 animate-in slide-in-from-left-1"
                  style={{ color: "var(--accent)" }}
                  role="alert"
                >
                  Format d&apos;email invalide
                </p>
              )}
            </div>

            {/* ── Mot de passe ──────────────────────── */}
            <div className="group">
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2.5 ml-1"
                style={{ color: "var(--muted)" }}
              >
                Clé de sécurité
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--muted)" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="••••••••"
                  aria-label="Mot de passe"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl focus:outline-none transition-all text-sm min-h-[52px]"
                  style={{
                    background: "var(--fond-40)",
                    border: "1px solid var(--bordure)",
                    color: "var(--texte)",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--or-30)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--bordure)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  style={{ color: "var(--muted)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--texte)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                >
                  {showPassword
                    ? <EyeOff size={16} aria-hidden="true" />
                    : <Eye    size={16} aria-hidden="true" />
                  }
                </button>
              </div>
            </div>

            {/* ── Confirmation — signup uniquement ──── */}
            {mode === "signup" && (
              <div className="group animate-in slide-in-from-top-2">
                <label
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2.5 ml-1"
                  style={{ color: "var(--muted)" }}
                >
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--muted)" }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="••••••••"
                    aria-label="Confirmer le mot de passe"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl focus:outline-none transition-all text-sm min-h-[52px]"
                    style={{
                      background: "var(--fond-40)",
                      color: "var(--texte)",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: confirmPassword.length > 0
                        ? confirmPassword === password
                          ? "var(--succes)"
                          : "var(--accent)"
                        : "var(--bordure)",
                    }}
                  />
                </div>
                {confirmPassword.length > 0 && confirmPassword !== password && (
                  <p
                    className="text-[10px] mt-1.5 ml-1"
                    style={{ color: "var(--accent)" }}
                    role="alert"
                  >
                    Les mots de passe ne correspondent pas
                  </p>
                )}
              </div>
            )}

            {/* ── Mot de passe oublié — login uniquement */}
            {mode === "login" && (
              <div className="flex justify-end -mt-2">
                <Link
                  href="/reset-password"
                  className="text-[10px] font-semibold tracking-wide transition-colors"
                  style={{ color: "var(--muted)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--or)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            )}

            {/* ── Message erreur / succès ───────────── */}
            {error && (
              <div
                className="flex items-center gap-3 text-xs font-medium px-4 py-3.5 rounded-2xl animate-in fade-in zoom-in-95"
                style={error.includes("Vérifie") ? {
                  background: "var(--succes-soft)",
                  border: "1px solid var(--succes)",
                  color: "var(--succes)",
                } : {
                  background: "var(--accent-10)",
                  border: "1px solid var(--accent-20)",
                  color: "var(--accent)",
                }}
                role="alert"
                aria-live="polite"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: error.includes("Vérifie") ? "var(--succes)" : "var(--accent)" }}
                  aria-hidden="true"
                />
                <span>{error}</span>
              </div>
            )}

            {/* ── Bouton submit ─────────────────────── */}
            <button
              onClick={handleSubmit}
              disabled={
                loading || !email || !password || !isValidEmail(email) ||
                (mode === "signup" && !confirmPassword)
              }
              className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all disabled:opacity-30 active:scale-[0.98] flex items-center justify-center gap-3 mt-4 group min-h-[52px]"
              style={{
                background: "linear-gradient(135deg, var(--accent) 0%, #C04020 100%)",
                boxShadow: "0 12px 24px var(--accent-20)",
                color: "#fff",
              }}
            >
              {loading ? (
                <div
                  className="w-5 h-5 border-2 border-t-white rounded-full animate-spin"
                  style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "white" }}
                  aria-label="Chargement"
                />
              ) : (
                <>
                  {mode === "login" ? "Entrer dans l'espace" : "Finaliser l'inscription"}
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </div>

          {/* ── Séparateur ────────────────────────── */}
          <div className="flex items-center gap-4 my-8" aria-hidden="true">
            <div className="flex-1 h-px" style={{ background: "var(--bordure)" }} />
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              OU
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--bordure)" }} />
          </div>

          {/* ── Switch login / signup ─────────────── */}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
              setConfirmPassword("");
            }}
            className="w-full text-center text-sm font-semibold transition-colors min-h-[44px]"
            style={{ color: "var(--or)" }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            {mode === "login" ? "Rejoindre Kera" : "Se connecter à un compte existant"}
          </button>
        </div>

        {/* ── Footer ────────────────────────────── */}
        <p
          className="text-center text-[10px] mt-10 uppercase tracking-[0.2em] font-bold opacity-30"
          style={{ color: "var(--muted)" }}
        >
          Kera Platform — Cotonou, Benin
        </p>
      </div>
    </div>
  );
}