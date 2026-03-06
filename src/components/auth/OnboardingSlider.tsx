"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, TrendingUp, ArrowRight } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════
// ILLUSTRATIONS
// Chaque illustration est un composant isolé et autonome.
// Pour modifier une illustration, éditer uniquement son
// composant sans toucher au reste du fichier.
// ═══════════════════════════════════════════════════════════

// ── Slide 0 : Bienvenue ─────────────────────────────────────
function IllustrationWelcome() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Anneaux concentriques rotatifs */}
      {[200, 260, 320, 380].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            border: `1px solid rgba(212,82,42,${0.18 - i * 0.035})`,
            boxShadow: i === 0 ? "0 0 40px rgba(212,82,42,0.05)" : "none",
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 25 + i * 8, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* Halo de lumière */}
      <div
        className="absolute rounded-full"
        style={{
          width: 180,
          height: 180,
          background: "radial-gradient(circle, rgba(212,82,42,0.12) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Logo central */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="w-28 h-28 rounded-[2rem] flex items-center justify-center"
          style={{
            background: "linear-gradient(145deg, var(--accent) 0%, #C04020 100%)",
            boxShadow: "0 24px 64px rgba(212,82,42,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          <TrendingUp size={52} className="text-white" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <motion.p
          className="text-5xl font-extrabold tracking-tight"
          style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Kera
        </motion.p>
      </motion.div>

      {/* Particules orbitales */}
      {[
        { r: 130, angle: 30,  size: 5, color: "var(--or)",     delay: 0 },
        { r: 150, angle: 145, size: 3, color: "var(--accent)", delay: 0.6 },
        { r: 110, angle: 240, size: 4, color: "var(--or)",     delay: 1.2 },
        { r: 160, angle: 310, size: 3, color: "var(--succes)", delay: 1.8 },
      ].map((p, i) => {
        const x = Math.cos((p.angle * Math.PI) / 180) * p.r;
        const y = Math.sin((p.angle * Math.PI) / 180) * p.r;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: p.size, height: p.size, background: p.color, left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.6, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: p.delay }}
          />
        );
      })}
    </div>
  );
}

// ── Slide 1 : Clarté financière ─────────────────────────────
function IllustrationClarte() {
  const bars = [
    { h: 45, type: "expense" },
    { h: 72, type: "income" },
    { h: 38, type: "expense" },
    { h: 88, type: "income" },
    { h: 55, type: "expense" },
    { h: 95, type: "income" },
    { h: 62, type: "expense" },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Halo ambiant */}
      <div className="absolute" style={{ width: 320, height: 320, background: "radial-gradient(circle, rgba(200,160,80,0.06) 0%, transparent 65%)", filter: "blur(30px)" }} />

      <motion.div
        className="relative w-80 rounded-[2rem] overflow-hidden"
        style={{
          background: "linear-gradient(145deg, var(--carte), var(--carte-2))",
          border: "1px solid var(--bordure-40)",
          boxShadow: "0 24px 72px rgba(0,0,0,0.4), inset 0 1px 0 rgba(200,160,80,0.06)",
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: "var(--muted)" }}>
              Solde disponible
            </p>
            <motion.p
              className="text-3xl font-black tracking-tight tabular-nums"
              style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              2 450 <span className="text-2xl" style={{ color: "var(--or)" }}>€</span>
            </motion.p>
            {/* Taux épargne */}
            <p className="text-[10px] mt-1 font-semibold" style={{ color: "var(--succes)" }}>
              ↑ +18% ce mois-ci
            </p>
          </div>
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent-10)", border: "1px solid var(--accent-20)" }}
            aria-hidden="true"
          >
            <TrendingUp size={20} style={{ color: "var(--accent)" }} />
          </div>
        </div>

        {/* Graphe */}
        <div className="px-6 pb-2">
          <div className="flex items-end gap-2 h-24">
            {bars.map((b, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-lg"
                style={{
                  background: b.type === "income"
                    ? "linear-gradient(180deg, var(--succes) 0%, rgba(74,138,106,0.3) 100%)"
                    : "linear-gradient(180deg, var(--accent) 0%, rgba(212,82,42,0.2) 100%)",
                }}
                initial={{ height: 0 }}
                animate={{ height: `${b.h}%` }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>
          <div className="h-px mt-1" style={{ background: "var(--bordure-20)" }} />
        </div>

        {/* Légende */}
        <div className="px-6 py-4 flex items-center gap-3">
          {[
            { label: "Revenus", color: "var(--succes)", bg: "var(--succes-soft)" },
            { label: "Dépenses", color: "var(--accent)", bg: "var(--accent-10)" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: l.bg }}>
              <div className="w-2 h-2 rounded-full" style={{ background: l.color }} aria-hidden="true" />
              <span className="text-[10px] font-bold" style={{ color: l.color }}>{l.label}</span>
            </div>
          ))}

          {/* Mini KPI */}
          <div className="ml-auto text-right">
            <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: "var(--muted)" }}>Épargne</p>
            <p className="text-sm font-black tabular-nums" style={{ color: "var(--or)", fontFamily: "var(--font-sora)" }}>24%</p>
          </div>
        </div>

        {/* Reflet subtil */}
        <div
          className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none rounded-t-[2rem]"
          style={{ background: "linear-gradient(180deg, rgba(200,160,80,0.04) 0%, transparent 100%)" }}
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}

