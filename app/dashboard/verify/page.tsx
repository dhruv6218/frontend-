"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const verificationTypes = [
  { 
    label: "All-in-One", 
    href: "/dashboard/verify/all-in-one", 
    icon: "mdi:vector-combine",
    description: "Verify multiple documents in one go",
    color: "from-orange-500 to-blue-600",
    featured: true
  },
  { 
    label: "GST", 
    href: "/dashboard/verify/gst", 
    icon: "mdi:receipt",
    description: "Verify GSTIN status and filings",
    color: "from-blue-500 to-blue-600"
  },
  { 
    label: "PAN", 
    href: "/dashboard/verify/pan", 
    icon: "mdi:id-card",
    description: "Verify PAN card details",
    color: "from-green-500 to-green-600"
  },
  { 
    label: "Aadhaar", 
    href: "/dashboard/verify/aadhaar", 
    icon: "mdi:card-account-details",
    description: "Verify Aadhaar via OTP",
    color: "from-purple-500 to-purple-600"
  },
  { 
    label: "Bank Account", 
    href: "/dashboard/verify/bank", 
    icon: "mdi:bank",
    description: "Verify bank account details",
    color: "from-indigo-500 to-indigo-600"
  },
  { 
    label: "MCA/CIN", 
    href: "/dashboard/verify/mca", 
    icon: "mdi:domain",
    description: "Verify company registration",
    color: "from-teal-500 to-teal-600"
  },
  { 
    label: "DIN", 
    href: "/dashboard/verify/din", 
    icon: "mdi:account-tie",
    description: "Verify Director Identification Number",
    color: "from-pink-500 to-pink-600"
  },
  { 
    label: "Passport", 
    href: "/dashboard/verify/passport", 
    icon: "mdi:passport",
    description: "Verify passport details",
    color: "from-amber-500 to-amber-600"
  },
];

export default function VerifyHub() {
  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="Verification Hub" subtitle="Choose a verification type to get started">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {verificationTypes.map((type, idx) => (
            <motion.div
              key={type.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                href={type.href}
                className={`block rounded-xl border border-neutral-200/70 bg-white p-6 hover:shadow-lg transition-all group ${
                  type.featured ? 'ring-2 ring-orange-500/20' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon icon={type.icon} width={24} className="text-white" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: 'var(--font-geist)' }}>
                    {type.label}
                  </h3>
                  {type.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-medium">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-600 mb-4">{type.description}</p>
                <div className="flex items-center gap-2 text-sm text-orange-600 font-medium group-hover:gap-3 transition-all">
                  <span>Start Verification</span>
                  <Icon icon="mdi:arrow-right" width={16} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/bulk-upload"
            className="rounded-xl border border-neutral-200/70 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Icon icon="mdi:upload" width={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: 'var(--font-geist)' }}>
                Bulk Upload
              </h3>
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              Upload a CSV file to verify multiple vendors at once
            </p>
            <span className="text-sm text-blue-600 font-medium">Learn more →</span>
          </Link>

          <Link
            href="/dashboard/reports"
            className="rounded-xl border border-neutral-200/70 bg-gradient-to-br from-purple-50 to-pink-50 p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                <Icon icon="mdi:file-chart" width={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: 'var(--font-geist)' }}>
                View Reports
              </h3>
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              Access all your verification reports and download PDFs
            </p>
            <span className="text-sm text-purple-600 font-medium">View reports →</span>
          </Link>
        </div>
      </PageShell>
    </Protected>
  );
}

