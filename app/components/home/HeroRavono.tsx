"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@iconify/react";
import React from "react";
import { TRUSTED_LOGOS } from "@/app/components/home/sampleData";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

export default function HeroRavono() {
  return (
    <section id="hero" aria-label="Ravono Vendor Compliance hero" className="relative overflow-hidden">
      {/* Animated gradient background and soft shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full" style={{
          background: `radial-gradient(1200px 600px at -10% -10%, rgba(249,115,22,0.15), transparent 60%),
                       radial-gradient(1000px 600px at 110% 110%, rgba(30,58,138,0.18), transparent 55%),
                       linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)`
        }} />
        <motion.div
          aria-hidden
          className="absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(30,58,138,0.25), transparent 60%)" }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Copy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs tracking-wide text-[#334155]" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>
            <span>AI-powered vendor verification</span>
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl leading-tight" style={{ fontFamily: "var(--font-geist)", fontWeight: 600 }}>
            <span>Supercharge Your Vendor Compliance. Fast. Simple. Reliable.</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-[#475569] max-w-xl">
            <span>AI-powered verification & reports – built for modern Indian businesses.</span>
          </p>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/auth/sign-up"
              className="text-sm px-4 py-2 rounded-2xl text-white shadow-[0_12px_40px_rgba(249,115,22,0.35)] hover:-translate-y-0.5 transition inline-flex items-center gap-2"
              aria-label="Start Free"
              style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}
            >
              <Icon icon="material-symbols:rocket-rounded" width={18} />
              <span>Start Free</span>
            </Link>
            <Link
              href="/auth/sign-in"
              className="text-sm px-4 py-2 rounded-2xl border border-neutral-200/80 bg-white hover:-translate-y-0.5 transition inline-flex items-center gap-2"
              aria-label="Sign In"
            >
              <Icon icon="mdi:login" width={18} />
              <span>Sign In</span>
            </Link>
            <Link
              href="/service"
              className="text-sm px-4 py-2 rounded-2xl bg-[#1E3A8A] text-white hover:-translate-y-0.5 transition inline-flex items-center gap-2 shadow-[0_10px_30px_rgba(30,58,138,0.35)]"
              aria-label="View Services"
            >
              <Icon icon="mdi:briefcase-outline" width={18} />
              <span>View Services</span>
            </Link>
          </div>

          {/* Trusted logos (text-rendered for performance and consistency) */}
          <div className="mt-8">
            <p className="text-xs text-[#64748B]"><span>Trusted by modern teams</span></p>
            <div className="mt-3 overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{ x: [0, -300, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              >
                {[...TRUSTED_LOGOS, ...TRUSTED_LOGOS].map((lg, i) => (
                  <div key={lg.name+"-"+i} className="px-3 py-2 rounded-xl bg-white border border-neutral-200/70 shadow-sm min-w-[140px] text-center">
                    <p className="text-[11px] tracking-wide text-[#0F172A]/80" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>
                      <span>{lg.name}</span>
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Visual: simple animated compliance workflow SVG */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative"
          aria-label="Compliance workflow visual"
        >
          <div className="rounded-2xl border border-neutral-200/80 bg-white/80 backdrop-blur p-4 shadow-[0_20px_60px_rgba(30,58,138,0.25)]">
            <div className="rounded-xl border border-neutral-200/70 p-6">
              <div className="grid grid-cols-3 gap-6 items-center">
                {/* Vendors */}
                <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-2 text-center">
                  <div className="h-12 w-12 mx-auto rounded-xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${NAVY}, ${ORANGE})` }}>
                    <Icon icon="ri:team-line" width={22} />
                  </div>
                  <p className="text-xs text-[#0F172A]" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>Vendors</span></p>
                </motion.div>

                {/* Shield */}
                <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-2 text-center">
                  <div className="h-12 w-12 mx-auto rounded-xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}>
                    <Icon icon="mdi:shield-check" width={22} />
                  </div>
                  <p className="text-xs text-[#0F172A]" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>Compliance</span></p>
                </motion.div>

                {/* Digital Docs */}
                <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-2 text-center">
                  <div className="h-12 w-12 mx-auto rounded-xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${NAVY}, ${ORANGE})` }}>
                    <Icon icon="solar:document-bold-duotone" width={22} />
                  </div>
                  <p className="text-xs text-[#0F172A]" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>Digital Docs</span></p>
                </motion.div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-xs text-[#64748B]"><span>AI verification and branded PDF reports</span></p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
