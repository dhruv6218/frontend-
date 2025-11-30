"use client";

import React from "react";
import { motion } from "framer-motion";

interface ElectricBorderProps {
  children: React.ReactNode;
  color?: string;
  speed?: number; // 1 is default; higher is faster
  chaos?: number; // 0-1 influences hue shift amplitude
  thickness?: number; // border thickness in px
  style?: React.CSSProperties;
  className?: string;
}

// A lightweight animated gradient border wrapper.
// Inspired by @BalintFerenczy (CodePen), adapted for Next + Tailwind without global CSS edits.
export default function ElectricBorder({
  children,
  color = "#7df9ff",
  speed = 1,
  chaos = 0.5,
  thickness = 2,
  style,
  className,
}: ElectricBorderProps) {
  const duration = Math.max(2, 8 / Math.max(0.1, speed));
  const glow = `0 0 16px ${color}`;

  return (
    <motion.div
      initial={{ backgroundPosition: "0% 50%", filter: "hue-rotate(0deg)" }}
      animate={{
        backgroundPosition: ["0% 50%", "200% 50%", "0% 50%"],
        filter: [
          `hue-rotate(${chaos * 10}deg)`,
          `hue-rotate(${chaos * 60}deg)`,
          `hue-rotate(${chaos * 10}deg)`,
        ],
      }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      className={[
        "relative rounded-[16px]",
        className ?? "",
      ].join(" ")}
      style={{
        backgroundImage: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        backgroundSize: "200% 100%",
        padding: thickness,
        boxShadow: glow,
        ...style,
      }}
    >
      <div className="rounded-[14px] bg-white/60 backdrop-blur border border-neutral-200/70">
        {children}
      </div>
    </motion.div>
  );
}
