"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import DataTable from "@/app/components/ui/DataTable";
import React, { useEffect, useState } from "react";
import { mockService } from "@/lib/mock/service";

interface Row { cin: string; company: string; status: string; directors: number; risk: number; }

export default function VerifyMCA() {
  const [cin, setCin] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "cin", header: "CIN" },
    { key: "company", header: "Company" },
    { key: "status", header: "Status" },
    { key: "directors", header: "Directors" },
    { key: "risk", header: "Risk" },
  ] as const;

  async function loadHistory() {
    const items = await mockService.verifications.list();
    const mapped: Row[] = items.filter(it => it.type === 'mca_cin').map((it) => ({
      cin: String((((it as any).payload as Record<string, unknown>)?.cin) ?? ""),
      company: String(((it.result as Record<string, unknown>)?.companyName) ?? "—"),
      status: String(it.status ?? "—"),
      directors: Number(((it.result as Record<string, unknown>)?.DirectorsCount) ?? 0),
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
      await mockService.verifications.create("mca_cin", { cin });
      setMsg("MCA search completed.");
      await loadHistory();
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="MCA Verification" subtitle="Fetch CIN/DIN details, status, charges, and directors">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
          <div className="md:col-span-4">
            <label className="text-xs text-neutral-600">CIN / Company Name</label>
            <input value={cin} onChange={(e) => setCin(e.target.value)} placeholder="U74999MH2018PTC123456 or Company Name" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
          </div>
          <div className="flex items-end">
            <button disabled={loading} type="submit" className="w-full px-3 py-2 rounded-md text-white bg-orange-600 disabled:opacity-50">{loading ? "Searching…" : "Search"}</button>
          </div>
        </form>

        {msg && <p className="text-xs mb-2">{msg}</p>}
        <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Recent MCA checks</p>
        <DataTable<Row> columns={columns as unknown as { key: keyof Row; header: string }[]} data={rows} />
      </PageShell>
    </Protected>
  );
}
