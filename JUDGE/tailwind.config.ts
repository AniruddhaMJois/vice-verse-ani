import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../SHARED/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-elevated": "var(--bg-elevated)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        "border-faint": "var(--border-faint)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        "text-faint": "var(--text-faint)",
        "text-inverse": "var(--text-inverse)",

        // Pink family (human voice)
        accent: "var(--accent)",
        "accent-hot": "var(--accent-hot)",
        "accent-deep": "var(--accent-deep)",
        "accent-bg": "var(--accent-bg)",
        "accent-border": "var(--accent-border)",

        // Green family (machine voice)
        signal: "var(--signal)",
        "signal-lime": "var(--signal-lime)",
        "signal-dim": "var(--signal-dim)",
        "signal-deep": "var(--signal-deep)",
        "signal-bg": "var(--signal-bg)",
        "signal-border": "var(--signal-border)",

        // Bridges & Helpers
        "accent-2": "var(--accent-2)",
        "accent-3": "var(--accent-3)",
        info: "var(--info)",
        "info-bg": "var(--info-bg)",
        warning: "var(--warning)",
        "warning-bg": "var(--warning-bg)",
        danger: "var(--danger)",
        "danger-bg": "var(--danger-bg)",
        neutral: "var(--neutral)",
        "neutral-bg": "var(--neutral-bg)",
        locked: "var(--locked)",
        "locked-bg": "var(--locked-bg)",

        // Backward compatibility
        "neon-pink": "var(--accent)",
        "neon-magenta": "var(--neon-magenta)",
        "neon-purple": "var(--accent-2)",
        "neon-blue": "var(--neon-blue)",
        "neon-cyan": "var(--info)",
        "neon-orange": "var(--accent-3)",
        "neon-green": "var(--signal)",
        success: "var(--signal)",
        "success-bg": "var(--signal-bg)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Space Mono", "monospace"],
        script: ["var(--font-script)", "Pacifico", "Yellowtail", "cursive"],
      },
      borderRadius: {
        control: "var(--radius-control)",
        card: "var(--radius-card)",
        dialog: "var(--radius-dialog)",
      },
      boxShadow: {
        "glow-pink": "var(--glow-pink)",
        "glow-green": "var(--glow-green)",
        "glow-dual": "var(--glow-dual)",
        card: "var(--shadow-card)",
        pop: "var(--shadow-pop)",
      },
    },
  },
  plugins: [],
};

export default config;
