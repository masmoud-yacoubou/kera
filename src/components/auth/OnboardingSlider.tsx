"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, TrendingUp } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";

// ── Illustrations SVG premium ──────────────────────────────

function IllustrationWelcome() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Cercles concentriques */}
      {[120, 160, 200, 240].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: size,
            height: size,
            borderColor: `rgba(212,82,42,${0.15 - i * 0.03})`,
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* Logo central */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-3"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #D4522A 0%, #C04020 100%)",
            boxShadow: "0 20px 60px rgba(212,82,42,0.5)",
          }}
        >
          <TrendingUp size={44} className="text-white" strokeWidth={1.5} />
        </div>
        <motion.p
          className="text-4xl font-extrabold text-[#F2E8D8] tracking-tight"
          style={{ fontFamily: "var(--font-sora)" }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Kera
        </motion.p>
      </motion.div>

      {/* Points décoratifs */}
      {[
        { top: "10%", left: "15%", size: 6, delay: 0 },
        { top: "20%", right: "12%", size: 4, delay: 0.5 },
        { bottom: "15%", left: "20%", size: 5, delay: 1 },
        { bottom: "25%", right: "15%", size: 3, delay: 1.5 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#C8A050]"
          style={{ width: dot.size, height: dot.size, ...dot }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: dot.delay }}
        />
      ))}
    </div>
  );
}

function IllustrationClarte() {
  const bars = [65, 40, 80, 55, 90, 45, 70];
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="relative w-72 rounded-3xl p-5 overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1C1610, #251C14)",
          border: "1px solid #3A281850",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header carte */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] text-[#9A8060] uppercase tracking-widest">Solde</p>
            <motion.p
              className="text-2xl font-bold text-[#F2E8D8]"
              style={{ fontFamily: "var(--font-sora)" }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              2 450 <span className="text-[#C8A050] text-lg">€</span>
            </motion.p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "#D4522A20", border: "1px solid #D4522A30" }}
          >
            <TrendingUp size={18} className="text-[#D4522A]" />
          </div>
        </div>

        {/* Barres animées */}
        <div className="flex items-end gap-1.5 h-20">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-md"
              style={{
                background: i === 4
                  ? "linear-gradient(180deg, #D4522A, #C04020)"
                  : "linear-gradient(180deg, #3A2818, #2A1C10)",
              }}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.08 + 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>

        {/* Ligne base */}
        <div className="h-px bg-[#3A2818] mt-1 mb-3" />

        {/* Pills */}
        <div className="flex gap-2">
          {["Revenus", "Dépenses"].map((label, i) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{ background: i === 0 ? "#4A8A6A15" : "#D4522A15" }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: i === 0 ? "#4A8A6A" : "#D4522A" }}
              />
              <span className="text-[10px] font-medium" style={{ color: i === 0 ? "#4A8A6A" : "#D4522A" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Reflet */}
        <div
          className="absolute top-0 left-0 right-0 h-1/2 rounded-t-3xl pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(200,160,80,0.04), transparent)" }}
        />
      </div>
    </div>
  );
}

function IllustrationSecurite() {
    const TAGS = [
  { label: "Chiffré", color: "#4A8A6A", top: "-60px", left: "-70px", delay: 0 },
  { label: "Privé", color: "#C8A050", top: "-40px", right: "-60px", delay: 0.7 },
  { label: "Sécurisé", color: "#D4522A", bottom: "-50px", left: "-50px", delay: 1.4 },
];
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Hexagone SVG */}
      <svg width="220" height="220" viewBox="0 0 220 220" className="absolute">
        <motion.polygon
          points="110,10 200,57 200,153 110,200 20,153 20,57"
          fill="none"
          stroke="#C8A050"
          strokeWidth="1"
          strokeOpacity="0.2"
          animate={{ strokeOpacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.polygon
          points="110,30 180,67 180,143 110,180 40,143 40,67"
          fill="none"
          stroke="#D4522A"
          strokeWidth="0.5"
          strokeOpacity="0.15"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "110px 110px" }}
        />
      </svg>

      {/* Centre */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #1C1610, #251C14)",
            border: "1px solid #C8A05030",
            boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <motion.path
              d="M20 4L6 10V20C6 28.8 12.4 37 20 38.8C27.6 37 34 28.8 34 20V10L20 4Z"
              stroke="#C8A050"
              strokeWidth="1.5"
              fill="rgba(200,160,80,0.08)"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ strokeOpacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path
              d="M14 20L18 24L26 16"
              stroke="#4A8A6A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            />
          </svg>
        </div>

        {/* Tags */}
        {TAGS.map((tag) => (
  <motion.div
    key={tag.label}
    className="absolute text-xs font-semibold px-3 py-1.5 rounded-xl"
    style={{
      background: `${tag.color}15`,
      border: `1px solid ${tag.color}30`,
      color: tag.color,
      top: tag.top,
      left: tag.left,
      right: tag.right,
      bottom: tag.bottom,
    }}
    animate={{ opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 2, repeat: Infinity, delay: tag.delay }}
  >
    {tag.label}
  </motion.div>
))}
      </motion.div>
    </div>
  );
}

