"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type TItem = { name: string; title: string; company: string; rating: number; feedback: string };

const ITEMS: TItem[] = [
  { name: "Priya Sharma", title: "Founder", company: "FinTech Solutions", rating: 5, feedback: "Ravono transformed our vendor onboarding. Fast, reliable, audit‑ready." },
  { name: "Arjun Mehta", title: "Operations Head", company: "RetailCo", rating: 5, feedback: "Accuracy is unmatched. Bulk uploads and automated reports are effortless." },
  { name: "Sneha Kapoor", title: "CFO", company: "TechWave Ltd.", rating: 5, feedback: "All‑in‑One hub consolidates checks with a clear fraud score." },
  { name: "Rohit Verma", title: "CEO", company: "StartupHub", rating: 5, feedback: "Intuitive, professional, white‑label reports impress stakeholders." },
  { name: "Anjali Desai", title: "Compliance Officer", company: "HealthCare Inc.", rating: 4, feedback: "Robust platform; Drive integration took longer but smooth thereafter." },
  { name: "Vikram Singh", title: "Operations Manager", company: "LogisticsPro", rating: 4, feedback: "Detailed secure reports. Would love more industry templates." },
  { name: "Neha Joshi", title: "Procurement Head", company: "EduTech Co.", rating: 4, feedback: "Strong fraud detection. More inline help would be great." },
  // New lower-rated constructive feedback (Indian names)
  { name: "Ramesh Iyer", title: "Owner", company: "Local Traders", rating: 2, feedback: "Pricing feels steep for small batches. A lighter plan would help." },
  { name: "Pooja Nair", title: "Operations Head", company: "City Retail", rating: 2, feedback: "Some API checks failed initially; clearer retry tips would help." },
  { name: "Sanjay Patel", title: "Founder", company: "Startup Works", rating: 1, feedback: "First setup was confusing. A guided walkthrough would reduce learning curve." },
];

export default function TestimonialsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold">What Our Clients Say</h1>
        <p className="text-sm text-[#475569] mt-2">Real feedback from businesses using Ravono Vendor Compliance.</p>
      </header>

      {/* Slider preview */}
      <div className="mt-6 overflow-x-auto snap-x snap-mandatory flex gap-4 pb-2">
        {ITEMS.slice(0, 4).map((t) => (
          <motion.div key={t.name} whileHover={{ y: -4 }} className="min-w-[280px] max-w-[320px] snap-start p-5 rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur">
            <div>
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-xs text-[#64748B]">{t.title}, {t.company}</p>
            </div>
            <div className="mt-2 text-[#F59E0B] text-sm">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
            <p className="text-xs text-[#475569] mt-2">{t.feedback}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ITEMS.map((t) => (
          <div key={t.name} className="p-5 rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur">
            <div>
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-xs text-[#64748B]">{t.title}, {t.company}</p>
            </div>
            <div className="mt-2 text-[#F59E0B] text-sm">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
            <p className="text-xs text-[#475569] mt-2">{t.feedback}</p>
          </div>
        ))}
      </div>

      {/* Submit CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 rounded-2xl border border-neutral-200/70 bg-gradient-to-br from-orange-50 to-blue-50 p-10 text-center"
      >
        <h2 className="text-2xl font-bold text-neutral-900 mb-3">Share Your Experience</h2>
        <p className="text-neutral-700 mb-6 max-w-2xl mx-auto">
          Help others make informed decisions by sharing your experience with Ravono Vendor Compliance.
        </p>
        <Link
          href="/testimonials/submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-blue-900 text-white font-medium hover:shadow-lg transition"
        >
          <span>Submit Your Testimonial</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}
