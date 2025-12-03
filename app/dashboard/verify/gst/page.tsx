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

interface Row { gstin: string; business: string; status: string; filings: string; risk: number; }

import { mockService } from "@/lib/mock/service";
import { isValidGSTIN } from "@/lib/utils/validation";

export default function VerifyGST() {
  const router = useRouter();
  const [gstin, setGstin] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{ reportId: string; summary: any } | null>(null);

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
    
    // Enhanced validation
    if (!isValidGSTIN(gstin)) {
      setMsg("Please enter a valid 15-character GSTIN");
      return;
    }
    
    setLoading(true);
    setMsg(null);
    setVerificationResult(null);
    try {
      const verif = await mockService.verifications.create("gst", { gstin, stateCode });
      // Simulate report creation
      const reportId = `RPT-${Date.now()}`;
      const summary = {
        gstin,
        businessName: "ACME Corp",
        status: "Active",
        riskLevel: 15,
        keyFields: {
          legalName: "ACME Corporation",
          registrationDate: "2020-01-15",
          filingStatus: "Up to date"
        }
      };
      setVerificationResult({ reportId, summary });
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

        {msg && <p className="text-xs mb-2 text-green-600">{msg}</p>}

        {/* Verification Result Summary */}
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
                  <p className="text-xs text-neutral-500 mb-1">GSTIN</p>
                  <p className="text-sm font-medium text-neutral-900">{verificationResult.summary.gstin}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Business Name</p>
                  <p className="text-sm font-medium text-neutral-900">{verificationResult.summary.businessName}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Status</p>
                  <p className="text-sm font-medium text-neutral-900">{verificationResult.summary.status}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Filing Status</p>
                  <p className="text-sm font-medium text-neutral-900">{verificationResult.summary.keyFields.filingStatus}</p>
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
                    setGstin("");
                    setStateCode("");
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

        <p className="text-sm mb-2 mt-6" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Recent GST checks</p>
        <DataTable<Row> columns={columns as unknown as { key: keyof Row; header: string }[]} data={rows} />
      </PageShell>
    </Protected>
  );
}
