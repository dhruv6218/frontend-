"use client";

import React from "react";
import { motion } from "framer-motion";

const NAVY = "#1E3A8A";

export default function Stats() {
  const items = [
    { label: "4000+ verifications completed" },
    { label: "99.2% accuracy" },
    { label: "Trusted by 300+ businesses" },
  ];
  const customers = ["VendorNet", "MediSecure", "SMBPlus", "FreelancerHub"];

  return (
    <section className="w-full">
      <div className="py-6" style={{ background: NAVY }}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
            {items.map((it, i) => (
              <motion.p key={it.label} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.05 }} className="text-center md:text-left text-base md:text-lg font-medium">
                <span>{it.label}</span>
              </motion.p>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 justify-center md:justify-start">
            {customers.map((c) => (
              <span key={c} className="text-[11px] px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
