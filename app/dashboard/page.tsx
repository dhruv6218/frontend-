"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import DataTable from "@/app/components/ui/DataTable";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useI18n } from "@/app/components/i18n/LanguageProvider";

interface Row {
  date: string;
  vendor: string;
  check: string;
  status: string;
  risk: number;
  reason: string;
}

export default function DashboardOverview() {
  const { t } = useI18n();
  const columns = [
    { key: "date", header: "Date" },
    { key: "vendor", header: "Vendor" },
    { key: "check", header: "Check" },
    { key: "status", header: "Status" },
    { key: "risk", header: "Risk Score" },
    { key: "reason", header: "Reason" },
  ] as const;

  const data: Row[] = [
    { date: "2025-10-02 09:12", vendor: "Shree Logistics Pvt Ltd", check: "GST", status: "Verified", risk: 7, reason: "GSTIN active; filings on time" },
    { date: "2025-10-02 08:55", vendor: "Apex Supplies", check: "Bank", status: "Match", risk: 18, reason: "Account holder matches PAN" },
    { date: "2025-10-01 19:03", vendor: "Neo Components", check: "PAN", status: "Mismatch", risk: 74, reason: "PAN name mismatch vs invoice" },
    { date: "2025-10-01 15:40", vendor: "Kamal Traders", check: "Aadhaar", status: "Verified", risk: 12, reason: "VID verified via OTP" },
    { date: "2025-10-01 12:10", vendor: "Bright Textiles", check: "MCA", status: "Found", risk: 22, reason: "Active, no charges" },
  ];

  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="Dashboard" subtitle="Overview of your vendor verifications and risks">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Credits Remaining", value: "752", icon: "mdi:database-outline", color: "text-orange-600", bg: "bg-orange-50", trend: null, trendUp: null },
            { label: "Verifications This Month", value: "248", icon: "mdi:check-decagram", color: "text-blue-600", bg: "bg-blue-50", trend: "+12%", trendUp: true },
            { label: "Total Reports Generated", value: "156", icon: "mdi:file-chart", color: "text-green-600", bg: "bg-green-50", trend: "+8%", trendUp: true },
            { label: "Vendors with High Risk", value: "2", icon: "mdi:alert-circle", color: "text-red-600", bg: "bg-red-50", trend: null, trendUp: null },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center ${c.color}`}>
                  <Icon icon={c.icon} width={20} />
                </div>
                {c.trend && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${c.trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {c.trend}
                  </span>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900" style={{ fontFamily: 'var(--font-geist)' }}>{c.value}</p>
                <p className="text-xs text-neutral-500 font-medium mt-1">{c.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <Icon icon="mdi:lightning-bolt-outline" className="text-orange-500" />
              {t("dashboard.quick.title")}
            </h3>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard/verify/all-in-one" className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 bg-neutral-50 hover:bg-orange-50 hover:border-orange-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <Icon icon="mdi:plus" width={16} />
                  </div>
                  <span className="text-sm font-medium text-neutral-700 group-hover:text-orange-700">Verify Vendor</span>
                </div>
                <Icon icon="mdi:chevron-right" width={16} className="text-neutral-400 group-hover:text-orange-400" />
              </Link>
              <Link href="/dashboard/bulk-upload" className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 bg-neutral-50 hover:bg-blue-50 hover:border-blue-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    <Icon icon="mdi:cloud-upload-outline" width={16} />
                  </div>
                  <span className="text-sm font-medium text-neutral-700 group-hover:text-blue-700">Bulk Upload</span>
                </div>
                <Icon icon="mdi:chevron-right" width={16} className="text-neutral-400 group-hover:text-blue-400" />
              </Link>
              <Link href="/dashboard/reports" className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 bg-neutral-50 hover:bg-purple-50 hover:border-purple-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                    <Icon icon="mdi:file-document-outline" width={16} />
                  </div>
                  <span className="text-sm font-medium text-neutral-700 group-hover:text-purple-700">Open Reports</span>
                </div>
                <Icon icon="mdi:chevron-right" width={16} className="text-neutral-400 group-hover:text-purple-400" />
              </Link>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2 rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-900">Recent Activity</h3>
              <Link href="/dashboard/reports" className="text-xs text-orange-600 hover:text-orange-700 font-medium">View all</Link>
            </div>
            <div className="overflow-hidden rounded-lg border border-neutral-100">
              <DataTable<Row>
                columns={[
                  { key: "vendor", header: "Vendor" },
                  { key: "check", header: "Check" },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => (
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${row.status === 'Verified' || row.status === 'Match' || row.status === 'Found'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'Verified' || row.status === 'Match' || row.status === 'Found'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                          }`}></span>
                        {row.status}
                      </span>
                    )
                  },
                  { key: "risk", header: "Risk" },
                  { key: "date", header: "Time" },
                ]}
                data={data.map(d => ({ ...d, date: d.date.split(' ')[1] }))}
              />
            </div>
          </div>
        </div>
      </PageShell>
    </Protected>
  );
}
