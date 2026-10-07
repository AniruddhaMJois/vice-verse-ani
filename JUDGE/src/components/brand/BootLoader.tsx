"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";

interface BootLoaderProps {
  onComplete?: () => void;
  forceShow?: boolean;
  portalName?: string;
}

export function BootLoader({ onComplete, forceShow = false, portalName }: BootLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);
  const [progress, setProgress] = useState(10);

  const statusLines = [
    `Initializing ${portalName || "ViceVerse"} subsystem...`,
    "Loading scoring matrices & rubrics...",
    "Syncing consensus node telemetry...",
    "Authenticating secure tunnel...",
    "Ready.",
  ];

  useEffect(() => {
    if (!forceShow) {
      try {
        const hasBooted = sessionStorage.getItem(`viceverse_booted_${portalName || "default"}`);
        if (hasBooted) {
          setIsVisible(false);
          onComplete?.();
          return;
        }
      } catch {}
    }

    const interval = setInterval(() => {
      setLineIndex((prev) => {
        if (prev < statusLines.length - 1) return prev + 1;
        return prev;
      });
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 25;
      });
    }, 320);

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        try {
          sessionStorage.setItem(`viceverse_booted_${portalName || "default"}`, "true");
        } catch {}
        onComplete?.();
      }, 350);
    }, 1400);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete, forceShow, portalName]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }}
          className="fixed inset-0 z-[100] bg-[#03050A] flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Dual subtle central glow */}
          <div
            className="absolute w-80 h-80 rounded-full blur-[100px] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 40% 60%, rgba(255, 46, 154, 0.16) 0%, rgba(0, 255, 65, 0.12) 60%, transparent 80%)",
            }}
          />

          {/* Centered Logo & Brand */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
            className="flex flex-col items-center text-center space-y-6 z-10"
          >
            <Logo size="lg" showSubtitle={false} isLink={false} />

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest text-signal">
                <span>{portalName ? `${portalName} INITIALIZING` : "INITIALIZING"}</span>
                <span className="inline-block w-1.5 h-3.5 bg-accent animate-pulse" />
              </div>

              <div className="h-5 flex items-center justify-center">
                <motion.p
                  key={lineIndex}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-[11px] text-text-faint"
                >
                  {statusLines[lineIndex]}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* 2px Gradient Progress Line at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 w-full h-[2px] bg-surface-3">
            <div
              className="h-full transition-all duration-300 ease-out shadow-glow-dual"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #FF2E9A 0%, #7B3FF2 32%, #22D3EE 66%, #00FF41 100%)",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
