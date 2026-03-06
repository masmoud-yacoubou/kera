"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { TransactionsProvider } from "@/context/TransactionsContext";

// ─────────────────────────────────────────────
// Layout dashboard
//
// Gère l'état de la sidebar (ouvert/fermé)
// et le distribue au Sidebar et au Header.
//
// Mobile  : sidebar fermée par défaut, s'ouvre
//           en drawer via le bouton hamburger
// Desktop : sidebar ouverte par défaut, rétractable
// ─────────────────────────────────────────────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <TransactionsProvider>
      <div
        className="min-h-screen flex"
        style={{
          background: "var(--fond)",
          backgroundImage: `
            radial-gradient(ellipse at 0%   0%,   var(--accent-10) 0%, transparent 40%),
            radial-gradient(ellipse at 100% 100%, var(--or-08)     0%, transparent 40%)
          `,
        }}
      >
        {/* Sidebar — sticky desktop / drawer mobile */}
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

        {/* Zone de contenu principale */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Header — reçoit le toggle pour le bouton hamburger */}
          <Header sidebarOpen={sidebarOpen} onMenuToggle={toggleSidebar} />

          {/* Contenu de la page */}
          <main
            className="flex-1 p-4 md:p-6 overflow-auto"
            style={{
              backgroundImage: `radial-gradient(ellipse at 50% 0%, var(--or-08) 0%, transparent 60%)`,
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </TransactionsProvider>
  );
}