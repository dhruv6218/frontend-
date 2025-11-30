"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/app/components/ThemeProvider";
import Lightning from "@/app/components/Lightning";
import { useAuth } from "@/lib/auth/mock-client";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";
const TEXT = "#0F172A";

export default function Hero() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const fg = theme === "light" ? TEXT : "#FFFFFF";
  const sub = theme === "light" ? "#475569" : "#CBD5E1";

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6 pt-20 pb-10 md:pt-28 md:pb-12">
        {/* Hero content: Left copy, Right Phoenix logo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl leading-tight tracking-tight"
              style={{ color: fg, fontFamily: "var(--font-geist)", fontWeight: 600 }}
            >
              <span>Vendor Infrastructure for a Trustworthy Future</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-2xl md:text-[28px] max-w-2xl font-medium"
              style={{ color: sub }}
            >
              <span>Prevent fraud. Onboard vendors with confidence. Compliance, speed and trust—powered by AI.</span>
            </motion.p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button onClick={() => login("demo@example.com")} className="inline-block" aria-label="Start Free">
                <motion.span
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className={`px-5 py-3 rounded-[16px] text-sm md:text-base text-white shadow`}
                  style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}
                >
                  Start Free
                </motion.span>
              </button>
              <CTA href="/contact?type=sales" label="Contact Sales" />
            </div>
          </div>

          {/* Right: Phoenix logo area with subline */}
          <div className="justify-self-center md:justify-self-end">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 20px 50px rgba(249,115,22,0.25)" }}
              className="rounded-3xl border border-neutral-200/70 bg-[#0B0B0B] p-5 w-[320px] md:w-[360px] text-center"
              style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.2)" }}
            >
              <img
                src="https://storage.googleapis.com/cosmic-project-image-assets/images/8e59d1f8-6b5d-4575-9fe3-4956de864bf4/logo.jpg"
                alt="Phoenix logo"
                className="h-28 w-auto mx-auto object-contain"
              />
              <p className="mt-3 text-[22px] font-semibold tracking-[1.2px]" style={{ color: "#FFFFFF" }}>
                <span>Empowering the Future</span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Single Lightning accent (Home only) */}
      <div className="w-full h-[300px] md:h-[360px] relative">
        <Lightning hue={35} xOffset={0} speed={1} intensity={1} size={1} />
      </div>
    </section>
  );
}

function CTA({ href, label, primary }: { href: string; label: string; primary?: boolean }) {
  return (
    <Link href={href} className="inline-block">
      <motion.span
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={`px-5 py-3 rounded-[16px] text-sm md:text-base ${primary ? 'text-white' : 'border'}`}
        style={{
          background: primary ? `linear-gradient(135deg, ${ORANGE}, ${NAVY})` : undefined,
          borderColor: primary ? undefined : NAVY,
          color: primary ? "#fff" : NAVY,
        }}
      >
        {label}
      </motion.span>
    </Link>
  );
}
