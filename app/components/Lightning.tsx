"use client";

import React, { useMemo } from "react";

type LightningProps = {
  hue?: number; // 0-360, hue rotate in degrees
  xOffset?: number; // px offset of pattern
  speed?: number; // 0.5-2
  intensity?: number; // 0-2 brightness multiplier
  size?: number; // 0.5-2 scale
  className?: string;
  style?: React.CSSProperties;
};

export default function Lightning({
  hue = 35, // orange-ish by default
  xOffset = 0,
  speed = 1,
  intensity = 1,
  size = 1,
  className,
  style,
}: LightningProps) {
  const id = useMemo(() => Math.random().toString(36).slice(2), []);
  const scale = Math.max(0.5, Math.min(2, size));
  const animDuration = `${Math.max(6 / Math.max(0.25, speed), 2).toFixed(2)}s`;
  const brightness = Math.max(0.4, Math.min(2, intensity));

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        filter: `hue-rotate(${hue}deg) brightness(${brightness})`,
        transform: `translateX(${xOffset}px) scale(${scale})`,
        ...style,
      }}
    >
      <div className={`lightning-${id}`} />
      <style jsx>{`
        .lightning-${id} {
          position: absolute;
          inset: -20% -10%;
          background:
            radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.35), transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.25), transparent 60%),
            repeating-linear-gradient(90deg,
              rgba(255,255,255,0.06) 0px,
              rgba(255,255,255,0.06) 2px,
              transparent 2px,
              transparent 10px
            );
          mix-blend-mode: screen;
          animation: flash-${id} ${animDuration} linear infinite;
          filter: blur(1px) drop-shadow(0 0 12px rgba(255,255,255,0.25));
        }
        @keyframes flash-${id} {
          0% { opacity: .35; transform: translateY(-2%) }
          20% { opacity: .65; transform: translateY(-1%) }
          40% { opacity: .25; transform: translateY(0%) }
          60% { opacity: .55; transform: translateY(1%) }
          80% { opacity: .3; transform: translateY(2%) }
          100% { opacity: .35; transform: translateY(-2%) }
        }
      `}</style>
    </div>
  );
}
