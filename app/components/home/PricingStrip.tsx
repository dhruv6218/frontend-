"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { PRICING } from "@/app/components/home/sampleData";
import { motion } from "framer-motion";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

export default function PricingStrip() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  return (
    <section id="pricing" aria-label="Flexible pricing" className="mx-auto max-w-7xl px-4 md:px-6 py-14">
      <p className="text-xs text-[#334155] mb-3" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>
        <span>Transparent plans that scale with your needs</span>
      </p>

      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs px-2 py-1 rounded-full border ${currency === 'INR' ? 'border-[#1E3A8A] text-[#1E3A8A]' : 'border-neutral-200 text-[#64748B]'}`}>INR</span>
        <button
          aria-label="Toggle currency"
          onClick={() => setCurrency((c) => (c === "INR" ? "USD" : "INR"))}
          className="h-6 w-12 rounded-full bg-neutral-200/60 relative"
        >
          <span className={`absolute top-0.5 ${currency === 'INR' ? 'left-0.5' : 'left-6'} h-5 w-5 rounded-full bg-white shadow transition-all`} />
        </button>
        <span className={`text-xs px-2 py-1 rounded-full border ${currency === 'USD' ? 'border-[#1E3A8A] text-[#1E3A8A]' : 'border-neutral-200 text-[#64748B]'}`}>USD</span>
      </div>

      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-4 min-w-max">
          {PRICING.map((p) => (
            <motion.article key={p.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-[280px] rounded-2xl border border-neutral-200/70 bg-white/80 backdrop-blur p-4 relative">
              {p.popular && (
                <span className="absolute -top-2 right-4 text-[10px] px-2 py-1 rounded-full text-white" style={{ background: ORANGE }}>
                  <span>Best value</span>
                </span>
              )}
              <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{p.name}</span></p>
              <p className="mt-2 text-2xl" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>
                <span>
                  {currency === "INR" ? `₹${p.priceINR}` : `$${p.priceUSD}`}<span className="text-xs text-[#64748B]">/{p.period}</span>
                </span>
              </p>
              <ul className="mt-3 space-y-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-[#0F172A]">
                    <Icon icon="heroicons:check-16-solid" width={14} color={ORANGE} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-4 w-full text-sm px-4 py-2 rounded-2xl text-white inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 transition shadow" style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }} aria-label={p.cta}>
                <Icon icon="mdi:rocket-launch" width={18} />
                <span>{p.cta}</span>
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
