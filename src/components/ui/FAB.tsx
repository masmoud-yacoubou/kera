"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

export default function FAB({ onClick }: { onClick: () => void }) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={() => {
        setPressed(true);
        setTimeout(() => setPressed(false), 300);
        onClick();
      }}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center transition-all duration-200"
      style={{
        width: "56px",
        height: "56px",
        borderRadius: "999px",
        background: pressed
          ? "linear-gradient(135deg, #C04020 0%, #A83018 100%)"
          : "linear-gradient(135deg, #D4522A 0%, #C04020 100%)",
        boxShadow: pressed
          ? "0 4px 12px rgba(212,82,42,0.3)"
          : "0 8px 32px rgba(212,82,42,0.45), 0 2px 8px rgba(0,0,0,0.3)",
        transform: pressed ? "scale(0.92)" : "scale(1)",
        border: "1px solid rgba(200,160,80,0.2)",
      }}
      onMouseEnter={(e) => {
        if (!pressed) {
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(212,82,42,0.55), 0 4px 12px rgba(0,0,0,0.3)";
          e.currentTarget.style.transform = "scale(1.08)";
        }
      }}
      onMouseLeave={(e) => {
        if (!pressed) {
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(212,82,42,0.45), 0 2px 8px rgba(0,0,0,0.3)";
          e.currentTarget.style.transform = "scale(1)";
        }
      }}
      aria-label="Ajouter une transaction"
      title="Ajouter une transaction"
    >
      {/* Anneau décoratif */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "999px",
        }}
      />

      <Plus
        size={22}
        className="text-white transition-transform duration-200"
        style={{ transform: pressed ? "rotate(45deg)" : "rotate(0deg)" }}
      />
    </button>
  );
}