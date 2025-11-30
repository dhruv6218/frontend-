"use client";

import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useTheme } from "@/app/components/ThemeProvider";

const steps = [
  { icon: "material-symbols:upload", title: "Upload", desc: "Import CSV or files to start" },
  { icon: "material-symbols:analytics", title: "AI analysis", desc: "Fraud reasoning & checks" },
  { icon: "line-md:document", title: "PDF report", desc: "Shareable, branded output" },
];

export default function QuickTour() {
  const { theme } = useTheme();
  const fg = theme === "light" ? "#0F172A" : "#FFFFFF";
  const sub = theme === "light" ? "#475569" : "#CBD5E1";

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <h2 className="text-xl font-medium" style={{ color: fg }}>Quick tour</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {steps.map((s, idx) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.05 }} className="p-5 rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-white border border-neutral-200/70">
                <Icon icon={s.icon} width={20} />
              </div>
              <p className="text-sm font-medium" style={{ color: fg }}>{s.title}</p>
            </div>
            <p className="text-xs mt-2" style={{ color: sub }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
