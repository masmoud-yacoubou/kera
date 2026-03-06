// src/app/not-found.tsx

import Link from "next/link";
import { TrendingUp, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
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
      <div className="w-full max-w-md text-center">

        {/* ── Logo ────────────────────────────────── */}
        <div className="relative inline-flex mb-8">
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

        {/* ── Code erreur ───────────────────────────── */}
        <p
          className="text-8xl font-black tracking-tighter mb-2"
          style={{
            fontFamily: "var(--font-sora)",
            background: "linear-gradient(135deg, var(--texte) 30%, var(--muted) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          aria-label="Erreur 404"
        >
          404
        </p>

        {/* ── Icône boussole ────────────────────────── */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: "var(--or-10)",
            border: "1px solid var(--or-20)",
          }}
          aria-hidden="true"
        >
          <Compass size={24} style={{ color: "var(--or)" }} />
        </div>

        {/* ── Message ───────────────────────────────── */}
        <h1
          className="text-2xl font-black tracking-tight mb-3"
          style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
        >
          Page introuvable
        </h1>
        <p
          className="text-sm leading-relaxed mb-10 max-w-xs mx-auto"
          style={{ color: "var(--muted)" }}
        >
          Cette page n&apos;existe pas ou a été déplacée. Revenez au tableau de bord pour continuer.
        </p>

        {/* ── Bouton retour ─────────────────────────── */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-white transition-all hover:scale-105 active:scale-95 min-h-[52px]"
          style={{
            background: "linear-gradient(135deg, var(--accent) 0%, #C04020 100%)",
            boxShadow: "0 12px 24px var(--accent-20)",
          }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Retour au tableau de bord
        </Link>

        {/* ── Footer ────────────────────────────────── */}
        <p
          className="text-[10px] mt-12 uppercase tracking-[0.2em] font-bold opacity-30"
          style={{ color: "var(--muted)" }}
        >
          Kera Platform — Cotonou, Benin
        </p>
      </div>
    </div>
  );
}