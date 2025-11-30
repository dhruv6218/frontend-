"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import DataTable from "@/app/components/ui/DataTable";
import React, { useEffect, useState } from "react";
import { useI18n } from "@/app/components/i18n/LanguageProvider";
import { mockService } from "@/lib/mock/service";

interface Row { din: string; director: string; company: string; status: string; risk: number }

export default function VerifyDIN() {
  const { t } = useI18n();
  const [din, setDin] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "din", header: "DIN" },
    { key: "director", header: "Director" },
    { key: "company", header: "Company" },
    { key: "status", header: "Status" },
    { key: "risk", header: "Risk" },
  ] as const;

  async function loadHistory() {
    const items = await mockService.verifications.list();
    const mapped: Row[] = items.filter(it => it.type === 'din').map((it) => ({
      din: String((((it as any).payload as Record<string, unknown>)?.din) ?? ""),
      director: String(((it.result as Record<string, unknown>)?.director_name) ?? "—"),
      company: String(((it.result as Record<string, unknown>)?.company_name) ?? "—"),
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
      await mockService.verifications.create("din", { din });
      setMsg("DIN verification completed.");
      await loadHistory();
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title={t("verify.din.title")} subtitle={t("verify.din.subtitle")}>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
          <div>
            <label className="text-xs text-neutral-600">{t("verify.din.input")}</label>
            <input value={din} onChange={(e) => setDin(e.target.value.replace(/\D/g, "").slice(0, 8))} required minLength={8} maxLength={8} pattern="\\d{8}" placeholder="12345678" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
            <p className="text-[11px] text-neutral-500 mt-1">8 digits, numeric only</p>
          </div>
          <div className="flex items-end">
            <button disabled={loading} type="submit" className="w-full px-3 py-2 rounded-md text-white bg-orange-600 disabled:opacity-50">{loading ? "Checking" : t("verify.check")}</button>
          </div>
        </form>

        {msg && <p className="text-xs mb-2">{msg}</p>}
        <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Recent DIN checks</p>
        <DataTable<Row> columns={columns as unknown as { key: keyof Row; header: string }[]} data={rows} />
      </PageShell>
    </Protected>
  );
}
