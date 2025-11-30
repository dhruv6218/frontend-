"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth/mock-client";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

export default function CTASection() {
  const { login } = useAuth();
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-12">
      <div className="rounded-3xl p-6 md:p-10 border border-neutral-200/70 bg-white/60 backdrop-blur" style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
        <h3 className="text-xl" style={{ fontFamily: "var(--font-geist)", fontWeight: 600 }}>Start your journey. Work with perfection. Manual relief available.</h3>
        <p className="text-sm mt-1 text-[#475569]">Our service team supports every step.</p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <GradientAuthButton onClick={() => login("demo@example.com")} label="Get Started Free" />
          <OutlineButton href="/contact?type=sales" label="Talk to Sales" />
        </div>
      </div>
    </section>
  );
}

function GradientAuthButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="inline-block" aria-label={label}>
      <motion.span whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="px-4 py-2 rounded-full text-sm text-white" style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}>{label}</motion.span>
    </button>
  );
}

function OutlineButton({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-block">
      <motion.span whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="px-4 py-2 rounded-full text-sm border border-neutral-200/70">{label}</motion.span>
    </Link>
  );
}