// ── Slide 2 : Sécurité ──────────────────────────────────────
function IllustrationSecurite() {
  const tags = [
    { label: "Chiffré AES-256",  color: "var(--succes)", borderColor: "var(--succes-soft)", dx: -120, dy: -80 },
    { label: "Privé & local",    color: "var(--or)",     borderColor: "var(--or-soft)",     dx:  90,  dy: -65 },
    { label: "Zéro tracking",    color: "var(--accent)", borderColor: "var(--accent-soft)", dx: -100, dy:  80 },
    { label: "Open-source",      color: "var(--muted)",  borderColor: "var(--muted-soft)",  dx:  80,  dy:  70 },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Hexagone SVG */}
      <svg width="260" height="260" viewBox="0 0 260 260" className="absolute" aria-hidden="true">
        {[
          { pts: "130,12 230,67 230,183 130,238 30,183 30,67", color: "var(--or)", opacity: 0.15, dur: 25 },
          { pts: "130,36 206,80 206,168 130,212 54,168 54,80",  color: "var(--accent)", opacity: 0.08, dur: 35 },
        ].map((h, i) => (
          <motion.polygon
            key={i}
            points={h.pts}
            fill="none"
            stroke={h.color}
            strokeWidth="1"
            strokeOpacity={h.opacity}
            animate={{ rotate: i === 1 ? 360 : 0, strokeOpacity: [h.opacity, h.opacity * 2.5, h.opacity] }}
            transition={{ duration: h.dur, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "130px 130px" }}
          />
        ))}
      </svg>

      {/* Bouclier central */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-24 h-24 rounded-[1.75rem] flex items-center justify-center"
          style={{
            background: "linear-gradient(145deg, var(--carte), var(--carte-2))",
            border: "1px solid var(--or-20)",
            boxShadow: "0 20px 56px rgba(0,0,0,0.4), 0 0 40px rgba(200,160,80,0.06)",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <motion.path
              d="M24 4L7 12V24C7 34.5 14.9 44.4 24 46.8C33.1 44.4 41 34.5 41 24V12L24 4Z"
              stroke="var(--or)"
              strokeWidth="1.5"
              fill="rgba(200,160,80,0.06)"
              strokeLinecap="round"
              animate={{ strokeOpacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <motion.path
              d="M16 24L21 29L32 18"
              stroke="var(--succes)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
            />
          </svg>
        </div>

        {/* Tags flottants */}
        {tags.map((tag, i) => (
          <motion.div
            key={tag.label}
            className="absolute text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap"
            style={{
              background: tag.borderColor,
              border: `1px solid ${tag.borderColor}`,
              color: tag.color,
              left: `calc(50% + ${tag.dx}px)`,
              top:  `calc(50% + ${tag.dy}px)`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{ opacity: [0.55, 1, 0.55], y: [0, -3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
          >
            {tag.label}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ── Slide 3 : PWA / Mobile ──────────────────────────────────
function IllustrationVitesse() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Fond PWA oversized */}
      <motion.p
        className="absolute text-[200px] font-black leading-none select-none pointer-events-none"
        style={{ color: "var(--accent-10)", fontFamily: "var(--font-sora)" }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity }}
        aria-hidden="true"
      >
        PWA
      </motion.p>

      {/* Téléphone */}
      <motion.div
        className="relative z-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-52 rounded-[2.5rem] overflow-hidden"
          style={{
            background: "linear-gradient(145deg, var(--carte), var(--carte-2))",
            border: "1px solid var(--bordure-50)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(200,160,80,0.05)",
          }}
        >
          {/* Notch */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-20 h-1.5 rounded-full" style={{ background: "var(--bordure-40)" }} aria-hidden="true" />
          </div>

          {/* Status bar */}
          <div className="flex justify-between items-center px-5 mb-3">
            <span className="text-[9px] font-semibold" style={{ color: "var(--muted)" }}>9:41</span>
            <div className="flex items-end gap-0.5" aria-hidden="true">
              {[3, 5, 7, 9].map((h) => (
                <div key={h} className="w-1 rounded-sm" style={{ height: h, background: "var(--muted)" }} />
              ))}
            </div>
          </div>

          {/* Solde */}
          <div className="px-5 pb-3">
            <p className="text-[9px] uppercase tracking-widest font-bold mb-0.5" style={{ color: "var(--muted)" }}>
              Solde
            </p>
            <p className="text-2xl font-black tabular-nums" style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}>
              12 840 <span className="text-base" style={{ color: "var(--or)" }}>XOF</span>
            </p>
          </div>

          {/* Mini graphe linéaire */}
          <div className="px-5 pb-3">
            <svg width="100%" height="36" viewBox="0 0 180 36" preserveAspectRatio="none" aria-hidden="true">
              <motion.polyline
                points="0,28 30,20 60,24 90,10 120,16 150,6 180,12"
                fill="none"
                stroke="var(--succes)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
              />
              <motion.polyline
                points="0,28 30,20 60,24 90,10 120,16 150,6 180,12"
                fill="none"
                stroke="var(--succes)"
                strokeWidth="8"
                strokeOpacity="0.08"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Dernière transaction */}
          <motion.div
            className="mx-4 mb-4 px-3 py-2.5 rounded-2xl flex items-center gap-2.5"
            style={{ background: "var(--fond-40)", border: "1px solid var(--bordure-30)" }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--accent)", boxShadow: "0 4px 12px var(--accent-20)" }}
              aria-hidden="true"
            >
              <span className="text-white text-xs font-black">+</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold truncate" style={{ color: "var(--texte)" }}>Ajout rapide</p>
              <p className="text-[9px]" style={{ color: "var(--succes)" }}>Hors ligne ✓</p>
            </div>
          </motion.div>

          {/* Home indicator */}
          <div className="flex justify-center pb-3">
            <div className="w-16 h-1 rounded-full" style={{ background: "var(--bordure-40)" }} aria-hidden="true" />
          </div>
        </div>

        {/* Badge PWA */}
        <motion.div
          className="absolute -top-3 -right-4 px-3 py-1.5 rounded-2xl text-[10px] font-black text-white"
          style={{
            background: "linear-gradient(135deg, var(--accent), #C04020)",
            boxShadow: "0 6px 20px var(--accent-20)",
          }}
          animate={{ scale: [1, 1.08, 1], rotate: [0, 2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          PWA
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Slide 4 : CTA final ─────────────────────────────────────
function IllustrationCTA() {
  const stats = [
    { label: "Transactions",  value: "∞",    color: "var(--accent)" },
    { label: "Devises",       value: "3",     color: "var(--or)"     },
    { label: "Thèmes",        value: "6",     color: "var(--succes)" },
    { label: "Prix",          value: "0 €",   color: "var(--texte)"  },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute" style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(212,82,42,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} aria-hidden="true" />

      <motion.div
        className="relative z-10 w-72 space-y-4"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="rounded-2xl p-4 text-center"
              style={{
                background: "linear-gradient(145deg, var(--carte), var(--carte-2))",
                border: "1px solid var(--bordure-30)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                className="text-2xl font-black tabular-nums"
                style={{ color: s.color, fontFamily: "var(--font-sora)" }}
              >
                {s.value}
              </p>
              <p className="text-[9px] uppercase tracking-widest font-bold mt-1" style={{ color: "var(--muted)" }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Message final */}
        <motion.div
          className="rounded-2xl p-4 text-center"
          style={{
            background: "var(--accent-10)",
            border: "1px solid var(--accent-20)",
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <p className="text-sm font-bold" style={{ color: "var(--accent)" }}>
            Gratuit. Pour toujours.
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
            Aucune carte, aucun abonnement.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// REGISTRE DES SLIDES
// Pour ajouter un slide : ajouter une entrée ici + son
// composant IllustrationXxx ci-dessus.
// ═══════════════════════════════════════════════════════════
const STEPS = [
  {
    tag:         "Bienvenue",
    title:       "Votre argent,\nenfin clair.",
    description: "Kera vous offre une vision sereine et précise de vos finances personnelles.",
    detail:      "Conçu pour les francophones d'Afrique de l'Ouest, Kera s'adapte à votre quotidien financier.",
    color:       "#D4522A",
    illustration: <IllustrationWelcome />,
  },
  {
    tag:         "Tableau de bord",
    title:       "Tout voir\nd'un coup d'œil.",
    description: "Revenus, dépenses, tendances — chaque chiffre à sa place, au bon moment.",
    detail:      "Graphiques en temps réel, taux d'épargne automatique, historique complet filtrable.",
    color:       "#C8A050",
    illustration: <IllustrationClarte />,
  },
  {
    tag:         "Sécurité",
    title:       "Vos données\nvous appartiennent.",
    description: "Chiffrement bout en bout, confidentialité totale. Nous ne vendons rien.",
    detail:      "Authentification sécurisée via Supabase. Zéro publicité, zéro tracking tiers.",
    color:       "#C8A050",
    illustration: <IllustrationSecurite />,
  },
  {
    tag:         "Mobile & PWA",
    title:       "Rapide.\nMême hors ligne.",
    description: "Installez Kera sur votre téléphone et gérez vos finances partout.",
    detail:      "Progressive Web App — fonctionne sur iOS et Android sans passer par l'App Store.",
    color:       "#D4522A",
    illustration: <IllustrationVitesse />,
  },
  {
    tag:         "Prêt ?",
    title:       "Commencez\nmaintenant.",
    description: "Gratuit, sans carte bancaire, sans engagement.",
    detail:      "Rejoignez Kera en 30 secondes et prenez le contrôle de vos finances.",
    color:       "#D4522A",
    illustration: <IllustrationCTA />,
    isFinal:     true,
  },
] as const;

type Step = typeof STEPS[number];

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════
export default function OnboardingSlider() {
  const [current,   setCurrent]   = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const step = STEPS[current] as Step & { isFinal?: boolean };

  // ── Cookies d'onboarding ────────────────────────────────
  const handleFinish = useCallback(() => {
    Cookies.set("kera_onboarding_seen", "true", { expires: 365 });
  }, []);

  // ── Navigation ──────────────────────────────────────────
  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= STEPS.length) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  // ── Clavier ─────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft")  goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  // ── Swipe tactile ───────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
  };

  // ── Variants d'animation ────────────────────────────────
  const slideVariants = {
    enter:  (dir: number) => ({ opacity: 0, x: dir * 60, filter: "blur(8px)" }),
    center: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit:   (dir: number) => ({ opacity: 0, x: dir * -60, filter: "blur(8px)" }),
  };

  const textVariants = {
    enter:  { opacity: 0, y: 18 },
    center: { opacity: 1, y: 0 },
    exit:   { opacity: 0, y: -18 },
  };

  const progress = ((current + 1) / STEPS.length) * 100;

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ background: "var(--body-bg)" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ════════════════════════════════════════
          LAYOUT DESKTOP — Split 50/50
          Visible uniquement sur lg+
      ════════════════════════════════════════ */}
      <div className="hidden lg:flex w-full">

        {/* ── Panneau gauche — Illustration ──── */}
        <div
          className="w-1/2 relative flex items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(145deg, var(--carte) 0%, var(--carte-2) 100%)",
            borderRight: "1px solid var(--bordure-20)",
          }}
        >
          {/* Fond animé */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 8, repeat: Infinity }}
            aria-hidden="true"
          >
            <div
              className="absolute top-[-15%] left-[-15%] w-[70%] h-[70%] rounded-full"
              style={{
                background: `radial-gradient(circle, ${step.color}10 0%, transparent 70%)`,
                filter: "blur(80px)",
                transition: "background 0.8s ease",
              }}
            />
            <div
              className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(200,160,80,0.06) 0%, transparent 70%)",
                filter: "blur(80px)",
              }}
            />
          </motion.div>

          {/* Numéro oversized décoratif */}
          <div
            className="absolute bottom-8 left-8 text-[160px] font-black leading-none select-none pointer-events-none"
            style={{ color: "var(--bordure-20)", fontFamily: "var(--font-sora)" }}
            aria-hidden="true"
          >
            0{current + 1}
          </div>

          {/* Illustration */}
          <div className="relative z-10 w-full h-full max-w-lg p-16">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                {step.illustration}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots de navigation (desktop gauche) */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3" role="tablist" aria-label="Navigation slides">
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                role="tab"
                aria-selected={current === idx}
                aria-label={`Slide ${idx + 1} : ${STEPS[idx].tag}`}
                onClick={() => goTo(idx)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: 6,
                  height: current === idx ? 28 : 6,
                  background: current === idx
                    ? `linear-gradient(180deg, ${step.color}, var(--or))`
                    : "var(--bordure-40)",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Panneau droit — Contenu + Nav ──── */}
        <div className="w-1/2 flex flex-col justify-between p-16 relative">
          {/* Fond radial subtil */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 80% 20%, var(--body-radial-1) 0%, transparent 55%)",
            }}
            aria-hidden="true"
          />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, var(--accent), #C04020)",
                  boxShadow: "0 4px 16px var(--accent-20)",
                }}
                aria-hidden="true"
              >
                <TrendingUp size={16} className="text-white" />
              </div>
              <span
                className="font-black tracking-widest text-sm uppercase"
                style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
              >
                Kera
              </span>
            </div>

            {/* Skip */}
            {current < STEPS.length - 1 && (
              <button
                onClick={() => { handleFinish(); window.location.href = "/login"; }}
                className="text-xs font-semibold transition-colors px-4 py-2 rounded-xl min-h-[36px]"
                style={{ color: "var(--muted)", background: "var(--fond-40)", border: "1px solid var(--bordure-30)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--texte)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
              >
                Ignorer
              </button>
            )}
          </div>

          {/* Contenu central */}
          <div className="relative z-10 flex-1 flex flex-col justify-center max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, delay: 0.05 }}
                className="space-y-6"
              >
                {/* Tag */}
                <span
                  className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                  style={{
                    background: `${step.color}15`,
                    color: step.color,
                    border: `1px solid ${step.color}25`,
                  }}
                >
                  {step.tag}
                </span>

                {/* Titre */}
                <h1
                  className="text-5xl xl:text-6xl font-black tracking-tight leading-[1.05] whitespace-pre-line"
                  style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
                >
                  {step.title}
                </h1>

                {/* Description + Détail */}
                <div className="space-y-3">
                  <p className="text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
                    {step.description}
                  </p>
                  <p className="text-sm leading-relaxed opacity-70" style={{ color: "var(--muted)" }}>
                    {step.detail}
                  </p>
                </div>

                {/* Boutons CTA final */}
                {step.isFinal && (
                  <div className="flex gap-3 pt-2">
                    <Link
                      href="/login"
                      onClick={handleFinish}
                      className="flex-1 py-4 rounded-2xl font-bold text-sm text-white text-center transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      style={{
                        background: "linear-gradient(135deg, var(--accent) 0%, #C04020 100%)",
                        boxShadow: "0 12px 32px var(--accent-20)",
                      }}
                    >
                      Créer mon compte
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                    <Link
                      href="/login"
                      onClick={handleFinish}
                      className="px-6 py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
                      style={{
                        background: "var(--fond-40)",
                        border: "1px solid var(--bordure-40)",
                        color: "var(--texte)",
                      }}
                    >
                      Se connecter
                    </Link>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer navigation */}
          <div className="relative z-10 space-y-6">
            {/* Barre de progression */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold" style={{ color: "var(--muted)" }}>
                  {current + 1} / {STEPS.length}
                </span>
                <span className="text-xs font-bold" style={{ color: "var(--muted)" }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-1 rounded-full" style={{ background: "var(--bordure-20)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, var(--accent), var(--or))` }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Flèches navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={goPrev}
                disabled={current === 0}
                aria-label="Slide précédent"
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all disabled:opacity-20"
                style={{ background: "var(--fond-40)", border: "1px solid var(--bordure-30)", color: "var(--texte)" }}
                onMouseEnter={(e) => { if (current > 0) e.currentTarget.style.borderColor = "var(--bordure-60)"; }}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--bordure-30)"}
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>

              {!step.isFinal && (
                <button
                  onClick={goNext}
                  aria-label="Slide suivant"
                  className="flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] group"
                  style={{
                    background: "linear-gradient(145deg, var(--carte), var(--surface))",
                    border: "1px solid var(--bordure-40)",
                    color: "var(--texte)",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-20)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--bordure-40)"}
                >
                  Continuer
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform"
                    style={{ background: "linear-gradient(135deg, var(--accent), #C04020)" }}
                    aria-hidden="true"
                  >
                    <ChevronRight size={14} className="text-white" />
                  </div>
                </button>
              )}

              {step.isFinal && (
                <p className="flex-1 text-center text-xs" style={{ color: "var(--muted)" }}>
                  Utilisez ← → pour naviguer
                </p>
              )}
            </div>

            {/* Hint clavier */}
            <p className="text-center text-[10px] uppercase tracking-widest" style={{ color: "var(--muted)", opacity: 0.4 }}>
              ← → pour naviguer · Esc pour ignorer
            </p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          LAYOUT MOBILE — Full screen vertical
          Visible uniquement sur < lg
      ════════════════════════════════════════ */}
      <div className="flex lg:hidden flex-col w-full min-h-screen py-10 px-6 relative">
        {/* Fond animé */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
          aria-hidden="true"
        >
          <div
            className="absolute top-[-15%] left-[-10%] w-[70%] h-[60%] rounded-full"
            style={{
              background: `radial-gradient(circle, ${step.color}08 0%, transparent 70%)`,
              filter: "blur(60px)",
              transition: "background 0.6s ease",
            }}
          />
        </motion.div>

        {/* Header mobile */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--accent), #C04020)",
                boxShadow: "0 4px 12px var(--accent-20)",
              }}
              aria-hidden="true"
            >
              <TrendingUp size={15} className="text-white" />
            </div>
            <span
              className="font-black tracking-widest text-sm uppercase"
              style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
            >
              Kera
            </span>
          </div>
          {current < STEPS.length - 1 && (
            <button
              onClick={() => { handleFinish(); window.location.href = "/login"; }}
              className="text-xs font-semibold transition-colors px-3 py-1.5 rounded-xl min-h-[36px]"
              style={{ color: "var(--muted)", background: "var(--fond-40)", border: "1px solid var(--bordure-30)" }}
            >
              Ignorer
            </button>
          )}
        </div>

        {/* Illustration mobile */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="w-full h-64 sm:h-80">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                {step.illustration}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Texte mobile */}
        <div className="relative z-10 text-center mt-6 min-h-[160px] px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-3"
            >
              <span
                className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                style={{
                  background: `${step.color}15`,
                  color: step.color,
                  border: `1px solid ${step.color}30`,
                }}
              >
                {step.tag}
              </span>

              <h2
                className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight whitespace-pre-line"
                style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
              >
                {step.title}
              </h2>

              <p className="text-sm sm:text-base leading-relaxed max-w-[300px] mx-auto" style={{ color: "var(--muted)" }}>
                {step.description}
              </p>

              <p className="text-xs leading-relaxed max-w-[280px] mx-auto opacity-60" style={{ color: "var(--muted)" }}>
                {step.detail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer mobile */}
        <div className="relative z-10 space-y-5 mt-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="h-1 rounded-full" style={{ background: "var(--bordure-20)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--accent), var(--or))" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            {/* Dots */}
            <div className="flex justify-center gap-2" role="tablist" aria-label="Navigation slides">
              {STEPS.map((_, idx) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={current === idx}
                  aria-label={`Slide ${idx + 1}`}
                  onClick={() => goTo(idx)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: current === idx ? 24 : 6,
                    height: 6,
                    background: current === idx
                      ? `linear-gradient(90deg, var(--accent), var(--or))`
                      : "var(--bordure-40)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Boutons mobile */}
          {!step.isFinal ? (
            <button
              onClick={goNext}
              className="group w-full py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] min-h-[52px]"
              style={{
                background: "linear-gradient(145deg, var(--carte), var(--surface))",
                border: "1px solid var(--bordure-40)",
                color: "var(--texte)",
              }}
            >
              Continuer
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform"
                style={{ background: "linear-gradient(135deg, var(--accent), #C04020)" }}
                aria-hidden="true"
              >
                <ChevronRight size={16} className="text-white" />
              </div>
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={handleFinish}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white text-center transition-all active:scale-[0.98] flex items-center justify-center gap-2 min-h-[52px]"
                style={{
                  background: "linear-gradient(135deg, var(--accent) 0%, #C04020 100%)",
                  boxShadow: "0 12px 32px var(--accent-20)",
                }}
              >
                Créer mon compte
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                onClick={handleFinish}
                className="w-full py-3 rounded-2xl font-bold text-sm text-center transition-all active:scale-[0.98] min-h-[44px]"
                style={{
                  background: "var(--fond-40)",
                  border: "1px solid var(--bordure-40)",
                  color: "var(--texte)",
                }}
              >
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}