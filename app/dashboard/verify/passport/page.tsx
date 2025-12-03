"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import DataTable from "@/app/components/ui/DataTable";
import ManualReviewDisclaimer from "@/app/components/ManualReviewDisclaimer";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { mockService } from "@/lib/mock/service";

interface Row { passport: string; name: string; status: string; risk: number; }

export default function VerifyPassport() {
  const router = useRouter();
  const [passport, setPassport] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ reportId: string; summary: any } | null>(null);

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
    setVerificationResult(null);
    try {
      await mockService.verifications.create("passport", { file_no: passport, dob });
      const reportId = `RPT-${Date.now()}`;
      const summary = {
        passport,
        name: name || "Passport Holder",
        status: "Valid",
        riskLevel: name && dob ? 12 : 25,
        keyFields: {
          dateOfBirth: dob || "Not provided",
          expiryDate: "2030-12-31",
          issueDate: "2020-01-15"
        }
      };
      setVerificationResult({ reportId, summary });
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
                  <p className="text-xs text-neutral-500 mb-1">Passport Number</p>
                  <p className="text-sm font-medium text-neutral-900">{verificationResult.summary.passport}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Name</p>
                  <p className="text-sm font-medium text-neutral-900">{verificationResult.summary.name}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Status</p>
                  <p className="text-sm font-medium text-neutral-900">{verificationResult.summary.status}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Date of Birth</p>
                  <p className="text-sm font-medium text-neutral-900">{verificationResult.summary.keyFields.dateOfBirth}</p>
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
                    setPassport("");
                    setName("");
                    setDob("");
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

        <p className="text-sm mb-2 mt-6" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Recent passport checks</p>
        <DataTable<Row> columns={columns as unknown as { key: keyof Row; header: string }[]} data={rows} />
      </PageShell>
    </Protected>
  );
}
