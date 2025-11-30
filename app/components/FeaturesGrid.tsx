"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export type FeatureItem = { icon: string; title: string; description: string };

export default function FeaturesGrid({ items }: { items: FeatureItem[] }) {
  return (
    <section id="features" aria-label="Features" className="mx-auto max-w-7xl px-4 md:px-6 py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((f) => (
          <motion.article
            key={f.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-neutral-200/70 bg-white/70 backdrop-blur p-4"
          >
            <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #F97316, #1E3A8A)" }}>
              <Icon icon={f.icon} width={18} />
            </div>
            <h4 className="text-sm mt-3" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{f.title}</span></h4>
            <p className="text-xs text-[#64748B] mt-1"><span>{f.description}</span></p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
