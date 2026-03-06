import type { Metadata, Viewport } from "next";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

// ─────────────────────────────────────────────
// Fonts Google — chargées via Next.js
// Les variables CSS sont injectées dans <html>
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Viewport — séparé de metadata (Next.js 14+)
// userScalable: false évite le zoom accidentel
// sur mobile mais nuit à l'accessibilité —
// à reconsidérer si des utilisateurs malvoyants
// utilisent l'app
// ─────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#0E0B08" },
    { media: "(prefers-color-scheme: light)", color: "#FAF6F0" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// ─────────────────────────────────────────────
// Metadata — SEO + PWA
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Layout racine
//
// suppressHydrationWarning est requis par
// next-themes pour éviter les erreurs
// d'hydratation liées au thème initial
// ─────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${sora.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-jakarta antialiased min-h-screen"
        style={{
          background: "var(--body-bg)",
          color: "var(--texte)",
          backgroundImage: `
            radial-gradient(ellipse at 20% 0%,   var(--body-radial-1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, var(--body-radial-2) 0%, transparent 50%)
          `,
        }}
      >
        {/* ThemeProvider — gère data-theme sur <html>
            defaultTheme: dark (Sahara Premium)
            enableSystem: false — pas de détection OS
            storageKey: permet de persister le choix
        */}
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={false}
          themes={["dark", "light"]}
          storageKey="kera-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}