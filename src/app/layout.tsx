import type { Metadata, Viewport } from "next";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css"; // <-- Vérifie bien que ce fichier existe dans src/app/

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// Configuration viewport séparée (Recommandé pour Next.js 14+)
export const viewport: Viewport = {
  themeColor: "#0E0B08",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Kera — Gestion financière",
  description: "La maîtrise sereine de vos finances personnelles",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kera",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sora.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body
        className="font-jakarta bg-[#0E0B08] text-[#F2E8D8] antialiased min-h-screen"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 0%, #D4522A08 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, #C8A05006 0%, transparent 50%)
          `,
        }}
      >
        {children}
      </body>
    </html>
  );
}