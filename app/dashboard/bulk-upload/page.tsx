"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import React, { useEffect, useRef, useState } from "react";
import { mockService } from "@/lib/mock/service";

interface Job { id: string; status: string; result_url?: string; createdAt?: unknown }

export default function BulkUpload() {
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  async function loadJobs() {
    const list = await mockService.bulkJobs.list();
    const mapped: Job[] = list.map((it) => ({ id: String(it.id), status: String(it.status), result_url: (it as any).result_url }));
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

      await mockService.bulkJobs.create(up.url);
      setMsg("Job started. Tracking progress…");
      await loadJobs();
      startPolling();
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const processingCount = jobs.filter(j => j.status !== "completed").length;

  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="Bulk Upload" subtitle="Upload CSV/Excel for mass vendor verification and track job status">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 rounded-lg border border-neutral-200/70 bg-white/80 p-4">
            <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Upload file</p>
            <p className="text-xs text-neutral-600 mb-2">CSV with columns: vendorName, gstin, pan, bankAccount, ifsc</p>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-200/70 cursor-pointer bg-white/90">
              <input type="file" className="hidden" onChange={(e) => { const f = Array.from(e.target.files ?? [])[0]; setFile(f ?? null); setFileName(f?.name || ""); }} />
              <span>Choose File</span>
            </label>
            {fileName && <p className="text-xs mt-2">Selected: {fileName}</p>}
            <div className="mt-3">
              <button disabled={loading} onClick={startJob} className="px-3 py-2 text-sm rounded-md text-white bg-orange-600 disabled:opacity-50">{loading ? "Starting…" : "Start Job"}</button>
            </div>
            {msg && <p className="text-xs mt-2">{msg}</p>}
          </div>
          <div className="rounded-lg border border-neutral-200/70 bg-white/80 p-4">
            <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Job status</p>
            {processingCount > 0 && (
              <div className="mt-2 w-full h-2 rounded bg-neutral-200 overflow-hidden" aria-label="Progress bar">
                <div className="h-2 bg-orange-500 animate-pulse" style={{ width: "66%" }} />
              </div>
            )}
            <ul className="mt-2 space-y-1 text-sm">
              {jobs.map(j => (
                <li key={j.id} className="flex items-center justify-between">
                  <span>Job {j.id.slice(0, 6)} • {j.status}</span>
                  {j.result_url && <a className="underline" href={j.result_url}>Download</a>}
                </li>
              ))}
              {jobs.length === 0 && <li className="text-neutral-500">No jobs yet.</li>}
            </ul>
          </div>
        </div>
      </PageShell>
    </Protected>
  );
}
