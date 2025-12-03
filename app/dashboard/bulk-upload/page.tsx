"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import DataTable from "@/app/components/ui/DataTable";
import React, { useEffect, useRef, useState } from "react";
import { mockService } from "@/lib/mock/service";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Job {
  id: string;
  name: string;
  status: string;
  created_at: string;
  total_rows: number;
  success_count: number;
  fail_count: number;
  result_url?: string;
  errors?: Array<{ row: number; vendor: string; error: string }>;
  report_ids?: string[];
}

export default function BulkUpload() {
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [jobName, setJobName] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  async function loadJobs() {
    const list = await mockService.bulkJobs.list();
    const mapped: Job[] = list.map((it: any) => ({
      id: String(it.id),
      name: String(it.name || `Job ${it.id.slice(0, 6)}`),
      status: String(it.status),
      created_at: String(it.created_at || new Date().toISOString()),
      total_rows: Number(it.total_rows || 0),
      success_count: Number(it.success_count || 0),
      fail_count: Number(it.fail_count || 0),
      result_url: it.result_url,
      errors: it.errors || [],
      report_ids: it.report_ids || []
    }));
    setJobs(mapped);
    return mapped;
  }

  function startPolling() {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(async () => {
      const list = await loadJobs();
      const hasProcessing = list.some(j => j.status !== "completed");
      if (!hasProcessing && pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }, 2000);
  }

  useEffect(() => { void loadJobs(); return () => { if (pollingRef.current) clearInterval(pollingRef.current); }; }, []);

  const startJob = async () => {
    if (!file) { setMsg("Please choose a file"); return; }
    setLoading(true); setMsg(null);
    try {
      const up = await mockService.files.upload(file);
      if (!up.success) throw new Error("Upload failed");

      await mockService.bulkJobs.create(up.url, jobName || undefined);
      setMsg("Job started. Tracking progress…");
      setFileName("");
      setFile(null);
      setJobName("");
      await loadJobs();
      startPolling();
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = "vendorName,gstin,pan,bankAccount,ifsc\nShree Logistics Pvt Ltd,27AABCU9603R1ZX,AAABCU9603R,HDFC0001234,1234567890\nApex Supplies,29ABCDE1234F1Z5,ABCDE1234F,SBIN0007654,9876543210";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_verification_sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const processingCount = jobs.filter(j => j.status !== "completed").length;

  const columns = [
    { key: "name", header: "Job Name" },
    { key: "created_at", header: "Created At" },
    { key: "status", header: "Status" },
    { key: "total_rows", header: "Total Rows" },
    { key: "success_count", header: "Success" },
    { key: "fail_count", header: "Failed" },
  ] as const;

  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="Bulk Upload" subtitle="Upload CSV/Excel for mass vendor verification and track job status">
        
        {/* CSV Format Explanation */}
        <div className="mb-6 rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2" style={{ fontFamily: 'var(--font-geist)' }}>
                CSV Format Requirements
              </h3>
              <p className="text-xs text-neutral-600 mb-3">
                Your CSV file must include the following columns: <code className="bg-neutral-100 px-1.5 py-0.5 rounded">vendorName</code>, <code className="bg-neutral-100 px-1.5 py-0.5 rounded">gstin</code>, <code className="bg-neutral-100 px-1.5 py-0.5 rounded">pan</code>, <code className="bg-neutral-100 px-1.5 py-0.5 rounded">bankAccount</code>, <code className="bg-neutral-100 px-1.5 py-0.5 rounded">ifsc</code>
              </p>
            </div>
            <button
              onClick={downloadSampleCSV}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
            >
              <Icon icon="mdi:download" width={18} />
              Download Sample CSV
            </button>
          </div>
          <div className="bg-neutral-50 rounded-lg p-3 font-mono text-xs overflow-x-auto">
            <pre>{`vendorName,gstin,pan,bankAccount,ifsc
Shree Logistics Pvt Ltd,27AABCU9603R1ZX,AAABCU9603R,1234567890,HDFC0001234
Apex Supplies,29ABCDE1234F1Z5,ABCDE1234F,9876543210,SBIN0007654`}</pre>
          </div>
        </div>

        {/* Upload Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="md:col-span-2 rounded-lg border border-neutral-200/70 bg-white/80 p-4">
            <p className="text-sm mb-4" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Upload file</p>
            
            <div className="mb-3">
              <label className="block text-xs text-neutral-600 mb-1">Job Name (optional)</label>
              <input
                type="text"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                placeholder="e.g., Q3 Vendor Verification"
                className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm"
              />
            </div>

            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-200/70 cursor-pointer bg-white/90 hover:bg-neutral-50 transition">
              <Icon icon="mdi:file-upload-outline" width={18} />
              <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => { const f = Array.from(e.target.files ?? [])[0]; setFile(f ?? null); setFileName(f?.name || ""); }} />
              <span>Choose File</span>
            </label>
            {fileName && <p className="text-xs mt-2 text-green-600">Selected: {fileName}</p>}
            <div className="mt-3">
              <button disabled={loading || !file} onClick={startJob} className="px-4 py-2 text-sm rounded-md text-white bg-orange-600 disabled:opacity-50 hover:shadow-lg transition">
                {loading ? "Starting…" : "Start Job"}
              </button>
            </div>
            {msg && <p className={`text-xs mt-2 ${msg.includes("started") ? "text-green-600" : "text-red-600"}`}>{msg}</p>}
          </div>
          <div className="rounded-lg border border-neutral-200/70 bg-white/80 p-4">
            <p className="text-sm mb-3" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Active Jobs</p>
            {processingCount > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
                  <span>Processing...</span>
                  <span>{processingCount} active</span>
                </div>
                <div className="w-full h-2 rounded bg-neutral-200 overflow-hidden">
                  <div className="h-2 bg-orange-500 animate-pulse" style={{ width: "66%" }} />
                </div>
              </div>
            )}
            <p className="text-xs text-neutral-500">Total jobs: {jobs.length}</p>
          </div>
        </div>

        {/* Jobs Table */}
        {jobs.length > 0 && (
          <div className="rounded-xl border border-neutral-200/70 bg-white shadow-sm overflow-hidden">
            <DataTable<Job>
              columns={[
                { key: "name", header: "Job Name" },
                {
                  key: "created_at",
                  header: "Created At",
                  render: (row) => new Date(row.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === 'completed' ? 'bg-green-100 text-green-700' :
                      row.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      row.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {row.status}
                    </span>
                  )
                },
                { key: "total_rows", header: "Total Rows" },
                { key: "success_count", header: "Success" },
                { key: "fail_count", header: "Failed" },
                {
                  key: "id",
                  header: "Action",
                  render: (row) => (
                    <button
                      onClick={() => setSelectedJob(row)}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      View Details
                    </button>
                  )
                }
              ]}
              data={jobs}
            />
          </div>
        )}

        {/* Job Detail Modal */}
        <AnimatePresence>
          {selectedJob && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedJob(null)}
                className="fixed inset-0 bg-black/30 z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: 'var(--font-geist)' }}>
                      Job Details: {selectedJob.name}
                    </h3>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition"
                    >
                      <Icon icon="mdi:close" width={20} />
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Status</p>
                        <p className="text-sm font-medium text-neutral-900">{selectedJob.status}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Created At</p>
                        <p className="text-sm font-medium text-neutral-900">
                          {new Date(selectedJob.created_at).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Total Rows</p>
                        <p className="text-sm font-medium text-neutral-900">{selectedJob.total_rows}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Success / Failed</p>
                        <p className="text-sm font-medium text-neutral-900">
                          <span className="text-green-600">{selectedJob.success_count}</span> / <span className="text-red-600">{selectedJob.fail_count}</span>
                        </p>
                      </div>
                    </div>

                    {selectedJob.errors && selectedJob.errors.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-neutral-900 mb-2">Errors</p>
                        <div className="space-y-2">
                          {selectedJob.errors.map((error, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-red-50 border border-red-100">
                              <p className="text-xs font-medium text-red-900">Row {error.row}: {error.vendor}</p>
                              <p className="text-xs text-red-700 mt-1">{error.error}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedJob.report_ids && selectedJob.report_ids.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-neutral-900 mb-2">Generated Reports ({selectedJob.report_ids.length})</p>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedJob.report_ids.slice(0, 6).map((reportId) => (
                            <Link
                              key={reportId}
                              href={`/dashboard/reports/${reportId}`}
                              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs text-neutral-700 hover:text-orange-600 transition"
                            >
                              {reportId}
                            </Link>
                          ))}
                          {selectedJob.report_ids.length > 6 && (
                            <p className="p-2 text-xs text-neutral-500">
                              +{selectedJob.report_ids.length - 6} more reports
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedJob.result_url && (
                      <div className="pt-4 border-t border-neutral-100">
                        <a
                          href={selectedJob.result_url}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white text-sm font-medium hover:shadow-lg transition"
                        >
                          <Icon icon="mdi:download" width={18} />
                          Download Results CSV
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </PageShell>
    </Protected>
  );
}
