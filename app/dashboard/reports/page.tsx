"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import DataTable from "@/app/components/ui/DataTable";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { mockService } from "@/lib/mock/service";
import { ToastContainer } from "@/app/components/ui/Toast";

interface Row { id: string; vendor: string; check: string; risk: number; status: string; date: string; expires_at?: string; days_remaining?: number; }

export default function Reports() {
  const [data, setData] = useState<Row[]>([]);
  const [driveConnected, setDriveConnected] = useState(false);
  const [dateFilter, setDateFilter] = useState("30");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: "success" | "error" | "info" | "warning" }>>([]);

  const addToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    loadReports();
    checkDriveStatus();
  }, []);

  async function loadReports() {
    const reports = await mockService.reports.list();
    const now = new Date();
    const mapped: Row[] = reports.map((r: any) => {
      const expiresAt = new Date(r.expires_at);
      const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const isExpired = daysRemaining < 0;
      return {
        id: r.id,
        vendor: r.vendor,
        check: r.type,
        risk: r.risk_level,
        status: isExpired ? "Expired" : "Active",
        date: new Date(r.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        expires_at: r.expires_at,
        days_remaining: daysRemaining
      };
    });
    setData(mapped);
  }

  async function checkDriveStatus() {
    const status = await mockService.integrations.getDriveStatus();
    setDriveConnected(status.connected);
  }

  const filteredData = data.filter(row => {
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    const daysAgo = parseInt(dateFilter);
    const rowDate = new Date(row.date);
    const filterDate = new Date();
    filterDate.setDate(filterDate.getDate() - daysAgo);
    const matchesDate = rowDate >= filterDate;
    return matchesStatus && matchesDate;
  });

  const handleSaveToDrive = async (reportId: string) => {
    try {
      await mockService.reports.saveToDrive(reportId);
      addToast("Report saved to Google Drive successfully!", "success");
    } catch (err) {
      addToast("Failed to save to Drive. Please ensure Drive is connected.", "error");
    }
  };

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

        {/* 7-Day Storage Banner */}
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
          <Icon icon="mdi:information-outline" width={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 mb-1">
              Reports are stored for 7 days in Ravono
            </p>
            <p className="text-xs text-blue-700">
              Please connect Google Drive to keep a permanent copy of your reports. Reports older than 7 days will be automatically deleted.
            </p>
            {!driveConnected && (
              <Link
                href="/dashboard/integrations"
                className="inline-flex items-center gap-2 mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Connect Google Drive →
              </Link>
            )}
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-neutral-200/70 shadow-sm">
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                <Icon icon="mdi:chevron-down" width={16} />
              </div>
            </div>
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="30">Last 30 Days</option>
                <option value="7">Last 7 Days</option>
                <option value="1">Today</option>
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' :
                    'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {row.status}
                  </span>
                )
              },
              { key: "date", header: "Date" },
              {
                key: "id",
                header: "Actions",
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/reports/${row.id}`} className="text-neutral-400 hover:text-orange-600 transition-colors" title="View Report">
                      <Icon icon="mdi:eye-outline" width={18} />
                    </Link>
                    {driveConnected && row.status === 'Active' && (
                      <button
                        onClick={() => handleSaveToDrive(row.id)}
                        className="text-neutral-400 hover:text-green-600 transition-colors"
                        title="Save to Google Drive"
                      >
                        <Icon icon="mdi:google-drive" width={18} />
                      </button>
                    )}
                  </div>
                )
              }
            ]}
            data={filteredData}
          />
        </div>

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </PageShell>
    </Protected>
  );
}
