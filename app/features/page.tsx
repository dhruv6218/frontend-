"use client";

import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import MagicBento from "@/app/components/MagicBento";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

const FEATURES = [
  {
    icon: "mdi:shield-outline",
    title: "Multi-Type Vendor Verification",
    desc:
      "PAN, GST, Aadhaar, Passport, MCA/CIN/DIN, and Bank account checks with masking and validation.",
    href: "/app/verification-hub",
  },
  {
    icon: "mdi:playlist-check",
    title: "All-in-One Verification",
    desc:
      "Upload once, queue all checks, AI analysis, and consolidated PDF + dashboard delivery.",
    href: "/app/verification-hub",
  },
  {
    icon: "mdi:chart-donut",
    title: "AI-Powered Fraud Analysis",
    desc:
      "Perplexity-powered reasoning with a 0–100 fraud score and clear explanations.",
    href: "/features",
  },
  {
    icon: "mdi:file-document-outline",
    title: "Reports & Analytics",
    desc:
      "Investor-ready PDFs, secure share links, and white-label branding for eligible plans.",
    href: "/app/reports",
  },
  {
    icon: "mdi:upload",
    title: "Bulk Upload & Job Management",
    desc:
      "CSV/ZIP import, column mapping wizard, retries/backoff, and live progress monitoring.",
    href: "/app/bulk-upload",
  },
  {
    icon: "mdi:api",
    title: "API & Integrations",
    desc:
      "Programmatic verification, Google Drive export, webhooks, and email notifications.",
    href: "/app/integrations",
  },
  {
    icon: "mdi:briefcase-outline",
    title: "White-Label Reports & Branding",
    desc:
      "Replace Ravono branding with your logo and company details on plans ≥ ₹2999.",
    href: "/pricing",
  },
  {
    icon: "mdi:bell-outline",
    title: "Notifications & Alerts",
    desc:
      "In-app toasts, emails, SLA alerts, and activity feed to keep teams informed.",
    href: "/app/notifications",
  },
  {
    icon: "mdi:lock-check-outline",
    title: "Security & Compliance",
    desc:
      "RBAC, admin 2FA, encryption, audit logs, IP allowlisting, and GDPR/CCPA alignment.",
    href: "/legal/privacy",
  },
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      {/* Static hero card (no animated background) */}
      <div className="rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur p-5 mb-8 flex items-start gap-4">
        <img
          src="https://storage.googleapis.com/cosmic-project-image-assets/images/79aa3ba9-d63f-4809-917e-d4732ea12325/pic.jpg"
          alt="Ravono Phoenix logo"
          className="h-10 w-10 rounded-md object-contain"
        />
        <div>
          <h1 className="text-3xl font-medium">Comprehensive Vendor Verification & Compliance Platform</h1>
          <p className="text-base text-[#475569] mt-2">Streamline vendor onboarding, mitigate fraud, and ensure regulatory compliance with AI-powered insights and government-backed verifications.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/pricing" className="text-sm px-4 py-2 rounded-full text-white" style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}>
              <span>Try Free</span>
            </Link>
            <Link href="/app/verification-hub" className="text-sm px-4 py-2 rounded-full border border-neutral-200/70 hover:-translate-y-0.5 transition">
              <span>Start All-in-One Verification</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {FEATURES.map((c) => (
          <Link key={c.title} href={c.href} className="block">
            <MagicBento
              textAutoHide
              enableStars
              enableSpotlight
              enableBorderGlow
              enableTilt
              enableMagnetism
              clickEffect
              spotlightRadius={300}
              particleCount={12}
              glowColor="249, 115, 22"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-white border border-neutral-200/70">
                  <Icon icon={c.icon} width={20} />
                </div>
                <p className="text-sm font-medium">{c.title}</p>
              </div>
              <p className="text-base mt-2 text-[#475569]">{c.desc}</p>
              <span className="inline-block mt-3 text-xs text-[#1E3A8A]">Learn more →</span>
            </MagicBento>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur p-5 text-center">
        <h2 className="text-lg font-medium">Ready to Secure Your Vendor Network?</h2>
        <p className="text-base text-[#475569] mt-1">Start free or explore advanced enterprise features today.</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Link href="/pricing" className="text-sm px-4 py-2 rounded-full text-white" style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}>
            <span>Try Free</span>
          </Link>
          <Link href="/contact" className="text-sm px-4 py-2 rounded-full border border-neutral-200/70 hover:-translate-y-0.5 transition">
            <span>Schedule Demo</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
