/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, TrendingUp, ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");

  // Logique de validation d'email
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = email.length > 0 && !isValidEmail(email);

  const handleSubmit = async () => {
    // Sécurité supplémentaire avant l'envoi
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
        if (password !== confirmPassword) {
          throw new Error("Les mots de passe ne correspondent pas.");
        }
        const { error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) throw authError;
        setError("Vérifie ton email pour confirmer ton compte !");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-[#0E0B08] overflow-hidden relative"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 15% 15%, #D4522A12 0%, transparent 45%),
          radial-gradient(ellipse at 85% 85%, #C8A05008 0%, transparent 45%)
        `,
      }}
    >
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="relative inline-flex mb-5 group">
            <div className="w-20 h-20 rounded-[2rem] bg-[#D4522A] flex items-center justify-center shadow-2xl shadow-[#D4522A]/40 transition-transform duration-500 group-hover:scale-105">
              <TrendingUp className="text-white" size={32} strokeWidth={2.5} />
            </div>
            <div className="absolute inset-0 rounded-[2rem] border-2 border-[#C8A050]/20 scale-110" />
          </div>
          <h1 className="text-5xl font-bold text-[#F2E8D8] tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
            Kera
          </h1>
          <p className="text-[#9A8060] mt-2 text-sm tracking-[0.1em] font-medium">
            La maîtrise sereine de vos finances
          </p>
        </div>

        <div
          className="rounded-[2.5rem] p-8 md:p-10 border border-[#3A281860] backdrop-blur-md"
          style={{
            background: "linear-gradient(145deg, #1A1410 0%, #1F1810 100%)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,160,80,0.05)",
          }}
        >
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#F2E8D8]" style={{ fontFamily: "var(--font-sora)" }}>
              {mode === "login" ? "Bienvenue 👋" : "Nouveau compte"}
            </h2>
            <p className="text-xs text-[#9A8060] mt-1">
              {mode === "login" ? "Accédez à votre espace personnel" : "Prenez le contrôle de vos flux dès aujourd'hui"}
            </p>
          </div>

          <div className="space-y-5">
            {/* Email Input */}
            <div className="group">
              <label className="block text-[10px] font-bold text-[#9A8060] uppercase tracking-[0.2em] mb-2.5 ml-1">
                Identifiant Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${emailError ? 'text-[#D4522A]' : 'text-[#9A8060]/30 group-focus-within:text-[#D4522A]'}`} size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-[#0E0B08]/40 text-[#F2E8D8] placeholder-[#9A8060]/20 focus:outline-none focus:ring-2 focus:ring-[#D4522A]/20 transition-all text-sm"
                  style={{
                    borderColor: emailError ? "#D4522A50" : "#3A2818",
                  }}
                />
              </div>
              {emailError && (
                <p className="text-[10px] text-[#D4522A] mt-1.5 ml-1 animate-in slide-in-from-left-1">
                  Format d&apos;email invalide
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="group">
              <label className="block text-[10px] font-bold text-[#9A8060] uppercase tracking-[0.2em] mb-2.5 ml-1">
                Clé de sécurité
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8060]/30 group-focus-within:text-[#D4522A] transition-colors" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-[#3A2818] bg-[#0E0B08]/40 text-[#F2E8D8] placeholder-[#9A8060]/20 focus:outline-none focus:ring-2 focus:ring-[#D4522A]/20 focus:border-[#D4522A]/50 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A8060]/50 hover:text-[#F2E8D8] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Signup) */}
            {mode === "signup" && (
              <div className="group animate-in slide-in-from-top-2">
                <label className="block text-[10px] font-bold text-[#9A8060] uppercase tracking-[0.2em] mb-2.5 ml-1">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8060]/30" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border transition-all text-sm bg-[#0E0B08]/40 text-[#F2E8D8] placeholder-[#9A8060]/20 focus:outline-none"
                    style={{
                      borderColor: confirmPassword.length > 0
                        ? confirmPassword === password ? "#4A8A6A50" : "#D4522A50"
                        : "#3A2818",
                    }}
                  />
                </div>
                {confirmPassword.length > 0 && confirmPassword !== password && (
                  <p className="text-[10px] text-[#D4522A] mt-1.5 ml-1">
                    Les mots de passe ne correspondent pas
                  </p>
                )}
              </div>
            )}

            {mode === "login" && (
              <div className="flex justify-end -mt-2">
                <Link href="/reset-password" title="Récupérer mon accès" className="text-[10px] font-semibold text-[#9A8060] hover:text-[#C8A050] transition-colors tracking-wide">
                  Mot de passe oublié ?
                </Link>
              </div>
            )}
            
            {error && (
              <div className={`flex items-center gap-3 text-xs font-medium px-4 py-3.5 rounded-2xl animate-in fade-in zoom-in-95 ${
                error.includes("Vérifie") ? "bg-[#4A8A6A]/10 border border-[#4A8A6A]/20 text-[#4A8A6A]" : "bg-[#D4522A]/10 border border-[#D4522A]/20 text-[#D4522A]"
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${error.includes("Vérifie") ? "bg-[#4A8A6A]" : "bg-[#D4522A]"}`} />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !email || !password || !isValidEmail(email) || (mode === "signup" && !confirmPassword)}
              className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all disabled:opacity-30 active:scale-[0.98] flex items-center justify-center gap-3 mt-4 group"
              style={{
                background: "linear-gradient(135deg, #D4522A 0%, #C04020 100%)",
                boxShadow: "0 12px 24px rgba(212, 82, 42, 0.25)",
                color: "#fff",
              }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Entrer dans l'espace" : "Finaliser l'inscription"}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[#3A2818]" />
            <span className="text-[10px] font-bold text-[#9A8060] uppercase tracking-widest">OU</span>
            <div className="flex-1 h-px bg-[#3A2818]" />
          </div>

          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setConfirmPassword(""); }}
            className="w-full text-center text-sm font-semibold text-[#C8A050] hover:text-[#D4B860] transition-colors"
          >
            {mode === "login" ? "Rejoindre Kera" : "Se connecter à un compte existant"}
          </button>
        </div>

        <p className="text-center text-[10px] text-[#9A8060]/30 mt-10 uppercase tracking-[0.2em] font-bold">
          Kera Platform — Cotonou, Benin
        </p>
      </div>
    </div>
  );
}