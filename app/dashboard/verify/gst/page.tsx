"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import DataTable from "@/app/components/ui/DataTable";
import React, { useEffect, useState } from "react";

interface Row { gstin: string; business: string; status: string; filings: string; risk: number; }

import { mockService } from "@/lib/mock/service";

export default function VerifyGST() {
  const [gstin, setGstin] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const columns = [
    { key: "gstin", header: "GSTIN" },
    { key: "business", header: "Business Name" },
    { key: "status", header: "Status" },
    { key: "filings", header: "Filing Status" },
    { key: "risk", header: "Risk" },
  ] as const;

  async function loadHistory() {
    const items = await mockService.verifications.list();
    // Filter for GST type if needed, or just show all for demo
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped: Row[] = items.filter((it: any) => it.type === 'gst').map((it: any) => ({
      gstin: it.payload?.gstin || "—",
      business: it.result?.details?.legal_name || "—",
      status: it.status,
      filings: "Active", // Mock data
      risk: 0,
    }));
    setRows(mapped);
  }

  useEffect(() => { void loadHistory(); }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await mockService.verifications.create("gst", { gstin, stateCode });
      setMsg("GST verification completed.");
      await loadHistory();
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="GST Verification" subtitle="Validate GSTIN status, filings, and business details">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
          <div className="md:col-span-2">
            <label className="text-xs text-neutral-600">GSTIN</label>
            <input value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())} required minLength={15} maxLength={15} pattern="[A-Z0-9]{15}" placeholder="27AAECS1234F1Z5" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
          </div>
          <div>
            <label className="text-xs text-neutral-600">State Code (optional)</label>
            <input value={stateCode} onChange={(e) => setStateCode(e.target.value)} placeholder="27" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
          </div>
          <div className="flex items-end">
            <button disabled={loading} type="submit" className="w-full px-3 py-2 rounded-md text-white bg-orange-600 disabled:opacity-50">{loading ? "Checking…" : "Check"}</button>
          </div>
        </form>

        {msg && <p className="text-xs mb-2">{msg}</p>}
        <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Recent GST checks</p>
        <DataTable<Row> columns={columns as unknown as { key: keyof Row; header: string }[]} data={rows} />
      </PageShell>
    </Protected>
  );
}
