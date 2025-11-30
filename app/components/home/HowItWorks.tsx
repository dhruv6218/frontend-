"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import React from "react";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-label="How Ravono works" className="mx-auto max-w-7xl px-4 md:px-6 py-14">
      <p className="text-xs text-[#334155] mb-3" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>
        <span>From document to decision in minutes</span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <Card icon="material-symbols:cloud-upload" title="Upload docs" description="Drag & drop or connect APIs to import vendor files." />
        <Card icon="mdi:sparkles" title="Instant AI verification & audit report" description="We validate GST/PAN/Aadhaar and surface risks." />
        <Card icon="material-symbols:download" title="Download/share branded PDF and onboard vendor" description="Share clean, branded reports and go live." />
      </div>
    </section>
  );
}

function Card({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <motion.article initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="rounded-2xl border border-neutral-200/70 bg-white/80 backdrop-blur p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${NAVY}, ${ORANGE})` }}>
          <Icon icon={icon} width={20} />
        </div>
        <div>
          <h3 className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{title}</span></h3>
          <p className="text-xs text-[#64748B] mt-1"><span>{description}</span></p>
        </div>
      </div>
    </motion.article>
  );
}
