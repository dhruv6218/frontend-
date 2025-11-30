"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import React from "react";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

export default function CTABanner() {
  return (
    <section aria-label="Primary call to action" className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <div className="rounded-2xl border border-neutral-200/70 bg-white/80 backdrop-blur p-6 text-center shadow-[0_20px_60px_rgba(30,58,138,0.15)]">
        <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>
          <span>Ready to experience hassle-free vendor compliance?</span>
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-2 text-sm px-5 py-2 rounded-2xl text-white shadow hover:-translate-y-0.5 transition"
          style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}
          aria-label="Get Started Free"
        >
          <Icon icon="mdi:rocket-launch" width={18} />
          <span>Get Started Free</span>
        </Link>
      </div>
    </section>
  );
}
