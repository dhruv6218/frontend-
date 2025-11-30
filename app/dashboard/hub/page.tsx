"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import Link from "next/link";
import { Icon } from "@iconify/react";

const modules = [
  { label: "GST", href: "/dashboard/verify/gst", icon: "mdi:receipt" },
  { label: "PAN", href: "/dashboard/verify/pan", icon: "mdi:id-card" },
  { label: "Aadhaar", href: "/dashboard/verify/aadhaar", icon: "mdi:card-account-details" },
  { label: "Passport", href: "/dashboard/verify/passport", icon: "mdi:passport" },
  { label: "MCA", href: "/dashboard/verify/mca", icon: "mdi:domain" },
  { label: "Bank", href: "/dashboard/verify/bank", icon: "mdi:bank" },
  { label: "All-in-One", href: "/dashboard/verify/all-in-one", icon: "mdi:vector-combine" },
  { label: "Bulk Upload", href: "/dashboard/bulk-upload", icon: "mdi:upload" },
  { label: "Reports", href: "/dashboard/reports", icon: "mdi:file-chart" },
  { label: "Billing", href: "/dashboard/billing", icon: "mdi:credit-card-outline" },
  { label: "Integrations", href: "/dashboard/integrations", icon: "mdi:puzzle-outline" },
  { label: "Notifications", href: "/dashboard/notifications", icon: "mdi:bell-outline" },
  { label: "Settings", href: "/dashboard/settings", icon: "mdi:cog-outline" },
];

export default function Hub() {
  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="Hub" subtitle="All modules and shortcuts in one place">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {modules.map(m => (
            <Link key={m.href} href={m.href} className="rounded-lg border border-neutral-200/70 bg-white/80 p-4 hover:bg-neutral-50 transition">
              <div className="flex items-center gap-2">
                <Icon icon={m.icon} width={18} />
                <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>{m.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </PageShell>
    </Protected>
  );
}
