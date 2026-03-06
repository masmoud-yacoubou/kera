"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

// ─────────────────────────────────────────────
// FAB — Floating Action Button
//
// Bouton principal d'ajout de transaction.
// Toujours visible, fixé en bas à droite.
//
// Thème : les couleurs accent sont hardcodées
// car utilisées dans des boxShadow rgba() et
// des gradients inline — les CSS variables ne
// sont pas interpolables dans ces contextes.
// ─────────────────────────────────────────────
export default function FAB({ onClick }: { onClick: () => void }) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 300);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Ajouter une transaction"
      title="Ajouter une transaction"
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center transition-all duration-200"
      style={{
        width: "56px",
        height: "56px",
        borderRadius: "999px",
        // Gradient légèrement plus sombre au press
        background: pressed
          ? "linear-gradient(135deg, #C04020 0%, #A83018 100%)"
          : "linear-gradient(135deg, var(--accent) 0%, #C04020 100%)",
        boxShadow: pressed
          ? "0 4px 12px rgba(212,82,42,0.3)"
          : "0 8px 32px rgba(212,82,42,0.45), 0 2px 8px rgba(0,0,0,0.3)",
        transform: pressed ? "scale(0.92)" : "scale(1)",
        // Anneau or subtil via border — utilise la variable
        border: "1px solid var(--or-20)",
      }}
      onMouseEnter={(e) => {
        if (!pressed) {
          e.currentTarget.style.boxShadow =
            "0 12px 40px rgba(212,82,42,0.55), 0 4px 12px rgba(0,0,0,0.3)";
          e.currentTarget.style.transform = "scale(1.08)";
        }
      }}
      onMouseLeave={(e) => {
        if (!pressed) {
          e.currentTarget.style.boxShadow =
            "0 8px 32px rgba(212,82,42,0.45), 0 2px 8px rgba(0,0,0,0.3)";
          e.currentTarget.style.transform = "scale(1)";
        }
      }}
    >
      {/* Anneau décoratif intérieur */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(255,255,255,0.12)" }}
      />

      {/* Icône — pivote à 45° au press pour indiquer la fermeture */}
      <Plus
        size={22}
        className="text-white transition-transform duration-200"
        aria-hidden="true"
        style={{ transform: pressed ? "rotate(45deg)" : "rotate(0deg)" }}
      />
    </button>
  );
}