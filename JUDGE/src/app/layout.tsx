import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Yellowtail } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CommandPalette } from "@/components/patterns/CommandPalette";
import { NebulaBackground } from "@/components/brand/NebulaBackground";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const yellowtail = Yellowtail({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ViceVerse '26 — Futuristic Evaluation Portal",
  description: "Official Final Round jury assessment and mentor observation portal for ViceVerse Hackathon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable} ${yellowtail.variable}`}>
      <body className="bg-[var(--bg)] text-text font-sans antialiased min-h-screen flex flex-col selection:bg-accent/30 selection:text-white relative">
        <NebulaBackground />
        <AuthProvider>
          <div className="relative z-10 flex-1 flex flex-col min-h-screen">
            {children}
          </div>
          <CommandPalette />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              className:
                "!bg-surface-2 !text-text !border !border-border !rounded-[8px] !shadow-pop font-mono text-xs !py-3 !px-4",
              style: {
                backgroundColor: "var(--surface-2)",
                color: "var(--text)",
                borderColor: "var(--border)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
