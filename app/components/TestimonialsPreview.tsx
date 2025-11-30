"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/components/ThemeProvider";

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Founder, FinTech Solutions", quote: "Ravono transformed our onboarding—fast, reliable, audit‑ready." },
  { name: "Arjun Mehta", role: "Operations Head, RetailCo", quote: "Bulk uploads + automated reports made compliance effortless." },
  { name: "Sneha Kapoor", role: "CFO, TechWave Ltd.", quote: "Fraud score and reasoning give our enterprise teams confidence." },
];

export default function TestimonialsPreview() {
  const { theme } = useTheme();
  const fg = theme === "light" ? "#0F172A" : "#FFFFFF";
  const sub = theme === "light" ? "#475569" : "#CBD5E1";
  const [i, setI] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium" style={{ color: fg }}>What customers say</h2>
        <div className="flex gap-2">
          <button aria-label="Prev" className="h-8 w-8 rounded-full border border-neutral-200/70" onClick={() => setI((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}>‹</button>
          <button aria-label="Next" className="h-8 w-8 rounded-full border border-neutral-200/70" onClick={() => setI((p) => (p + 1) % TESTIMONIALS.length)}>›</button>
        </div>
      </div>
      <div className="relative h-36 mt-4">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="absolute inset-0 p-5 rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur flex items-center">
            <div>
              <p className="text-sm" style={{ color: fg }}>{TESTIMONIALS[i].quote}</p>
              <p className="text-xs mt-1" style={{ color: sub }}>{TESTIMONIALS[i].name} • {TESTIMONIALS[i].role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
