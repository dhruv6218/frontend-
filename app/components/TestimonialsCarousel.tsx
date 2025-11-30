"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import React, { useState } from "react";

export type Testimonial = { name: string; role: string; rating: number; quote: string };

export default function TestimonialsCarousel({ items, title }: { items: Testimonial[]; title?: string }) {
  const safeItems = Array.isArray(items) ? items : [];
  const [i, setI] = useState(0);
  const hasItems = safeItems.length > 0;
  const next = () => hasItems && setI((p) => (p + 1) % safeItems.length);
  const prev = () => hasItems && setI((p) => (p - 1 + safeItems.length) % safeItems.length);

  return (
    <section id="testimonials" aria-label="Testimonials" className="mx-auto max-w-7xl px-4 md:px-6 py-14">
      {title && (
        <h3 className="text-xl mb-6" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{title}</span></h3>
      )}
      <div className="rounded-2xl border border-neutral-200/70 bg-white/70 backdrop-blur p-4">
        {!hasItems ? (
          <p className="text-sm text-[#64748B]"><span>No testimonials yet.</span></p>
        ) : (
          <div className="flex items-center justify-between">
            <button onClick={prev} aria-label="Previous" className="p-2 rounded-full border border-neutral-200/70"><Icon icon="mdi:chevron-left" width={18} /></button>
            <div className="w-full max-w-2xl px-4">
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{safeItems[i].name}</span></p>
                    <p className="text-xs text-[#64748B]"><span>{safeItems[i].role}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Icon key={idx} icon={idx < safeItems[i].rating ? 'mdi:star' : 'mdi:star-outline'} width={16} className={idx < safeItems[i].rating ? 'text-amber-400' : 'text-neutral-300'} />
                  ))}
                </div>
                <p className="text-sm mt-3 text-[#0F172A]"><span>{safeItems[i].quote}</span></p>
              </motion.div>
            </div>
            <button onClick={next} aria-label="Next" className="p-2 rounded-full border border-neutral-200/70"><Icon icon="mdi:chevron-right" width={18} /></button>
          </div>
        )}
      </div>
    </section>
  );
}
