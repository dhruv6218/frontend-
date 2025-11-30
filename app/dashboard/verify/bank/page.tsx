"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import DataTable from "@/app/components/ui/DataTable";
import React, { useEffect, useState } from "react";
import { mockService } from "@/lib/mock/service";

interface Row { account: string; holder: string; ifsc: string; status: string; risk: number; }

export default function VerifyBank() {
  const [account, setAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [holder, setHolder] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "account", header: "Account" },
    { key: "holder", header: "Holder" },
    { key: "ifsc", header: "IFSC" },
    { key: "status", header: "Status" },
    { key: "risk", header: "Risk" },
  ] as const;

  async function loadHistory() {
    const items = await mockService.verifications.list();
    const mapped: Row[] = items.filter(it => it.type === 'bank').map((it) => ({
      account: String(((it.payload as Record<string, unknown>)?.account) ?? ""),
      holder: String(((it.payload as Record<string, unknown>)?.name) ?? "—"),
      ifsc: String(((it.payload as Record<string, unknown>)?.ifsc) ?? "—"),
      status: String(it.status ?? "—"),
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
      await mockService.verifications.create("bank", { account, ifsc, name: holder });
      setMsg("Bank verification completed.");
      await loadHistory();
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="Bank Verification" subtitle="Validate account holder via penny drop and IFSC checks">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
          <div className="md:col-span-2">
            <label className="text-xs text-neutral-600">Account Number</label>
            <input value={account} onChange={(e) => setAccount(e.target.value)} placeholder="Enter bank account" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-neutral-600">IFSC</label>
            <input value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} placeholder="HDFC0001234" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
          </div>
          <div className="md:col-span-1">
            <label className="text-xs text-neutral-600">Holder Name</label>
            <input value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="As per bank" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
          </div>
          <div className="flex items-end">
            <button disabled={loading} type="submit" className="w-full px-3 py-2 rounded-md text-white bg-orange-600 disabled:opacity-50">{loading ? "Verifying…" : "Verify"}</button>
          </div>
        </form>

        {msg && <p className="text-xs mb-2">{msg}</p>}
        <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Recent bank checks</p>
        <DataTable<Row> columns={columns as unknown as { key: keyof Row; header: string }[]} data={rows} />
      </PageShell>
    </Protected>
  );
}
