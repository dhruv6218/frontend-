"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth/mock-client";
import React from "react";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

export type HeroData = {
  headline?: string;
  subheadline?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  footnote?: string;
  visual?: boolean;
};

export default function HeroSection({ data }: { data: HeroData }) {
  const { login } = useAuth();

  const onPrimary = (href: string) => {
    if (href === "/dashboard") {
      login("demo@example.com");
    }
  };

  return (
    <section id="hero" aria-label="Hero" className="relative w-full min-h-[92vh] flex items-center">
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-br from-orange-50 via-white to-blue-50" />
        <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
          <div className="absolute -top-10 -left-10 h-72 w-72 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(249,115,22,0.25) 0%, rgba(255,255,255,0) 60%)" }} />
          <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(30,58,138,0.25) 0%, rgba(255,255,255,0) 60%)" }} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-16">
        <div className="space-y-5">
          {data.headline && (
            <h1 className="text-4xl md:text-5xl leading-tight" style={{ fontFamily: "var(--font-geist)", fontWeight: 600 }}>
              <span>{data.headline}</span>
            </h1>
          )}
          {data.subheadline && (
            <p className="text-sm md:text-base text-[#475569] max-w-xl">
              <span>{data.subheadline}</span>
            </p>
          )}
          {(data.primaryCta || data.secondaryCta) && (
            <div className="flex flex-wrap items-center gap-3">
              {data.primaryCta && (
                <button
                  onClick={() => onPrimary(data.primaryCta!.href)}
                  className="text-sm px-4 py-2 rounded-full text-white"
                  style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}
                  aria-label={data.primaryCta.label}
                >
                  <span>{data.primaryCta.label}</span>
                </button>
              )}
              {data.secondaryCta && (
                <Link
                  href={data.secondaryCta.href}
                  className="text-sm px-4 py-2 rounded-full border border-neutral-300 hover:-translate-y-0.5 transition"
                  aria-label={data.secondaryCta.label}
                >
                  <span>{data.secondaryCta.label}</span>
                </Link>
              )}
            </div>
          )}
          {data.footnote && (
            <div className="flex items-center gap-4 pt-3">
              <div className="h-8 w-8 rounded-full bg-orange-100" />
              <p className="text-xs text-[#64748B]"><span>{data.footnote}</span></p>
            </div>
          )}
        </div>

        {data.visual && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl border border-neutral-200/80 bg-white/70 backdrop-blur p-3 shadow-[0_10px_40px_rgba(15,23,42,0.08)]" aria-label="Decorative visual">
              <div className="rounded-xl border border-neutral-200/70 bg-white overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200/60">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-40 w-full rounded-lg bg-gradient-to-br from-orange-100 via-white to-blue-100" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
