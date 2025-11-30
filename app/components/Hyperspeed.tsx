"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { hyperspeedPresets } from "@/app/components/hyperspeed-presets";

// Minimal, lightweight accent that mimics moving lights using framer-motion only (no WebGL)
// Uses brand orange for right-lane sticks to stay on-brand and avoid heavy backgrounds.

const ORANGE = "#F97316";

export default function Hyperspeed({ preset = "five" }: { preset?: keyof typeof hyperspeedPresets }) {
  const conf = hyperspeedPresets[preset];
  const sticks = useMemo(() => Array.from({ length: conf.totalSideLightSticks }, (_, i) => i), [conf.totalSideLightSticks]);

  function widthFor(i: number): number {
    // Deterministic widths to avoid hydration mismatch
    const base = 60;
    const step = 18;
    return base + (i % 7) * step;
  }

  return (
    <div aria-hidden className="relative w-full h-[220px] overflow-hidden rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur">
      {/* Road */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#0b0b0b,#171717)" }} />
      {/* Center dashed line */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-px" style={{ background: "repeating-linear-gradient( to bottom, #2b2b2b 0 20px, transparent 20px 40px )" }} />

      {/* Moving light sticks (right lane, orange) */}
      {sticks.map((i) => (
        <motion.div
          key={`r-${i}`}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: ["100%", "-20%"], opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, delay: i * 0.06, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 h-1 rounded-full"
          style={{ width: widthFor(i), background: ORANGE }}
        />
      ))}
      {/* Moving light sticks (left lane, subtle) */}
      {sticks.map((i) => (
        <motion.div
          key={`l-${i}`}
          initial={{ x: "-20%", opacity: 0 }}
          animate={{ x: ["-20%", "100%"], opacity: [0, 0.8, 0] }}
          transition={{ duration: 2.6, delay: i * 0.05, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/3 h-1 rounded-full"
          style={{ width: widthFor(i), background: "#a3a3a3" }}
        />
      ))}

      {/* Soft vignette */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4))" }} />
    </div>
  );
}
