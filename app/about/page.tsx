"use client";

import React from "react";
import Link from "next/link";
import ElectricBorder from "@/app/components/ElectricBorder";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      {/* Hero / Intro */}
      <div className="flex items-start gap-4">
        <img
          src="https://storage.googleapis.com/cosmic-project-image-assets/images/79aa3ba9-d63f-4809-917e-d4732ea12325/pic.jpg"
          alt="Ravono Phoenix logo"
          className="h-10 w-10 rounded-md object-contain"
        />
        <div>
          <h1 className="text-3xl font-medium">About Ravono Vendor Compliance</h1>
          <p className="text-base text-[#475569] mt-2">
            Empowering businesses to validate vendors, mitigate fraud, and ensure compliance with AI-driven insights and verified data.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ElectricBorder color={ORANGE} speed={1} chaos={0.5} thickness={2} style={{ borderRadius: 16 }}>
          <div className="p-5 rounded-2xl bg-white/60 backdrop-blur">
            <h2 className="text-lg font-medium">Our Journey Towards Trusted Vendor Verification</h2>
            <p className="text-base text-[#475569] mt-2">
              Ravono started in March 2025 with a vision to eliminate vendor fraud and simplify compliance for businesses of all sizes. Our founder, Dhruv, recognized the pain points in vendor verification while working on client projects and decided to build a platform that combines automation, AI, and government‑backed verification APIs. Since inception, we focus on enterprise‑grade tools that are easy to use, scalable, and reliable, giving businesses confidence to onboard vendors without risk.
            </p>
          </div>
        </ElectricBorder>
        {/* Mission */}
        <ElectricBorder color={ORANGE} speed={1} chaos={0.5} thickness={2} style={{ borderRadius: 16 }}>
          <div className="p-5 rounded-2xl bg-white/60 backdrop-blur">
            <h2 className="text-lg font-medium">Our Mission</h2>
            <p className="text-base text-[#475569] mt-2">
              To empower businesses globally with secure, accurate, and automated vendor verification, ensuring that every partnership is built on trust and compliance. We aim to reduce fraud, streamline onboarding, and make compliance effortless for our clients.
            </p>
          </div>
        </ElectricBorder>
        {/* Vision */}
        <ElectricBorder color={ORANGE} speed={1} chaos={0.5} thickness={2} style={{ borderRadius: 16 }}>
          <div className="p-5 rounded-2xl bg-white/60 backdrop-blur">
            <h2 className="text-lg font-medium">Our Vision</h2>
            <p className="text-base text-[#475569] mt-2">
              To become the world’s most trusted vendor compliance platform, setting industry standards for accuracy, security, and usability. We envision a future where businesses of all sizes can instantly verify vendors and make informed decisions with confidence.
            </p>
          </div>
        </ElectricBorder>
        {/* Values */}
        <ElectricBorder color={ORANGE} speed={1} chaos={0.5} thickness={2} style={{ borderRadius: 16 }}>
          <div className="p-5 rounded-2xl bg-white/60 backdrop-blur">
            <h2 className="text-lg font-medium">Core Values That Drive Us</h2>
            <ul className="mt-2 list-disc pl-5 text-base text-[#475569] space-y-1">
              <li>Trust &amp; Transparency – Every report is accurate, verifiable, and AI‑analyzed.</li>
              <li>Innovation – Continuous AI, API, and automation improvements simplify complex processes.</li>
              <li>Customer‑Centricity – We build features that directly address client pain points.</li>
              <li>Security &amp; Compliance – GDPR, CCPA, and Indian regulations inform our design.</li>
              <li>Scalability – Designed for freelancers, SMEs, and enterprises with multi‑tenant support.</li>
            </ul>
          </div>
        </ElectricBorder>
      </section>

      {/* Founder */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ElectricBorder color={ORANGE} speed={1} chaos={0.5} thickness={2} style={{ borderRadius: 16 }}>
          <div className="p-5 rounded-2xl bg-white/60 backdrop-blur">
            <h2 className="text-lg font-medium">Meet Our Founder</h2>
            <p className="text-base text-[#475569] mt-2">
              Dhruv, Founder &amp; CEO – the visionary behind Ravono, passionate about automation, AI, and secure SaaS solutions. Committed to building a platform that reduces fraud risk while providing a seamless experience globally.
            </p>
          </div>
        </ElectricBorder>
        {/* Flagship Service */}
        <ElectricBorder color={ORANGE} speed={1} chaos={0.5} thickness={2} style={{ borderRadius: 16 }}>
          <div className="p-5 rounded-2xl bg-white/60 backdrop-blur">
            <h2 className="text-lg font-medium">Our Flagship Service – Manual Vendor Verification</h2>
            <p className="text-base text-[#475569] mt-2">
              For clients needing 100% human‑verified reports, we offer ₹299 per verification covering PAN, GST, Aadhaar, Passport, MCA/CIN/DIN, and Bank verifications. SLA‑backed with progress tracking, AI‑assisted insights, and PDF delivery. Perfect for enterprises with high‑value vendor onboarding requirements.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link href="/contact" className="text-sm px-4 py-2 rounded-full text-white" style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}>
                Order Manual Verification
              </Link>
              <Link href="/pricing" className="text-sm px-4 py-2 rounded-full border border-neutral-200/70">
                View Plans
              </Link>
            </div>
          </div>
        </ElectricBorder>
      </section>

      {/* Why Choose */}
      <section className="mt-6">
        <ElectricBorder color={ORANGE} speed={1} chaos={0.5} thickness={2} style={{ borderRadius: 16 }}>
          <div className="p-5 rounded-2xl bg-white/60 backdrop-blur">
            <h2 className="text-lg font-medium">Why Choose Ravono?</h2>
            <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-base text-[#475569] list-disc pl-5">
              <li>AI‑powered insights + government API verifications</li>
              <li>Secure, encrypted storage and RBAC controls</li>
              <li>Enterprise‑grade reporting and white‑label options</li>
              <li>Bulk uploads and All‑in‑One verification workflows</li>
              <li>24/7 support via email and upcoming chatbot</li>
            </ul>
          </div>
        </ElectricBorder>
      </section>

      {/* CTA */}
      <section className="mt-8 text-center p-6 rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur">
        <h3 className="text-xl font-medium">Join Thousands of Businesses Using Ravono Vendor Compliance</h3>
        <p className="text-base text-[#475569] mt-1">
          Start free today or explore our enterprise features to streamline vendor onboarding and compliance.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Link href="/pricing" className="text-sm px-4 py-2 rounded-full text-white" style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}>
            Try Free
          </Link>
          <Link href="/contact" className="text-sm px-4 py-2 rounded-full border border-neutral-200/70">
            Schedule Demo
          </Link>
        </div>
      </section>
    </div>
  );
}
