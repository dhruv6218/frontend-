"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
import { STATS } from "@/app/components/home/sampleData";

function useCountUp(enabled: boolean, end: number, durationMs = 1500) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const start = performance.now();
    const step = (t: number) => {
      const elapsed = t - start;
      const p = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(end * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [enabled, end, durationMs]);
  return value;
}

function CountUp({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const animated = useCountUp(inView, value);
  const display = suffix === "/5" ? (Math.min(value, Math.round(animated * 10) / 10)).toFixed(1) : Math.floor(animated).toString();
  return (
    <span ref={ref}>
      {display}{suffix || ""}
    </span>
  );
}

export default function StatsBar() {
  return (
    <section aria-label="Key service statistics" className="py-12 bg-[#1E3A8A]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <p className="text-xs text-white/80 mb-4 font-medium tracking-wide">
          Proof that scales with you
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white/10 border border-white/10 p-5 text-white backdrop-blur-sm hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg">
                  {/* Using a simple circle or icon if needed, but the image shows a gradient circle */}
                </div>
                <p className="text-xs font-medium text-white/90">{s.label}</p>
              </div>
              <p className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-geist)' }}>
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
