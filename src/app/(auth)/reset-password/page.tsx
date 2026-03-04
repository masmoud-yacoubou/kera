"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TrendingUp, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      className="min-h-screen flex items-center justify-center px-4 bg-[#0E0B08]"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 15% 15%, #D4522A12 0%, transparent 45%),
          radial-gradient(ellipse at 85% 85%, #C8A05008 0%, transparent 45%)
        `,
      }}
    >
      <div className="w-full max-w-md z-10">

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
          {!sent ? (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#F2E8D8]" style={{ fontFamily: "var(--font-sora)" }}>
                  Mot de passe oublié
                </h2>
                <p className="text-xs text-[#9A8060] mt-1">
                  Entrez votre email et nous vous enverrons un lien de réinitialisation.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-[#9A8060] uppercase tracking-[0.2em] mb-2.5 ml-1">
                    Identifiant Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8060]/30" size={16} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleReset()}
                      placeholder="nom@exemple.com"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#3A2818] bg-[#0E0B08]/40 text-[#F2E8D8] placeholder-[#9A8060]/20 focus:outline-none focus:ring-2 focus:ring-[#D4522A]/20 focus:border-[#D4522A]/50 transition-all text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-3 text-xs font-medium px-4 py-3.5 rounded-2xl bg-[#D4522A]/10 border border-[#D4522A]/20 text-[#D4522A]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4522A] shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleReset}
                  disabled={loading || !email}
                  className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-30 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #D4522A 0%, #C04020 100%)",
                    boxShadow: "0 12px 24px rgba(212,82,42,0.25)",
                  }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                  ) : (
                    "Envoyer le lien"
                  )}
                </button>
              </div>
            </>
          ) : (
            /* État succès */
            <div className="text-center py-4 space-y-4">
              <div
                className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto"
                style={{ background: "#4A8A6A15", border: "1px solid #4A8A6A30" }}
              >
                <Mail size={28} className="text-[#4A8A6A]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F2E8D8]" style={{ fontFamily: "var(--font-sora)" }}>
                  Email envoyé !
                </h3>
                <p className="text-sm text-[#9A8060] mt-2 leading-relaxed">
                  Vérifiez votre boîte mail à <span className="text-[#C8A050] font-medium">{email}</span> et cliquez sur le lien pour réinitialiser votre mot de passe.
                </p>
              </div>
              <p className="text-xs text-[#9A8060]/50">
                Pas reçu ? Vérifiez vos spams.
              </p>
            </div>
          )}

          {/* Retour login */}
          <div className="flex items-center gap-3 mt-8">
            <div className="flex-1 h-px bg-[#3A2818]" />
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#9A8060] hover:text-[#C8A050] transition-colors"
            >
              <ArrowLeft size={13} />
              Retour à la connexion
            </Link>
            <div className="flex-1 h-px bg-[#3A2818]" />
          </div>
        </div>
      </div>
    </div>
  );
}