'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MagicBentoProps {
  children?: React.ReactNode;
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string; // as "r, g, b" e.g., "249, 115, 22"
  className?: string;
}

export default function MagicBento(props: MagicBentoProps) {
  const {
    children,
    // props accepted for API compatibility
    textAutoHide = true,
    enableStars = true,
    enableSpotlight = true,
    enableBorderGlow = true,
    enableTilt = true,
    clickEffect = true,
    spotlightRadius = 240,
    particleCount = 10,
    glowColor = '249, 115, 22',
    className,
  } = props;
  const boxShadow = enableBorderGlow ? `0 0 30px rgba(${glowColor}, 0.35)` : undefined;

  const outerClass = [
    'relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur',
    textAutoHide ? 'group' : '',
    className ?? ''
  ].join(' ');

  return (
    <motion.div
      whileHover={enableTilt ? { y: -4, rotateX: 0.8, rotateY: -0.8 } : undefined}
      whileTap={clickEffect ? { scale: 0.98 } : undefined}
      className={outerClass}
      style={{ boxShadow }}
    >
      {/* Spotlight */}
      {enableSpotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-20 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `radial-gradient(${spotlightRadius}px circle at var(--mx,50%) var(--my,50%), rgba(${glowColor},0.25), transparent 60%)`,
          }}
        />
      )}

      {/* Decorative stars */}
      {enableStars && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {Array.from({ length: particleCount }).map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full"
              style={{
                top: `${(i * 97) % 100}%`,
                left: `${(i * 57) % 100}%`,
                background: `rgba(${glowColor}, 0.35)`,
                filter: 'blur(0.5px)'
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-[1] p-5 transition-opacity duration-200 ease-out">
        {children}
      </div>
    </motion.div>
  );
}
