"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import React from "react";
import { FEATURES } from "@/app/components/home/sampleData";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

export default function FeaturesSection() {
  return (
    <section id="features" aria-label="Product features" className="mx-auto max-w-7xl px-4 md:px-6 py-14">
      <p className="text-xs text-[#334155] mb-3" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>
        <span>Everything you need to verify with confidence</span>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f) => (
          <motion.article key={f.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="rounded-2xl border border-neutral-200/70 bg-white/80 backdrop-blur p-4 hover:shadow-[0_16px_50px_rgba(15,23,42,0.08)] transition-shadow">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}>
              <Icon icon={f.icon} width={18} />
            </div>
            <h3 className="mt-3 text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{f.title}</span></h3>
            <p className="mt-1 text-xs text-[#64748B]"><span>{f.description}</span></p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
