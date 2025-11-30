"use client";

import React, { useMemo } from "react";

interface GalaxyProps {
  mouseRepulsion?: boolean;
  mouseInteraction?: boolean;
  density?: number; // 0.5 - 2
  glowIntensity?: number; // 0 - 1
  saturation?: number; // 0 - 1
  hueShift?: number; // degrees
  className?: string;
  style?: React.CSSProperties;
}

export default function Galaxy({
  mouseRepulsion = true,
  mouseInteraction = true,
  density = 1,
  glowIntensity = 0.5,
  saturation = 0.8,
  hueShift = 240,
  className,
  style,
}: GalaxyProps) {
  const id = useMemo(() => Math.random().toString(36).slice(2), []);
  const starCount = Math.round(90 * Math.max(0.5, Math.min(2, density)));
  const stars = useMemo(() => Array.from({ length: starCount }).map(() => ({
    left: Math.random() * 120 - 10,
    top: Math.random() * 120 - 10,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 6,
  })), [starCount]);

  return (
    <div
      className={`galaxy-${id} ${className ?? ""}`}
      data-repulse={mouseRepulsion ? 1 : 0}
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: mouseInteraction ? "auto" : "none", ...style }}
      onMouseMove={(e) => {
        if (!mouseInteraction) return;
        const el = e.currentTarget as HTMLDivElement;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        el.style.setProperty("--mx", x.toString());
        el.style.setProperty("--my", y.toString());
      }}
    >
      <div className="field" />
      {stars.map((s, i) => (
        <span key={i} className="star" style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />
      ))}
      <style jsx>{`
        .galaxy-${id} {
          filter: hue-rotate(${hueShift}deg) saturate(${Math.max(0, Math.min(1, saturation))});
        }
        .galaxy-${id} .field {
          position: absolute;
          inset: -10%;
          background:
            radial-gradient(1200px 600px at calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.5) * 100%), rgba(255,255,255,${glowIntensity}), transparent 70%),
            radial-gradient(800px 400px at 20% 10%, rgba(255,255,255,0.12), transparent 60%),
            radial-gradient(900px 500px at 80% 30%, rgba(255,255,255,0.10), transparent 60%),
            #000;
          opacity: 0.9;
          mix-blend-mode: screen;
          animation: twinkle-${id} 10s ease-in-out infinite alternate;
        }
        @keyframes twinkle-${id} {
          from { filter: blur(0.8px) brightness(1); }
          to { filter: blur(1.2px) brightness(1.2); }
        }
        .galaxy-${id} .star {
          position: absolute;
          display: block;
          background: radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%);
          border-radius: 999px;
          animation: starfade-${id} 4s ease-in-out infinite alternate;
          mix-blend-mode: screen;
        }
        @keyframes starfade-${id} {
          from { opacity: .4; }
          to { opacity: .9; }
        }
      `}</style>
    </div>
  );
}
