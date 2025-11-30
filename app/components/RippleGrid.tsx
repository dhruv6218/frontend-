"use client";

import React, { useMemo, useRef } from "react";

interface RippleGridProps {
  enableRainbow?: boolean;
  gridColor?: string;
  rippleIntensity?: number; // 0 - 1
  gridSize?: number; // px
  gridThickness?: number; // px
  mouseInteraction?: boolean;
  mouseInteractionRadius?: number; // 0 - 2
  opacity?: number; // 0 - 1
  className?: string;
  style?: React.CSSProperties;
}

export default function RippleGrid({
  enableRainbow = false,
  gridColor = "#ffffff",
  rippleIntensity = 0.05,
  gridSize = 10,
  gridThickness = 15,
  mouseInteraction = true,
  mouseInteractionRadius = 1.2,
  opacity = 0.8,
  className,
  style,
}: RippleGridProps) {
  const id = useMemo(() => Math.random().toString(36).slice(2), []);
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={ref}
      className={`ripple-${id} ${className ?? ""}`}
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: mouseInteraction ? "auto" : "none", ...style }}
      onMouseMove={(e) => {
        if (!mouseInteraction) return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        el.style.setProperty("--mx", x.toString());
        el.style.setProperty("--my", y.toString());
      }}
    >
      <div className="grid" />
      <div className="ripple" />
      <style jsx>{`
        .ripple-${id} {
          opacity: ${Math.max(0, Math.min(1, opacity))};
          mix-blend-mode: ${enableRainbow ? "screen" : "normal"};
        }
        .ripple-${id} .grid {
          position: absolute;
          inset: -10%;
          background-image:
            linear-gradient(90deg, ${gridColor} ${gridThickness}px, transparent ${gridThickness}px),
            linear-gradient(${gridColor} ${gridThickness}px, transparent ${gridThickness}px);
          background-size: ${gridSize}px ${gridSize}px;
          background-position: 0 0, 0 0;
          filter: opacity(0.35);
        }
        .ripple-${id} .ripple {
          position: absolute; inset: -10%;
          background: radial-gradient(
            circle at calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.5) * 100%),
            rgba(255,255,255, ${Math.max(0, Math.min(1, rippleIntensity))}),
            transparent ${Math.max(0.6, Math.min(2, mouseInteractionRadius)) * 40}%
          );
          animation: pulse-${id} 6s ease-in-out infinite;
        }
        @keyframes pulse-${id} {
          0%, 100% { transform: scale(1); opacity: .7; }
          50% { transform: scale(1.02); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
