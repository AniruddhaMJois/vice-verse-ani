"use client";

import React, { useEffect, useRef } from "react";

interface MatrixRainProps {
  className?: string;
  opacity?: number;
}

export function MatrixRain({ className, opacity = 0.09 }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initColumns();
    };

    window.addEventListener("resize", handleResize);

    // Characters: Katakana + Hex + System glyphs
    const glyphs = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEF<>{}[]/*+=~$_";
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);

    interface ColumnData {
      y: number;
      speed: number;
      isPinkHead: boolean;
      chars: string[];
    }

    let colData: ColumnData[] = [];

    const initColumns = () => {
      columns = Math.floor(width / fontSize);
      colData = [];
      for (let i = 0; i < columns; i++) {
        colData.push({
          y: Math.random() * -100,
          speed: 0.6 + Math.random() * 0.8,
          isPinkHead: i % 12 === 0, // 1 in 12 columns has pink head for dual accent
          chars: Array.from({ length: 30 }, () => glyphs[Math.floor(Math.random() * glyphs.length)]),
        });
      }
    };

    initColumns();

    // Mouse pointer interaction within 160px
    let mouseX = -999;
    let mouseY = -999;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      // Clear with slight alpha fade
      ctx.fillStyle = "rgba(2, 4, 10, 0.16)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < colData.length; i++) {
        const col = colData[i];
        const x = i * fontSize;
        const currentY = col.y * fontSize;

        // Proximity calculation for mouse acceleration
        const dx = x - mouseX;
        const dy = currentY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isNearMouse = dist < 160;

        // Pick random glyph
        if (Math.random() < 0.05) {
          col.chars[0] = glyphs[Math.floor(Math.random() * glyphs.length)];
        }

        const headChar = col.chars[0];

        // Draw head glyph
        if (isNearMouse) {
          ctx.fillStyle = col.isPinkHead ? "#FF5CB8" : "#B8FF3C";
          ctx.shadowBlur = 8;
          ctx.shadowColor = col.isPinkHead ? "#FF2E9A" : "#00FF41";
        } else {
          ctx.fillStyle = col.isPinkHead ? "#FF5CB8" : "#00FF41";
          ctx.shadowBlur = 0;
        }

        ctx.fillText(headChar, x, currentY);

        // Draw trailing glyphs
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(0, 184, 74, 0.4)";
        const trailLength = isNearMouse ? 16 : 10;
        for (let j = 1; j < trailLength; j++) {
          const trailY = currentY - j * fontSize;
          if (trailY > 0 && trailY < height) {
            const char = col.chars[j % col.chars.length];
            const trailAlpha = Math.max(0, 0.4 - j * 0.03);
            ctx.fillStyle = col.isPinkHead && j < 3 ? `rgba(255, 46, 154, ${trailAlpha})` : `rgba(0, 255, 65, ${trailAlpha})`;
            ctx.fillText(char, x, trailY);
          }
        }

        // Advance column
        col.y += isNearMouse ? col.speed * 2.2 : col.speed;

        // Reset column if it went off screen
        if (currentY > height + 200 && Math.random() > 0.975) {
          col.y = 0;
          col.speed = 0.6 + Math.random() * 0.8;
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 ${className || ""}`}
      style={{ opacity }}
    />
  );
}
