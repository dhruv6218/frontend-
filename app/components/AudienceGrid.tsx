"use client";

import React from "react";
import { motion } from "framer-motion";

const items = [
  "Small Businesses",
  "Freelancers",
  "Mid-tier Companies",
  "Enterprises",
  "Vendor Networks",
  "Auditors",
  "Compliance Teams",
];

export default function AudienceGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <h3 className="text-xl" style={{ fontFamily: "var(--font-geist)", fontWeight: 600 }}>Who is Ravono for?</h3>
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((x) => (
          <motion.div
            key={x}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.18 }}
            className="h-24 rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur flex items-center justify-center text-xs"
          >
            <span>{x}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
