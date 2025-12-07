'use client';

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import DataTable from "@/app/components/ui/DataTable";
import ManualReviewDisclaimer from "@/app/components/ManualReviewDisclaimer";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Row { masked: string; status: string; method: string; risk: number; }

export default function VerifyAadhaar() {
  const router = useRouter();
  const [aadhaar, setAadhaar] = useState("");
  const [vid, setVid] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [reqId, setReqId] = useState("");
  const [verificationResult, setVerificationResult] = useState<{ reportId: string; summary: any } | null>(null);

  const columns = [
    { key: "masked", header: "Aadhaar" },
    { key: "status", header: "Status" },
    { key: "method", header: "Method" },
    { key: "risk", header: "Risk" },
  ] as const;

  async function loadHistory() {
    const res = await fetch('/api/verifications/aadhaar');
    const items = await res.json();
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
      const res = await fetch('/api/verify/aadhaar/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aadhaar: vid || aadhaar }),
      });
      const data = await res.json();
      const rid = String((data.result as any)?.ReqId ?? (data.result as any)?.reqId ?? "");
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
    setVerificationResult(null);
    try {
      const res = await fetch('/api/verify/aadhaar/submit-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aadhaar: vid || aadhaar, otp, reqId }),
      });
      const data = await res.json();
      setVerificationResult(data);
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

        {msg && <p className="text-xs mb-2 text-green-600">{msg}</p>}

        <AnimatePresence>
          {verificationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: 'var(--font-geist)' }}>
                  Verification Result Summary
                </h3>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  verificationResult.summary.riskLevel < 30 ? 'bg-green-100 text-green-700' :
                  verificationResult.summary.riskLevel < 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  Risk: {verificationResult.summary.riskLevel}/100
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Aadhaar (Masked)</p>
                  <p className="text-sm font-medium text-neutral-900">{verificationResult.summary.aadhaar}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Status</p>
                  <p className="text-sm font-medium text-neutral-900">{verificationResult.summary.status}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Verification Method</p>
                  <p className="text-sm font-medium text-neutral-900">{verificationResult.summary.keyFields.verificationMethod}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-neutral-100">
                <Link
                  href={`/dashboard/reports/${verificationResult.reportId}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white text-sm font-medium hover:shadow-lg transition"
                >
                  <Icon icon="mdi:file-document-outline" width={18} />
                  View Full Report
                </Link>
                <button
                  onClick={() => {
                    setVerificationResult(null);
                    setAadhaar("");
                    setVid("");
                    setOtp("");
                    setReqId("");
                  }}
                  className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition"
                >
                  Verify Another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ManualReviewDisclaimer />

        <p className="text-sm mb-2 mt-6" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Recent Aadhaar checks</p>
        <DataTable<Row> columns={columns as unknown as { key: keyof Row; header: string }[]} data={rows} />
      </PageShell>
    </Protected>
  );
}
