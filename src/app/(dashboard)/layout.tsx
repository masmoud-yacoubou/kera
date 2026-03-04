"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { TransactionsProvider } from "@/context/TransactionsContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <TransactionsProvider>
      <div
        className="min-h-screen flex"
        style={{
          background: "#0E0B08",
          backgroundImage: `
            radial-gradient(ellipse at 0% 0%, #D4522A0A 0%, transparent 40%),
            radial-gradient(ellipse at 100% 100%, #C8A05006 0%, transparent 40%)
          `,
        }}
      >
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex-1 flex flex-col min-w-0">
          <Header sidebarOpen={sidebarOpen} />

          <main
            className="flex-1 p-6 overflow-auto"
            style={{
              backgroundImage: `radial-gradient(ellipse at 50% 0%, #C8A05005 0%, transparent 60%)`,
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </TransactionsProvider>
  );
}