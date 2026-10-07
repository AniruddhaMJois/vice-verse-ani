"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MatrixRain } from "@/components/brand/MatrixRain";
import { GradientStrip } from "@/components/brand/GradientStrip";
import { ScriptText } from "@/components/brand/ScriptText";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/patterns/Marquee";
import { StatCard } from "@/components/patterns/StatCard";
import {
  ArrowRight,
  ShieldCheck,
  Eye,
  Layers,
  Award,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  const [activeMicroIndex, setActiveMicroIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  // Micro-labels cycling 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMicroIndex((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Parallax pointer listener for desktop
  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || window.innerWidth < 768) return;
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setMousePos({
      x: (clientX - centerX) / centerX,
      y: (clientY - centerY) / centerY,
    });
  };

  const featureTiles = [
    {
      id: "01",
      title: "Realtime Jury Telemetry",
      tag: "Live Sync",
      description: "Sub-second rubric synchronization across jury clusters with instant consensus state machine.",
      duotone: "pink",
      gradient: "from-accent/20 via-surface-2 to-void",
      rimColor: "border-signal/40",
    },
    {
      id: "02",
      title: "Standardized Final Matrix",
      tag: "100 Marks Rubric",
      description: "Rigorous criteria breakdown across Architecture, Innovation, Market Impact, and Live Defense.",
      duotone: "violet-green",
      gradient: "from-accent-2/20 via-surface-2 to-signal/10",
      rimColor: "border-accent/40",
    },
    {
      id: "03",
      title: "Isolated Portal Fencing",
      tag: "Zero Cross-Pollution",
      description: "Cryptographically strict role separation between Judge assessment and Mentor observational pipelines.",
      duotone: "green",
      gradient: "from-signal/20 via-surface-2 to-void",
      rimColor: "border-accent/40",
    },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-transparent text-text flex flex-col justify-between overflow-x-hidden"
    >

      {/* 2. Slow Opposite Drift Corner Glows */}
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 w-[550px] h-[550px] rounded-full blur-[140px] opacity-45 transition-transform duration-1000 ease-out"
        style={{
          background: "radial-gradient(circle, #FF2E9A 0%, #7B3FF2 50%, transparent 80%)",
          transform: `translate(${mousePos.x * -16}px, ${mousePos.y * -16}px)`,
        }}
      />
      <div
        className="pointer-events-none absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full blur-[140px] opacity-40 transition-transform duration-1000 ease-out"
        style={{
          background: "radial-gradient(circle, #00FF41 0%, #22D3EE 50%, transparent 80%)",
          transform: `translate(${mousePos.x * 16}px, ${mousePos.y * 16}px)`,
        }}
      />

      {/* 3. Frosted Glass Ribbons with Opposite Rim Lights */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {/* Left Ribbon: Pink-tinted frosted glass with Green rim light */}
        <div
          className="absolute -left-20 top-1/4 w-[420px] h-[640px] rounded-[180px] blur-[1px] border border-signal/40 opacity-45 -rotate-12 mix-blend-screen transition-transform duration-700 ease-out"
          style={{
            background:
              "radial-gradient(ellipse at 35% 50%, rgba(255, 46, 154, 0.28) 0%, rgba(123, 63, 242, 0.12) 60%, transparent 85%)",
            boxShadow: "inset 0 0 32px rgba(0, 255, 65, 0.4)",
            backdropFilter: "blur(8px)",
            transform: `translate(${mousePos.x * -12}px, ${mousePos.y * -12}px) rotate(-12deg)`,
          }}
        />

        {/* Right Ribbon: Green-tinted frosted glass with Pink rim light */}
        <div
          className="absolute -right-20 top-1/3 w-[420px] h-[640px] rounded-[180px] blur-[1px] border border-accent/40 opacity-45 rotate-12 mix-blend-screen transition-transform duration-700 ease-out"
          style={{
            background:
              "radial-gradient(ellipse at 65% 50%, rgba(0, 255, 65, 0.24) 0%, rgba(34, 211, 238, 0.12) 60%, transparent 85%)",
            boxShadow: "inset 0 0 32px rgba(255, 46, 154, 0.4)",
            backdropFilter: "blur(8px)",
            transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px) rotate(12deg)`,
          }}
        />
      </div>

      {/* 4. Matrix Digital Rain Layer */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-25">
        <MatrixRain opacity={0.4} />
      </div>

      {/* 5. Center Scrim to guarantee WCAG AA text legibility */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 35%, rgba(3, 5, 10, 0.72) 0%, rgba(3, 5, 10, 0.95) 100%)",
        }}
      />

      {/* 6. Main Content */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-20 flex-1 flex flex-col justify-between">
        {/* Hero Section */}
        <section className="text-center space-y-6 sm:space-y-8 max-w-3xl mx-auto pt-8 sm:pt-16">
          {/* Section Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-2/80 backdrop-blur-md border border-border text-xs font-mono text-text-muted select-none shadow-sm">
            <span className="w-2 h-2 rounded-full bg-signal animate-pulse shadow-[0_0_6px_var(--signal)]" />
            <span className="text-accent font-semibold tracking-wider">VICEVERSE &apos;26</span>
            <span className="text-border-strong">&bull;</span>
            <span className="text-text-muted">FINAL ROUND SYSTEM</span>
          </div>

          {/* Headline & Script Tagline */}
          <div className="space-y-3">
            <ScriptText variant="pink" size="md">
              Ideate. Visualize. Create.
            </ScriptText>

            <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-white leading-[1.08]">
              Futuristic Evaluation for the Next Wave of{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #FF2E9A 0%, #7B3FF2 32%, #22D3EE 66%, #00FF41 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Visionaries
              </span>
              <span className="text-signal inline-block animate-pulse ml-1 shadow-[0_0_8px_var(--signal)]">.</span>
            </h1>

            <p className="text-sm sm:text-base text-text-muted max-w-[56ch] mx-auto leading-relaxed">
              Jury assessment, standardized rubric scoring, and project dossier inspection designed for
              the ViceVerse hackathon ecosystem.
            </p>

            {/* Vertical Micro-labels SCORE / REVIEW / SUBMIT cycling brightness */}
            <div className="flex items-center justify-center gap-4 pt-3 font-mono text-[11px] uppercase tracking-widest select-none">
              <span
                className={`transition-all duration-300 font-semibold ${
                  activeMicroIndex === 0
                    ? "text-accent scale-110 drop-shadow-[0_0_8px_rgba(255,46,154,0.8)]"
                    : "text-text-faint opacity-50"
                }`}
              >
                SCORE
              </span>
              <span className="text-border-strong">&bull;</span>
              <span
                className={`transition-all duration-300 font-semibold ${
                  activeMicroIndex === 1
                    ? "text-signal scale-110 drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]"
                    : "text-text-faint opacity-50"
                }`}
              >
                REVIEW
              </span>
              <span className="text-border-strong">&bull;</span>
              <span
                className={`transition-all duration-300 font-semibold ${
                  activeMicroIndex === 2
                    ? "text-accent scale-110 drop-shadow-[0_0_8px_rgba(255,46,154,0.8)]"
                    : "text-text-faint opacity-50"
                }`}
              >
                SUBMIT
              </span>
            </div>
          </div>

          {/* CTAs: Separate Judge and Mentor Portal Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
            <Link href="/judge/login" className="w-full sm:w-1/2">
              <Button
                variant="primary"
                size="lg"
                className="w-full text-sm shadow-glow-pink font-mono tracking-wider justify-center"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                leftIcon={<ShieldCheck className="w-4 h-4 text-accent" />}
              >
                Judge Portal &rarr;
              </Button>
            </Link>

            <Link href="/mentor/login" className="w-full sm:w-1/2">
              <Button
                variant="secondary-green"
                size="lg"
                className="w-full text-sm hover:shadow-glow-green font-mono tracking-wider justify-center"
                leftIcon={<Eye className="w-4 h-4 text-signal" />}
              >
                Mentor Portal &rarr;
              </Button>
            </Link>
          </div>
        </section>

        {/* Gradient Divider Strip */}
        <GradientStrip height="thin" withGlow={true} className="my-14 sm:my-18" />

        {/* Marquee Banner */}
        <Marquee label="SYSTEM NODES" />

        {/* Three Duotone 3D Image/Feature Tiles with Diagonal Slashes */}
        <section className="my-12">
          <div className="text-center mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
              CORE CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-tight mt-1">
              Precision Infrastructure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featureTiles.map((tile) => (
              <div
                key={tile.id}
                className={`relative p-6 rounded-card border bg-surface/80 backdrop-blur-md transition-all duration-300 group overflow-hidden flex flex-col justify-between h-[230px] select-none hover:-translate-y-1.5 ${tile.rimColor} hover:shadow-glow-dual`}
                style={{
                  transform: `perspective(800px) rotateX(${mousePos.y * 3}deg) rotateY(${mousePos.x * -3}deg)`,
                }}
              >
                {/* Diagonal slash cut-out */}
                <div
                  className="absolute -right-6 -top-6 w-14 h-14 transform rotate-45 pointer-events-none opacity-40 group-hover:scale-110 group-hover:translate-x-1 transition-transform"
                  style={{
                    borderBottom: tile.duotone === "pink" ? "2px solid #00FF41" : "2px solid #FF2E9A",
                  }}
                />

                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-light text-text-faint group-hover:text-white transition-colors">
                    {tile.id}
                  </span>
                  <span
                    className={`font-mono text-[10px] px-2.5 py-0.5 rounded-[4px] border ${
                      tile.duotone === "pink"
                        ? "bg-accent/15 text-accent border-accent/30"
                        : tile.duotone === "green"
                        ? "bg-signal/15 text-signal border-signal/30"
                        : "bg-surface-3 text-cyan-400 border-cyan-500/30"
                    }`}
                  >
                    {tile.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-white tracking-tight">{tile.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                    {tile.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Metrics Row (No Graphs, Clean Numbers & Status Chips) */}
        <section className="my-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              label="Final Round Teams"
              value={12}
              caption="Validated dossiers in roster"
              accentVariant="pink"
              statusChip="+4 today"
              icon={<Layers className="w-5 h-5 text-accent" />}
            />
            <StatCard
              label="Evaluations Finalized"
              value={8}
              suffix="/ 12"
              caption="Jury assessments submitted"
              accentVariant="green"
              statusChip="67% DONE"
              icon={<Award className="w-5 h-5 text-signal" />}
            />
            <StatCard
              label="Consensus Node"
              value="Active"
              caption="Zero-latency telemetry sync"
              accentVariant="green"
              isLivePulsing={true}
              statusChip="LIVE"
              icon={<Zap className="w-5 h-5 text-signal" />}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-signal" />
            <span>VICEVERSE EVALUATION ENGINE &copy; 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/judge/login" className="hover:text-accent transition-colors">
              Judge Login
            </Link>
            <Link href="/mentor/login" className="hover:text-signal transition-colors">
              Mentor Login
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
