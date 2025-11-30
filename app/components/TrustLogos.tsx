"use client";

import React from "react";
import { useTheme } from "@/app/components/ThemeProvider";

export default function TrustLogos() {
  const { theme } = useTheme();
  const sub = theme === "light" ? "#64748B" : "#A8B1C7";

  const stack = ["Google", "Perplexity", "Cosmic", "Govt APIs", "COMPDFKIT", "Brevo"];

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-6">
      <p className="text-center text-[18px] font-medium" style={{ color: sub }}>Built on world-class infrastructure</p>
      <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-6">
        {stack.map((b) => (
          <div key={b} className="h-12 rounded-xl border border-neutral-200/60 bg-white/60 backdrop-blur flex items-center justify-center text-xs text-[#0F172A]/60">
            <span>{b}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
