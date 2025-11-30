"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/components/ThemeProvider";
import Link from "next/link";

const items = [
  {
    icon: "material-symbols:shield",
    title: "Fraud-Proof Vendor Onboarding",
    desc: "Instant KYC, GST, PAN, MCA, bank checks. AI-powered fraud detection and secure data masking. Get verified vendors in seconds—zero paperwork.",
    accent: "#F97316",
  },
  {
    icon: "mdi:file-csv",
    title: "Bulk & Automated Processing",
    desc: "Upload via CSV or connect API. Automated queues, retries, downloadable audit-proof reports. Scale with confidence.",
  },
  {
    icon: "material-symbols:lock",
    title: "Enterprise Security & Compliance",
    desc: "SAML SSO, SCIM provisioning, IP restrict, granular RBAC, session policies—GDPR/CCPA tools built-in. Audit logs for every touchpoint.",
  },
  {
    icon: "mdi:account-group",
    title: "Role-Based Team Collaboration",
    desc: "Invite managers, admins, service teams with activity tracking, approvals, live chat, and dashboards.",
  },
  {
    icon: "material-symbols:receipt",
    title: "Seamless Payments & Integration",
    desc: "Automated invoices, easy plan changes, token management—complete billing transparency.",
  },
];

export default function FeaturesSnapshot() {
  const { theme } = useTheme();
  const fg = theme === "light" ? "#0F172A" : "#FFFFFF";
  const sub = theme === "light" ? "#475569" : "#CBD5E1";

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <div className="mb-6">
        <h2 className="text-xl" style={{ color: fg, fontFamily: "var(--font-geist)", fontWeight: 600 }}>Powerful features</h2>
        <p className="text-sm mt-1" style={{ color: sub }}>Glassy cards with micro‑interactions and quick learn links.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((f) => (
          <motion.div key={f.title} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
            className="p-5 rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur"
            style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-white border border-neutral-200/70">
                <Icon icon={f.icon} width={20} color={f.accent} />
              </div>
              <p className="text-[18px]" style={{ color: fg, fontFamily: "var(--font-geist)", fontWeight: 600 }}>{f.title}</p>
            </div>
            <p className="text-xs mt-2" style={{ color: sub }}>{f.desc}</p>
            <Link href="/features" className="inline-flex items-center gap-1 text-xs mt-3 text-[#1E3A8A]">
              <span>Learn More</span>
              <Icon icon="mdi:arrow-right" width={14} />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