function IllustrationVitesse() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Chiffre oversized */}
      <motion.p
        className="absolute text-[180px] font-black text-[#D4522A]/5 leading-none select-none"
        style={{ fontFamily: "var(--font-sora)" }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        PWA
      </motion.p>

      {/* Carte mobile stylisée */}
      <motion.div
        className="relative z-10"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-48 rounded-[2rem] p-4 space-y-3"
          style={{
            background: "linear-gradient(145deg, #1C1610, #251C14)",
            border: "1px solid #3A281860",
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          }}
        >
          {/* Barre status */}
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] text-[#9A8060]">9:41</span>
            <div className="flex gap-1">
              {[3, 4, 5].map((h) => (
                <div key={h} className="w-1 rounded-full bg-[#9A8060]" style={{ height: h }} />
              ))}
            </div>
          </div>

          {/* Solde */}
          <div className="px-1">
            <p className="text-[10px] text-[#9A8060]">Solde</p>
            <p className="text-xl font-bold text-[#F2E8D8]" style={{ fontFamily: "var(--font-sora)" }}>
              12 840 <span className="text-[#C8A050] text-sm">XOF</span>
            </p>
          </div>

          {/* Transaction rapide */}
          <motion.div
            className="rounded-xl p-2.5 flex items-center gap-2"
            style={{ background: "#D4522A15", border: "1px solid #D4522A25" }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-6 rounded-lg bg-[#D4522A] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">+</span>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#F2E8D8]">Ajout rapide</p>
              <p className="text-[9px] text-[#9A8060]">Hors ligne ✓</p>
            </div>
          </motion.div>

          {/* Barre du bas */}
          <div className="flex justify-center pt-1">
            <div className="w-12 h-1 rounded-full bg-[#3A2818]" />
          </div>
        </div>

        {/* Badge PWA */}
        <motion.div
          className="absolute -top-3 -right-3 px-2.5 py-1 rounded-xl text-[10px] font-bold"
          style={{
            background: "linear-gradient(135deg, #D4522A, #C04020)",
            boxShadow: "0 4px 12px rgba(212,82,42,0.4)",
            color: "white",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          PWA
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Données des slides ─────────────────────────────────────

const STEPS = [
  {
    tag: "Bienvenue",
    title: "Votre argent,\nenfin clair.",
    description: "Kera vous donne une vision sereine et précise de vos finances personnelles.",
    color: "#D4522A",
    illustration: <IllustrationWelcome />,
  },
  {
    tag: "Tableau de bord",
    title: "Tout voir\nd'un coup d'œil.",
    description: "Revenus, dépenses, tendances — chaque chiffre à sa place, au bon moment.",
    color: "#C8A050",
    illustration: <IllustrationClarte />,
  },
  {
    tag: "Sécurité",
    title: "Vos données\nvous appartiennent.",
    description: "Chiffrement, confidentialité totale. Nous ne vendons rien, jamais.",
    color: "#C8A050",
    illustration: <IllustrationSecurite />,
  },
  {
    tag: "Technologie",
    title: "Rapide.\nMême hors ligne.",
    description: "Installez Kera sur votre téléphone et gérez vos finances partout, sans connexion.",
    color: "#D4522A",
    illustration: <IllustrationVitesse />,
  },
];

// ── Composant principal ────────────────────────────────────

export default function OnboardingSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef<number | null>(null);

  const handleFinish = () => {
    Cookies.set("kera_onboarding_seen", "true", { expires: 365 });
  };

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const nextStep = () => {
    if (current < STEPS.length - 1) goTo(current + 1);
  };

  // Swipe tactile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && current < STEPS.length - 1) goTo(current + 1);
      if (diff < 0 && current > 0) goTo(current - 1);
    }
    touchStartX.current = null;
  };

  const step = STEPS[current];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between py-12 px-6 relative overflow-hidden"
      style={{ background: "#0E0B08" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Fond animé */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <div
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full"
          style={{
            background: `radial-gradient(circle, ${step.color}08 0%, transparent 70%)`,
            filter: "blur(60px)",
            transition: "background 0.6s ease",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full"
          style={{
            background: "radial-gradient(circle, #C8A05005 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </motion.div>

      {/* Header */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #D4522A, #C04020)",
              boxShadow: "0 4px 12px rgba(212,82,42,0.3)",
            }}
          >
            <TrendingUp size={15} className="text-white" />
          </div>
          <span
            className="text-[#F2E8D8] font-bold tracking-widest text-sm uppercase"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Kera
          </span>
        </div>

        {/* Skip */}
        {current < STEPS.length - 1 && (
          <button
            onClick={() => { handleFinish(); window.location.href = "/login"; }}
            className="text-xs font-semibold text-[#9A8060] hover:text-[#F2E8D8] transition-colors px-3 py-1.5 rounded-xl"
            style={{ background: "#1C161080", border: "1px solid #3A281840" }}
          >
            Ignorer
          </button>
        )}
      </div>

      {/* Illustration */}
      <div className="relative z-10 w-full max-w-md flex-1 flex flex-col items-center justify-center">
        <div className="w-full h-64">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: direction * -60, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              {step.illustration}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Texte */}
        <div className="text-center mt-8 min-h-[140px] px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Tag */}
              <div className="flex justify-center mb-3">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{
                    background: `${step.color}15`,
                    color: step.color,
                    border: `1px solid ${step.color}30`,
                  }}
                >
                  {step.tag}
                </span>
              </div>

              <h2
                className="text-3xl font-extrabold text-[#F2E8D8] mb-3 tracking-tight leading-tight whitespace-pre-line"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {step.title}
              </h2>
              <p className="text-[#9A8060] text-base leading-relaxed max-w-[280px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full max-w-md space-y-6">

        {/* Indicateur de progression */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-[#9A8060]">
              {current + 1} / {STEPS.length}
            </span>
            <span className="text-xs text-[#9A8060]">
              {Math.round(((current + 1) / STEPS.length) * 100)}%
            </span>
          </div>
          {/* Barre de progression */}
          <div className="h-1 rounded-full w-full" style={{ background: "#3A2818" }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #D4522A, #C8A050)",
              }}
              animate={{ width: `${((current + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          {/* Dots cliquables */}
          <div className="flex justify-center gap-2 pt-1">
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: current === idx ? 24 : 6,
                  height: 6,
                  background: current === idx
                    ? "linear-gradient(90deg, #D4522A, #C8A050)"
                    : "#3A2818",
                }}
              />
            ))}
          </div>
        </div>

        {/* Boutons */}
        <div className="flex flex-col gap-3">
          {current < STEPS.length - 1 ? (
            <button
              onClick={nextStep}
              className="group w-full py-4 rounded-[1.5rem] font-bold text-[#F2E8D8] flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(145deg, #1C1610, #251C14)",
                border: "1px solid #3A2818",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#D4522A40"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "#3A2818"}
            >
              Continuer
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform"
                style={{ background: "linear-gradient(135deg, #D4522A, #C04020)" }}
              >
                <ChevronRight size={16} className="text-white" />
              </div>
            </button>
          ) : (
            <Link
              href="/login"
              onClick={handleFinish}
              className="w-full py-4 rounded-[1.5rem] font-bold text-white text-center transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #D4522A 0%, #C04020 100%)",
                boxShadow: "0 8px 32px rgba(212,82,42,0.4)",
              }}
            >
              Démarrer mon suivi →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}