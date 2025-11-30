"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import React, { useState } from "react";

export default function AllInOne() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ gstin: "", pan: "", aadhaar: "", bank: "", ifsc: "" });

  const next = () => setStep(s => Math.min(3, s + 1));
  const prev = () => setStep(s => Math.max(1, s - 1));

  const submit = () => {
    alert("All-in-One verification started. You will find a consolidated report shortly.");
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

        <div className="mt-4 flex items-center gap-2">
          <button className="px-3 py-2 text-sm rounded-md border border-neutral-200/70" onClick={prev} disabled={step===1}>Back</button>
          {step < 3 ? (
            <button className="px-3 py-2 text-sm rounded-md text-white" style={{ background: 'linear-gradient(135deg,#F97316,#1E3A8A)' }} onClick={next}>Next</button>
          ) : (
            <button className="px-3 py-2 text-sm rounded-md text-white" style={{ background: 'linear-gradient(135deg,#F97316,#1E3A8A)' }} onClick={submit}>Run Verification</button>
          )}
        </div>
      </PageShell>
    </Protected>
  );
}
