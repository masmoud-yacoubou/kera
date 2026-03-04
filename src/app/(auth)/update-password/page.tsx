"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TrendingUp, Eye, EyeOff, Lock, Check } from "lucide-react";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8 caractères minimum", ok: password.length >= 8 },
    { label: "Une majuscule", ok: /[A-Z]/.test(password) },
    { label: "Un chiffre", ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["#D4522A", "#C8A050", "#4A8A6A"];
  const labels = ["Faible", "Moyen", "Fort"];

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i < score ? colors[score - 1] : "#3A2818" }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full flex items-center justify-center"
                style={{ background: c.ok ? "#4A8A6A20" : "#3A2818" }}
              >
                {c.ok && <Check size={8} className="text-[#4A8A6A]" />}
              </div>
              <span className="text-[10px] text-[#9A8060]">{c.label}</span>
            </div>
          ))}
        </div>
        {score > 0 && (
          <span className="text-[10px] font-bold" style={{ color: colors[score - 1] }}>
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  );
}

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStrong = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  const matches = password === confirm && confirm.length > 0;
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
      className="min-h-screen flex items-center justify-center px-4 bg-[#0E0B08]"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 15% 15%, #D4522A12 0%, transparent 45%),
          radial-gradient(ellipse at 85% 85%, #C8A05008 0%, transparent 45%)
        `,
      }}
    >
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="relative inline-flex mb-5">
            <div className="w-20 h-20 rounded-[2rem] bg-[#D4522A] flex items-center justify-center shadow-2xl shadow-[#D4522A]/40">
              <TrendingUp className="text-white" size={32} strokeWidth={2.5} />
            </div>
            <div className="absolute inset-0 rounded-[2rem] border-2 border-[#C8A050]/20 scale-110" />
          </div>
          <h1 className="text-5xl font-bold text-[#F2E8D8] tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
            Kera
          </h1>
        </div>

        <div
          className="rounded-[2.5rem] p-8 border border-[#3A281860]"
          style={{
            background: "linear-gradient(145deg, #1A1410 0%, #1F1810 100%)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,160,80,0.05)",
          }}
        >
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#F2E8D8]" style={{ fontFamily: "var(--font-sora)" }}>
              Nouveau mot de passe
            </h2>
            <p className="text-xs text-[#9A8060] mt-1">
              Choisissez un mot de passe fort pour sécuriser votre compte.
            </p>
          </div>

          <div className="space-y-5">

            {/* Nouveau mot de passe */}
            <div>
              <label className="block text-[10px] font-bold text-[#9A8060] uppercase tracking-[0.2em] mb-2.5 ml-1">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8060]/30" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-[#3A2818] bg-[#0E0B08]/40 text-[#F2E8D8] placeholder-[#9A8060]/20 focus:outline-none focus:ring-2 focus:ring-[#D4522A]/20 focus:border-[#D4522A]/50 transition-all text-sm"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A8060]/50 hover:text-[#F2E8D8] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            {/* Confirmation */}
            <div>
              <label className="block text-[10px] font-bold text-[#9A8060] uppercase tracking-[0.2em] mb-2.5 ml-1">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8060]/30" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border transition-all text-sm bg-[#0E0B08]/40 text-[#F2E8D8] placeholder-[#9A8060]/20 focus:outline-none focus:ring-2"
                  style={{
                    borderColor: confirm.length > 0
                      ? matches ? "#4A8A6A50" : "#D4522A50"
                      : "#3A2818",
                  }}
                />
                {confirm.length > 0 && (
                  <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: matches ? "#4A8A6A20" : "#D4522A20" }}
                  >
                    <Check size={11} style={{ color: matches ? "#4A8A6A" : "#D4522A" }} />
                  </div>
                )}
              </div>
              {confirm.length > 0 && !matches && (
                <p className="text-[10px] text-[#D4522A] mt-1.5 ml-1">
                  Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-3 text-xs font-medium px-4 py-3.5 rounded-2xl bg-[#D4522A]/10 border border-[#D4522A]/20 text-[#D4522A]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4522A] shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleUpdate}
              disabled={!canSubmit}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-30 active:scale-[0.98] mt-2"
              style={{
                background: "linear-gradient(135deg, #D4522A 0%, #C04020 100%)",
                boxShadow: canSubmit ? "0 12px 24px rgba(212,82,42,0.25)" : "none",
              }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
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