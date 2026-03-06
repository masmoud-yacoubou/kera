"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TrendingUp, Eye, EyeOff, Lock, Check } from "lucide-react";

// ─────────────────────────────────────────────
// Sous-composant : indicateur de force du MDP
// ─────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8 caractères minimum", ok: password.length >= 8 },
    { label: "Une majuscule",         ok: /[A-Z]/.test(password) },
    { label: "Un chiffre",            ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;

  // Couleurs hardcodées — utilisées dans des styles SVG/inline
  // où les CSS variables ne sont pas interpolables
  const colors = ["#D4522A", "#C8A050", "#4A8A6A"];
  const labels = ["Faible", "Moyen", "Fort"];

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2" aria-live="polite">
      {/* Barres de progression */}
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{
              background: i < score ? colors[score - 1] : "var(--bordure)",
            }}
          />
        ))}
      </div>

      {/* Critères + label force */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-3 flex-wrap">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full flex items-center justify-center"
                style={{ background: c.ok ? "var(--succes-soft)" : "var(--bordure)" }}
                aria-hidden="true"
              >
                {c.ok && <Check size={8} style={{ color: "var(--succes)" }} />}
              </div>
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                {c.label}
              </span>
            </div>
          ))}
        </div>
        {score > 0 && (
          <span
            className="text-[10px] font-bold"
            style={{ color: colors[score - 1] }}
            aria-label={`Force du mot de passe : ${labels[score - 1]}`}
          >
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page : mise à jour du mot de passe
// ─────────────────────────────────────────────
export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password,     setPassword]     = useState("");
  const [confirm,      setConfirm]      = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const isStrong  = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  const matches   = password === confirm && confirm.length > 0;
  const canSubmit = isStrong && matches && !loading;

  const handleUpdate = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError("Erreur lors de la mise à jour. Réessayez.");
    else router.push("/dashboard");
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
      <div className="w-full max-w-md">

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
          <div className="mb-8">
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
            >
              Nouveau mot de passe
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Choisissez un mot de passe fort pour sécuriser votre compte.
            </p>
          </div>

          <div className="space-y-5">

            {/* ── Nouveau MDP ───────────────────────── */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2.5 ml-1"
                style={{ color: "var(--muted)" }}
              >
                Nouveau mot de passe
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  aria-label="Nouveau mot de passe"
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
              <PasswordStrength password={password} />
            </div>

            {/* ── Confirmation ──────────────────────── */}
            <div>
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
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                  placeholder="••••••••"
                  aria-label="Confirmer le mot de passe"
                  className="w-full pl-12 pr-10 py-4 rounded-2xl focus:outline-none transition-all text-sm min-h-[52px]"
                  style={{
                    background: "var(--fond-40)",
                    color: "var(--texte)",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: confirm.length > 0
                      ? matches ? "var(--succes)" : "var(--accent)"
                      : "var(--bordure)",
                  }}
                />
                {/* Indicateur match */}
                {confirm.length > 0 && (
                  <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: matches ? "var(--succes-soft)" : "var(--accent-10)" }}
                    aria-hidden="true"
                  >
                    <Check
                      size={11}
                      style={{ color: matches ? "var(--succes)" : "var(--accent)" }}
                    />
                  </div>
                )}
              </div>
              {confirm.length > 0 && !matches && (
                <p
                  className="text-[10px] mt-1.5 ml-1"
                  style={{ color: "var(--accent)" }}
                  role="alert"
                >
                  Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            {/* ── Erreur ────────────────────────────── */}
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

            {/* ── Bouton submit ─────────────────────── */}
            <button
              onClick={handleUpdate}
              disabled={!canSubmit}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-30 active:scale-[0.98] mt-2 min-h-[52px]"
              style={{
                background: "linear-gradient(135deg, var(--accent) 0%, #C04020 100%)",
                boxShadow: canSubmit ? "0 12px 24px var(--accent-20)" : "none",
              }}
            >
              {loading ? (
                <div
                  className="w-5 h-5 border-2 rounded-full animate-spin mx-auto"
                  style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "white" }}
                  aria-label="Chargement"
                />
              ) : (
                "Mettre à jour le mot de passe"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}