'use client';

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import ManualReviewDisclaimer from "@/app/components/ManualReviewDisclaimer";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AllInOne() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ gstin: "", pan: "", aadhaar: "", bank: "", ifsc: "" });
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ reportId: string; summary: any } | null>(null);

  const next = () => setStep(s => Math.min(3, s + 1));
  const prev = () => setStep(s => Math.max(1, s - 1));

  const submit = async () => {
    setLoading(true);
    const res = await fetch('/api/verify/all-in-one', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setVerificationResult(data);
    setLoading(false);
  };

  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="All-in-One Verification" subtitle="Run GST, PAN, Aadhaar, MCA, and Bank in a single flow">
        <div className="mb-4 flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded ${step>=1? 'bg-orange-100 text-orange-700':'bg-neutral-100'}`}>1. Vendor IDs</span>
          <span>→</span>
          <span className={`px-2 py-1 rounded ${step>=2? 'bg-orange-100 text-orange-700':'bg-neutral-100'}`}>2. Company & Bank</span>
          <span>→</span>
          <span className={`px-2 py-1 rounded ${step>=3? 'bg-orange-100 text-orange-700':'bg-neutral-100'}`}>3. Confirm & Run</span>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-neutral-600">GSTIN</label>
              <input value={form.gstin} onChange={(e)=>setForm({...form, gstin: e.target.value})} placeholder="27AAECS1234F1Z5" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
            </div>
            <div>
              <label className="text-xs text-neutral-600">PAN</label>
              <input value={form.pan} onChange={(e)=>setForm({...form, pan: e.target.value})} placeholder="AAECS1234F" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
            </div>
            <div>
              <label className="text-xs text-neutral-600">Aadhaar (masked)</label>
              <input value={form.aadhaar} onChange={(e)=>setForm({...form, aadhaar: e.target.value})} placeholder="**** **** 1234" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="md:col-span-2">
              <label className="text-xs text-neutral-600">Bank Account (masked)</label>
              <input value={form.bank} onChange={(e)=>setForm({...form, bank: e.target.value})} placeholder="XXXXXX7890" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
            </div>
            <div>
              <label className="text-xs text-neutral-600">IFSC</label>
              <input value={form.ifsc} onChange={(e)=>setForm({...form, ifsc: e.target.value.toUpperCase()})} placeholder="HDFC0001234" className="w-full px-3 py-2 rounded-md border border-neutral-200/70 text-sm" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-sm text-neutral-700">
            <p>Review details and start checks. You will receive a consolidated risk report with reasoning for any flags.</p>
          </div>
        )}

        {!verificationResult && (
          <div className="mt-4 flex items-center gap-2">
            <button className="px-3 py-2 text-sm rounded-md border border-neutral-200/70" onClick={prev} disabled={step===1}>Back</button>
            {step < 3 ? (
              <button className="px-3 py-2 text-sm rounded-md text-white" style={{ background: 'linear-gradient(135deg,#F97316,#1E3A8A)' }} onClick={next}>Next</button>
            ) : (
              <button 
                className="px-3 py-2 text-sm rounded-md text-white disabled:opacity-50" 
                style={{ background: 'linear-gradient(135deg,#F97316,#1E3A8A)' }} 
                onClick={submit}
                disabled={loading}
              >
                {loading ? "Running Verification..." : "Run Verification"}
              </button>
            )}
          </div>
        )}

        {/* Verification Result Summary */}
        <AnimatePresence>
          {verificationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: 'var(--font-geist)' }}>
                  All-in-One Verification Complete
                </h3>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  verificationResult.summary.riskLevel < 30 ? 'bg-green-100 text-green-700' :
                  verificationResult.summary.riskLevel < 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  Risk: {verificationResult.summary.riskLevel}/100
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-neutral-600 mb-2">Checks Completed:</p>
                <div className="flex flex-wrap gap-2">
                  {verificationResult.summary.checksCompleted.map((check: string) => (
                    <span key={check} className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                      {check}
                    </span>
                  ))}
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
                    setStep(1);
                    setForm({ gstin: "", pan: "", aadhaar: "", bank: "", ifsc: "" });
                  }}
                  className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition"
                >
                  Verify Another Vendor
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ManualReviewDisclaimer />
      </PageShell>
    </Protected>
  );
}
