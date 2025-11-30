"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import DataTable from "@/app/components/ui/DataTable";
import React, { useEffect, useState } from "react";

interface Row { masked: string; status: string; method: string; risk: number; }

import { mockService } from "@/lib/mock/service";

export default function VerifyAadhaar() {
  const [aadhaar, setAadhaar] = useState("");
  const [vid, setVid] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [reqId, setReqId] = useState("");

  const columns = [
    { key: "masked", header: "Aadhaar" },
    { key: "status", header: "Status" },
    { key: "method", header: "Method" },
    { key: "risk", header: "Risk" },
  ] as const;

  async function loadHistory() {
    const items = await mockService.verifications.list();
    const mapped: Row[] = items.filter((it: any) => it.type.startsWith('aadhaar')).map((it: any) => ({
      masked: it.payload?.aadhaar ? String(it.payload.aadhaar).replace(/\d(?=\d{4})/g, "*") : "—",
      status: it.status,
      method: "OTP",
      risk: 0,
    }));
    setRows(mapped);
  }

  useEffect(() => { void loadHistory(); }, []);

  const onSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res: any = await mockService.verifications.create("aadhaar_send_otp", { aadhaar: vid || aadhaar });
      const r = (res.result ?? {}) as Record<string, unknown>;
      const rid = String((r.ReqId as string) ?? (r.reqId as string) ?? "");
      if (rid) setReqId(rid);
      setMsg("OTP sent to Aadhaar-linked mobile. Enter OTP below to complete.");
      await loadHistory();
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await mockService.verifications.create("aadhaar_submit_otp", { aadhaar: vid || aadhaar, otp, reqId });
      setMsg("Aadhaar verified successfully.");
      setOtp("");
      setReqId("");
      await loadHistory();
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="Aadhaar Verification" subtitle="Use VID or Aadhaar; results are masked for privacy">
        <form onSubmit={onSendOtp} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
          <div className="md:col-span-2">
            <label className="text-xs text-neutral-600">Aadhaar (12 digits)</label>
            <input value={aadhaar} onChange={(e) => setAadhaar(e.target.value.replace(/[^0-9]/g, "").slice(0, 12))} inputMode="numeric" placeholder="123412341234" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-neutral-600">VID (Virtual ID, optional)</label>
            <input value={vid} onChange={(e) => setVid(e.target.value)} placeholder="XXXX-XXXX-XXXX-XXXX" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
          </div>
          <div className="flex items-end">
            <button disabled={loading} type="submit" className="w-full px-3 py-2 rounded-md text-white bg-orange-600 disabled:opacity-50">{loading ? "Sending…" : "Send OTP"}</button>
          </div>
        </form>

        <form onSubmit={onSubmitOtp} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
          <div className="md:col-span-2">
            <label className="text-xs text-neutral-600">ReqId</label>
            <input value={reqId} onChange={(e) => setReqId(e.target.value)} placeholder="Auto-filled after Send OTP" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-neutral-600">OTP</label>
            <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))} inputMode="numeric" placeholder="Enter 6-digit OTP" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
          </div>
          <div className="flex items-end">
            <button disabled={loading || !reqId || !otp} type="submit" className="w-full px-3 py-2 rounded-md text-white bg-orange-600 disabled:opacity-50">{loading ? "Verifying…" : "Submit OTP"}</button>
          </div>
        </form>

        {msg && <p className="text-xs mb-2">{msg}</p>}
        <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Recent Aadhaar checks</p>
        <DataTable<Row> columns={columns as unknown as { key: keyof Row; header: string }[]} data={rows} />
      </PageShell>
    </Protected>
  );
}
