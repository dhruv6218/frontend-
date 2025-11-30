"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import React from "react";
import { VALUE_PROPS } from "@/app/components/home/sampleData";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

export default function WhyRavono() {
  return (
    <section id="why" aria-label="Why choose Ravono" className="mx-auto max-w-7xl px-4 md:px-6 py-14">
      <p className="text-xs text-[#334155] mb-3" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>
        <span>Choose certainty, not paperwork</span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {VALUE_PROPS.map((v) => (
          <motion.article key={v.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="rounded-2xl border border-neutral-200/70 bg-white/80 backdrop-blur p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}>
              <Icon icon={v.icon} width={18} />
            </div>
            <h3 className="mt-3 text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{v.title}</span></h3>
            <p className="mt-1 text-xs text-[#64748B]"><span>{v.description}</span></p>
          </motion.article>
        ))}
      </div>

      {/* Process flow */}
      <div className="mt-8 rounded-2xl border border-neutral-200/70 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Step icon="material-symbols:cloud-upload" title="Step 1" description="Upload docs" />
          <Arrow />
          <Step icon="mdi:sparkles" title="Step 2" description="Instant AI verification & audit report" />
          <Arrow className="hidden md:block" />
          <Step icon="material-symbols:download" title="Step 3" description="Download/share branded PDF and onboard vendor" />
        </div>
      </div>
    </section>
  );
}

function Step({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${NAVY}, ${ORANGE})` }}>
        <Icon icon={icon} width={20} />
      </div>
      <div>
        <p className="text-xs text-[#0F172A]" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{title}</span></p>
        <p className="text-xs text-[#64748B]"><span>{description}</span></p>
      </div>
    </div>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <div className={`hidden md:flex items-center justify-center ${className}`} aria-hidden>
      <Icon icon="material-symbols:arrow-forward" width={20} className="text-[#94A3B8]" />
    </div>
  );
}
