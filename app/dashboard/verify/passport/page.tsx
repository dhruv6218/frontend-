"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import DataTable from "@/app/components/ui/DataTable";
import React, { useEffect, useState } from "react";
import { mockService } from "@/lib/mock/service";

interface Row { passport: string; name: string; status: string; risk: number; }

export default function VerifyPassport() {
  const [passport, setPassport] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "passport", header: "Passport No." },
    { key: "name", header: "Name" },
    { key: "status", header: "Status" },
    { key: "risk", header: "Risk" },
  ] as const;

  async function loadHistory() {
    const items = await mockService.verifications.list();
    const mapped: Row[] = items.filter(it => it.type === 'passport').map((it) => ({
      passport: String(((it.payload as Record<string, unknown>)?.file_no) ?? ""),
      name: String(name || "—"),
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
      await mockService.verifications.create("passport", { file_no: passport, dob });
      setMsg("Passport verification completed.");
      await loadHistory();
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="Passport Verification" subtitle="Validate Indian passport number and status">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
          <div>
            <label className="text-xs text-neutral-600">Passport Number</label>
            <input value={passport} onChange={(e) => setPassport(e.target.value.toUpperCase())} required placeholder="Z1234567" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-neutral-600">Full Name (optional)</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="As per passport" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
          </div>
          <div>
            <label className="text-xs text-neutral-600">DOB (DD-MM-YYYY)</label>
            <input value={dob} onChange={(e) => setDob(e.target.value)} placeholder="01-12-2000" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
          </div>
          <div className="flex items-end">
            <button disabled={loading} type="submit" className="w-full px-3 py-2 rounded-md text-white bg-orange-600 disabled:opacity-50">{loading ? "Verifying…" : "Verify"}</button>
          </div>
        </form>

        {msg && <p className="text-xs mb-2">{msg}</p>}
        <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Recent passport checks</p>
        <DataTable<Row> columns={columns as unknown as { key: keyof Row; header: string }[]} data={rows} />
      </PageShell>
    </Protected>
  );
}
