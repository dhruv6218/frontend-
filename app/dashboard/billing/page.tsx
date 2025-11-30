"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import React, { useEffect, useState } from "react";

export default function Billing() {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [subs, setSubs] = useState<Array<Record<string, unknown>>>([]);
  const [history, setHistory] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    // Mock data
    setSubs([{ subscription_product_id: "Pro Plan", status: "active" }]);
    setHistory([
      { timestamp: new Date().toISOString(), price: 2900, currency: "INR", product_id: "Pro Plan" }
    ]);
  }, []);

  const openBillingPortal = () => {
    alert("Billing portal is mocked.");
  };

  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="Billing" subtitle="Manage your subscription, invoices, and payment methods">
        <div className="flex items-center gap-2 mb-3 text-sm">
          <span>Billing cycle:</span>
          <button onClick={() => setCycle("monthly")} className={`px-3 py-1 rounded-md border ${cycle === 'monthly' ? 'bg-orange-100 border-orange-200 text-orange-700' : 'border-neutral-200/70'}`}>Monthly</button>
          <button onClick={() => setCycle("yearly")} className={`px-3 py-1 rounded-md border ${cycle === 'yearly' ? 'bg-orange-100 border-orange-200 text-orange-700' : 'border-neutral-200/70'}`}>Yearly</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg border border-neutral-200/70 bg-white/80 p-4">
            <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Current Plan</p>
            <p className="text-xs text-neutral-600">{(subs[0]?.subscription_product_id as string) || '—'}</p>
            <div className="mt-2 flex gap-2">
              <a href="/pricing" className="px-3 py-2 text-sm rounded-md border border-neutral-200/70">Change Plan</a>
              <button onClick={openBillingPortal} className="px-3 py-2 text-sm rounded-md text-white" style={{ background: 'linear-gradient(135deg,#F97316,#1E3A8A)' }}>Manage Billing</button>
            </div>
          </div>
          <div className="rounded-lg border border-neutral-200/70 bg-white/80 p-4 md:col-span-2">
            <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Invoice History</p>
            <ul className="mt-2 text-sm space-y-1">
              {history.map((h, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{new Date(String(h.timestamp)).toLocaleDateString()}</span>
                  <span>{((Number(h.price) || 0) / 100).toLocaleString('en-IN', { style: 'currency', currency: String(h.currency || 'INR') })}</span>
                  <span>{String(h.product_id)}</span>
                </li>
              ))}
              {history.length === 0 && <li className="text-neutral-500">No invoices yet.</li>}
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-neutral-200/70 bg-white/80 p-4">
          <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Usage Analytics</p>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div className="rounded-md border border-neutral-200/70 p-3"><p className="text-xs text-neutral-600">Verifications (30d)</p><p className="text-lg" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>248</p></div>
            <div className="rounded-md border border-neutral-200/70 p-3"><p className="text-xs text-neutral-600">Credits used/team member</p><p className="text-lg" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>~150</p></div>
            <div className="rounded-md border border-neutral-200/70 p-3"><p className="text-xs text-neutral-600">Trend</p><p className="text-lg" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>+12%</p></div>
          </div>
        </div>
      </PageShell>
    </Protected>
  );
}
