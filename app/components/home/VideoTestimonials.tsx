"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { TESTIMONIALS } from "@/app/components/home/sampleData";

const ORANGE = "#F97316";

export default function VideoTestimonials() {
  return (
    <section id="results-testimonials" aria-label="Customer results and testimonials" className="mx-auto max-w-7xl px-4 md:px-6 py-14">
      <p className="text-xs text-[#334155] mb-3" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>
        <span>Results you can see, trust you can measure</span>
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Professional banner replacing video placeholder */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-neutral-200/70 bg-white/80 backdrop-blur p-4 shadow-[0_16px_60px_rgba(15,23,42,0.08)]">
          <div className="relative overflow-hidden rounded-xl border border-neutral-200/70">
            <div className="p-6 bg-gradient-to-br from-orange-50 via-white to-blue-50">
              <p className="text-xs text-[#334155]" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>
                <span>Services</span>
              </p>
              <h3 className="mt-1 text-2xl" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>
                <span>Professional Manual Service — from ₹299</span>
              </h3>
              <p className="mt-2 text-sm text-[#475569] max-w-prose">
                <span>Accurate, audit-ready verification handled by experts. Get a branded PDF report and actionable results.</span>
              </p>
              <div className="mt-4">
                <a href="/service" className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full text-white" style={{ background: `linear-gradient(135deg,#F97316,#1E3A8A)` }}>
                  <Icon icon="mdi:briefcase-outline" width={18} />
                  <span>View Services</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonial carousel */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-neutral-200/70 bg-white/80 backdrop-blur p-4">
          <AutoCarousel />
        </motion.div>
      </div>
    </section>
  );
}

function AutoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    let x = 0;
    const step = () => {
      x -= 0.5; // speed
      if (trackRef.current) {
        // loop width approx
        trackRef.current.style.transform = `translateX(${x}px)`;
        const width = trackRef.current.scrollWidth / 2;
        if (Math.abs(x) > width) x = 0;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const items = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div>
      <p className="text-xs text-[#64748B] mb-2"><span>What customers say</span></p>
      <div className="overflow-hidden">
        <div ref={trackRef} className="flex gap-4 will-change-transform">
          {items.map((t, idx) => (
            <article key={t.name + "-" + idx} className="min-w-[240px] max-w-[260px] rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{t.name}</span></p>
                  <p className="text-[11px] text-[#64748B]"><span>{t.role}</span></p>
                </div>
                <div className="flex gap-0.5" aria-label={`Rating ${t.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} icon="mdi:star" width={14} color={i < t.rating ? ORANGE : "#E2E8F0"} />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-xs text-[#0F172A]"><span>“{t.quote}”</span></p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
