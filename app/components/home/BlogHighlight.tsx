"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";
import { BLOG } from "@/app/components/home/sampleData";

export default function BlogHighlight() {
  return (
    <section id="blog" aria-label="Insights from the Ravono blog" className="mx-auto max-w-7xl px-4 md:px-6 py-14">
      <p className="text-xs text-[#334155] mb-3" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>
        <span>Curated reads for compliance leaders</span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BLOG.map((p) => (
          <motion.article key={p.slug} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="rounded-2xl border border-neutral-200/70 bg-white/80 backdrop-blur p-4">
            <h3 className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{p.title}</span></h3>
            <p className="text-xs text-[#64748B] mt-1"><span>{p.excerpt}</span></p>
            <Link href={p.href} className="text-xs mt-3 inline-block text-[#1E3A8A] underline" aria-label={`Read insights: ${p.title}`}>
              <span>Read insights</span>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
