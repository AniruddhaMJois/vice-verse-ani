"use client";

import React, { useEffect, useRef, useState } from "react";

interface WireframeGlobeProps {
  accentColor?: string; // e.g. #FF2E9A (pink)
  signalColor?: string; // e.g. #00FF41 (matrix green)
  className?: string;
  size?: number;
}

export function WireframeGlobe({
  accentColor = "#FF2E9A",
  signalColor = "#00FF41",
  className = "",
  size = 500,
}: WireframeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let isRunning = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = size * dpr;
    canvas.height = size * dpr;

    let rotX = 0.3;
    let rotY = 0;
    let autoRotSpeed = reducedMotion ? 0 : 0.005;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      rotY += dx * 0.008;
      rotX += dy * 0.008;
      rotX = Math.max(-1.2, Math.min(1.2, rotX));
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - lastMouseX;
      const dy = e.touches[0].clientY - lastMouseY;
      rotY += dx * 0.008;
      rotX += dy * 0.008;
      rotX = Math.max(-1.2, Math.min(1.2, rotX));
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    if (container) {
      container.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd);
    }

    const handleVisibilityChange = () => {
      isRunning = !document.hidden;
      if (isRunning) render();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 3D Point projection math
    const radius = (size * 0.42) * dpr;
    const cx = (size / 2) * dpr;
    const cy = (size / 2) * dpr;

    // Pre-generate grid points
    const latCount = 14;
    const lonCount = 20;

    let arcProgress = 0;

    const render = () => {
      if (!isRunning) return;

      if (!isDragging && !reducedMotion) {
        rotY += autoRotSpeed;
      }
      arcProgress = (arcProgress + 0.012) % 1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Outer atmosphere glow
      const atmoGrad = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.25);
      atmoGrad.addColorStop(0, "transparent");
      atmoGrad.addColorStop(0.85, accentColor + "18");
      atmoGrad.addColorStop(1, "transparent");
      ctx.fillStyle = atmoGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Outer Wireframe Sphere Horizon Ring
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Project 3D coordinate (phi, theta) to 2D
      const project = (lat: number, lon: number) => {
        // Spherical to 3D Cartesian
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        let x = radius * Math.sin(phi) * Math.cos(theta);
        let y = radius * Math.cos(phi);
        let z = radius * Math.sin(phi) * Math.sin(theta);

        // Rotate Y
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        // Rotate X
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        return {
          x: cx + x1,
          y: cy + y2,
          z: z2,
          visible: z2 > 0, // front hemisphere
        };
      };

      // Draw Longitude Lines (Meridians)
      for (let lon = 0; lon < 360; lon += 360 / lonCount) {
        ctx.beginPath();
        let first = true;
        let anyVisible = false;

        for (let lat = -90; lat <= 90; lat += 5) {
          const pt = project(lat, lon);
          if (pt.visible) {
            anyVisible = true;
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }

        if (anyVisible) {
          ctx.strokeStyle = signalColor;
          ctx.globalAlpha = 0.35;
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();
        }
      }

      // Draw Latitude Lines (Parallels)
      for (let latIndex = 1; latIndex < latCount; latIndex++) {
        const lat = -80 + (160 / latCount) * latIndex;
        ctx.beginPath();
        let first = true;
        let anyVisible = false;

        for (let lon = 0; lon <= 360; lon += 6) {
          const pt = project(lat, lon);
          if (pt.visible) {
            anyVisible = true;
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }

        if (anyVisible) {
          ctx.strokeStyle = signalColor;
          ctx.globalAlpha = 0.25;
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();
        }
      }

      // Draw coordinate nodes (hubs)
      const nodes = [
        { lat: 37.7749, lon: -122.4194, label: "SFO" }, // San Francisco
        { lat: 51.5074, lon: -0.1278, label: "LDN" },   // London
        { lat: 35.6762, lon: 139.6503, label: "TYO" },  // Tokyo
        { lat: 1.3521, lon: 103.8198, label: "SIN" },   // Singapore
        { lat: -33.8688, lon: 151.2093, label: "SYD" }, // Sydney
        { lat: 28.6139, lon: 77.209, label: "DEL" },    // New Delhi
      ];

      const projectedNodes = nodes.map((n) => ({
        ...n,
        pt: project(n.lat, n.lon),
      }));

      // Draw nodes
      projectedNodes.forEach((node) => {
        if (!node.pt.visible) return;
        const p = node.pt;

        // Glowing dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = signalColor;
        ctx.globalAlpha = 0.9;
        ctx.fill();

        // Outer pulse
        ctx.beginPath();
        ctx.arc(p.x, p.y, (7 + Math.sin(arcProgress * Math.PI * 4) * 3) * dpr, 0, Math.PI * 2);
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 1.2 * dpr;
        ctx.stroke();
      });

      // Draw animated high-speed telemetry arc between DEL & SFO
      const nodeA = projectedNodes[5]; // DEL
      const nodeB = projectedNodes[0]; // SFO

      if (nodeA.pt.visible || nodeB.pt.visible) {
        ctx.beginPath();
        const steps = 30;
        let arcFirst = true;
        for (let s = 0; s <= steps; s++) {
          const tVal = s / steps;
          const lat = nodeA.lat + (nodeB.lat - nodeA.lat) * tVal;
          const lon = nodeA.lon + (nodeB.lon - nodeA.lon) * tVal;
          const pt = project(lat, lon);
          if (pt.visible) {
            if (arcFirst) {
              ctx.moveTo(pt.x, pt.y);
              arcFirst = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        }
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = 0.75;
        ctx.lineWidth = 1.8 * dpr;
        ctx.stroke();

        // Traveling data photon pulse on arc
        const pulseT = arcProgress;
        const pLat = nodeA.lat + (nodeB.lat - nodeA.lat) * pulseT;
        const pLon = nodeA.lon + (nodeB.lon - nodeA.lon) * pulseT;
        const pulsePt = project(pLat, pLon);
        if (pulsePt.visible) {
          ctx.beginPath();
          ctx.arc(pulsePt.x, pulsePt.y, 5 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.globalAlpha = 1.0;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(pulsePt.x, pulsePt.y, 9 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = accentColor;
          ctx.globalAlpha = 0.5;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      if (!reducedMotion) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      if (container) {
        container.removeEventListener("mousedown", onMouseDown);
        container.removeEventListener("touchstart", onTouchStart);
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [accentColor, signalColor, size, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{ width: size, height: size }}
      title="Drag to rotate wireframe globe"
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="block"
      />
      {/* Subtle bottom radar label */}
      <div className="absolute bottom-2 flex items-center gap-2 px-2.5 py-1 rounded border border-signal/20 bg-void/80 backdrop-blur-sm pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
        <span className="font-mono text-[10px] tracking-widest text-signal/80 uppercase">
          TELEMETRY GRID // 3D WIREFRAME
        </span>
      </div>
    </div>
  );
}
