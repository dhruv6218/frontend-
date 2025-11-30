"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import DataTable from "@/app/components/ui/DataTable";
import Link from "next/link";
import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface Row { id: string; vendor: string; check: string; risk: number; status: string; date: string; }

export default function Reports() {
  const columns = [
    { key: "id", header: "Report ID" },
    { key: "vendor", header: "Vendor" },
    { key: "check", header: "Check" },
    { key: "risk", header: "Risk" },
    { key: "status", header: "Status" },
    { key: "date", header: "Date" },
  ] as const;

  const [data] = useState<Row[]>([
    { id: "RPT-1023", vendor: "Shree Logistics Pvt Ltd", check: "All-in-One", risk: 18, status: "Clean", date: "2025-10-02 09:20" },
    { id: "RPT-1022", vendor: "Neo Components", check: "PAN", risk: 74, status: "Flagged", date: "2025-10-01 19:05" },
    { id: "RPT-1021", vendor: "Apex Supplies", check: "Bank", risk: 16, status: "Clean", date: "2025-10-01 15:50" },
  ]);

  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<"csv" | "pdf" | null>(null);

  async function exportAs(format: "csv" | "pdf") {
    setLoading(format); setMsg(null);
    try {
      // Mock export
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMsg(`${format.toUpperCase()} ready: #mock-url`);
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="Reports" subtitle="Browse and filter verification results">

        {/* Filters & Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-neutral-200/70 shadow-sm">
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                <option>All Statuses</option>
                <option>Clean</option>
                <option>Flagged</option>
                <option>Pending</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                <Icon icon="mdi:chevron-down" width={16} />
              </div>
            </div>
            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>Today</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                <Icon icon="mdi:chevron-down" width={16} />
              </div>
            </div>
            <div className="relative">
              <input
                placeholder="Search vendor..."
                className="pl-9 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-48"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <Icon icon="mdi:magnify" width={16} />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              disabled={loading === "csv"}
              onClick={() => void exportAs("csv")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <Icon icon="mdi:file-delimited-outline" width={18} className="text-green-600" />
              {loading === "csv" ? "Exporting..." : "CSV"}
            </button>
            <button
              disabled={loading === "pdf"}
              onClick={() => void exportAs("pdf")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <Icon icon="mdi:file-pdf-box" width={18} className="text-red-600" />
              {loading === "pdf" ? "Exporting..." : "PDF"}
            </button>
          </div>
        </div>

        {msg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
            <Icon icon="mdi:check-circle" width={16} />
            {msg}
          </div>
        )}

        <div className="bg-white rounded-xl border border-neutral-200/70 shadow-sm overflow-hidden">
          <DataTable<Row>
            columns={[
              { key: "id", header: "Report ID" },
              { key: "vendor", header: "Vendor Name" },
              { key: "check", header: "Check Type" },
              {
                key: "risk",
                header: "Risk Score",
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <div className={`w-16 h-2 rounded-full bg-neutral-100 overflow-hidden`}>
                      <div
                        className={`h-full rounded-full ${row.risk > 50 ? 'bg-red-500' : row.risk > 20 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${row.risk}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${row.risk > 50 ? 'text-red-600' : row.risk > 20 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {row.risk}/100
                    </span>
                  </div>
                )
              },
              {
                key: "status",
                header: "Status",
                render: (row) => (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'Clean' ? 'bg-green-50 text-green-700 border border-green-100' :
                    row.status === 'Flagged' ? 'bg-red-50 text-red-700 border border-red-100' :
                      'bg-yellow-50 text-yellow-700 border border-yellow-100'
                    }`}>
                    {row.status}
                  </span>
                )
              },
              { key: "date", header: "Date" },
              {
                key: "id",
                header: "Action",
                render: (row) => (
                  <Link href={`/dashboard/reports/${row.id}`} className="text-neutral-400 hover:text-orange-600 transition-colors">
                    <Icon icon="mdi:arrow-right-circle-outline" width={20} />
                  </Link>
                )
              }
            ]}
            data={data}
          />
        </div>
      </PageShell>
    </Protected>
  );
}
