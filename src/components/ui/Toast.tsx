// src/components/ui/Toast.tsx
// ─────────────────────────────────────────────
// Système de toast notifications Kera
// Utilise sonner — npm install sonner
//
// Usage depuis n'importe quel composant :
//   import { toast } from "@/components/ui/Toast"
//   toast.success("Transaction ajoutée")
//   toast.error("Erreur de suppression")
//   toast.info("Devise mise à jour")
// ─────────────────────────────────────────────
"use client";

import { Toaster, toast as sonnerToast } from "sonner";
import { Check, X, Info, AlertTriangle } from "lucide-react";

// ── Toaster à placer dans layout.tsx ────────────────────────
export function KerToaster() {
  return (
    <Toaster
      position="bottom-right"
      gap={8}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "kera-toast",
        },
        duration: 3500,
      }}
    />
  );
}

// ── API toast — wrapper typé autour de sonner ────────────────
export const toast = {
  success: (message: string, description?: string) =>
    sonnerToast.custom(() => (
      <ToastItem
        icon={<Check size={14} strokeWidth={2.5} />}
        message={message}
        description={description}
        variant="success"
      />
    )),

  error: (message: string, description?: string) =>
    sonnerToast.custom(() => (
      <ToastItem
        icon={<X size={14} strokeWidth={2.5} />}
        message={message}
        description={description}
        variant="error"
      />
    )),

  info: (message: string, description?: string) =>
    sonnerToast.custom(() => (
      <ToastItem
        icon={<Info size={14} strokeWidth={2} />}
        message={message}
        description={description}
        variant="info"
      />
    )),

  warning: (message: string, description?: string) =>
    sonnerToast.custom(() => (
      <ToastItem
        icon={<AlertTriangle size={14} strokeWidth={2} />}
        message={message}
        description={description}
        variant="warning"
      />
    )),
};

// ── Composant de rendu d'un toast ────────────────────────────
type Variant = "success" | "error" | "info" | "warning";

const VARIANT_STYLES: Record<Variant, {
  icon: string;
  iconBg: string;
  border: string;
  label: string;
}> = {
  success: {
    icon:   "var(--succes)",
    iconBg: "var(--succes-soft)",
    border: "var(--succes-soft)",
    label:  "Succès",
  },
  error: {
    icon:   "var(--accent)",
    iconBg: "var(--accent-10)",
    border: "var(--accent-20)",
    label:  "Erreur",
  },
  info: {
    icon:   "var(--or)",
    iconBg: "var(--or-10)",
    border: "var(--or-20)",
    label:  "Info",
  },
  warning: {
    icon:   "#E8A020",
    iconBg: "rgba(232,160,32,0.10)",
    border: "rgba(232,160,32,0.20)",
    label:  "Attention",
  },
};

function ToastItem({
  icon,
  message,
  description,
  variant,
}: {
  icon: React.ReactNode;
  message: string;
  description?: string;
  variant: Variant;
}) {
  const s = VARIANT_STYLES[variant];

  return (
    <div
      className="flex items-start gap-3 px-4 py-3.5 rounded-2xl min-w-[280px] max-w-[360px]"
      style={{
        background: "linear-gradient(145deg, var(--carte), var(--carte-2))",
        border: `1px solid ${s.border}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)",
        backdropFilter: "blur(12px)",
      }}
      role="status"
      aria-live="polite"
    >
      {/* Icône */}
      <div
        className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: s.iconBg, color: s.icon }}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Texte */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-bold leading-snug"
          style={{ color: "var(--texte)", fontFamily: "var(--font-sora)" }}
        >
          {message}
        </p>
        {description && (
          <p
            className="text-[11px] mt-0.5 leading-snug"
            style={{ color: "var(--muted)" }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Trait coloré gauche */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
        style={{ background: s.icon }}
        aria-hidden="true"
      />
    </div>
  );
}