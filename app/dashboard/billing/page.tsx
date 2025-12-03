"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth/mock-client";
import { ToastContainer } from "@/app/components/ui/Toast";

const PLANS = [
  { code: "FREE", name: "Free", price: 0, credits: 3, features: ["Basic verifications", "Watermarked reports"] },
  { code: "STARTER", name: "Starter", price: 499, credits: 20, features: ["All verifications", "Basic dashboard"], recommended: false },
  { code: "PRO", name: "Professional", price: 1499, credits: 50, features: ["Clean reports", "AI summaries", "Bulk upload", "Drive integration"], recommended: true },
  { code: "BUSINESS", name: "Business", price: 2999, credits: 100, features: ["White-label", "API access", "Team access"], recommended: false },
];

export default function Billing() {
  const { user } = useAuth();
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [subs, setSubs] = useState<Array<Record<string, unknown>>>([]);
  const [history, setHistory] = useState<Array<Record<string, unknown>>>([]);
  const [renewalDate, setRenewalDate] = useState<string>("");
  const [creditsUsed, setCreditsUsed] = useState(248);
  const [creditsLimit, setCreditsLimit] = useState(50);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: "success" | "error" | "info" | "warning" }>>([]);

  const addToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    // Mock data
    const currentPlan = user?.plan_id === "plan_pro" ? "PRO" : user?.plan_id === "plan_basic" ? "STARTER" : "FREE";
    setSubs([{ subscription_product_id: PLANS.find(p => p.code === currentPlan)?.name || "Professional", status: "active", plan_code: currentPlan }]);
    setHistory([
      { timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), price: 149900, currency: "INR", product_id: "Professional Plan" },
      { timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), price: 149900, currency: "INR", product_id: "Professional Plan" }
    ]);
    // Set renewal date (30 days from now)
    const renewal = new Date();
    renewal.setDate(renewal.getDate() + 30);
    setRenewalDate(renewal.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }));
    setCreditsLimit(PLANS.find(p => p.code === currentPlan)?.credits || 50);
  }, [user]);

  const openBillingPortal = () => {
    addToast("Billing portal is mocked. This feature will be available in production.", "info");
  };

  const currentPlanCode = (subs[0] as any)?.plan_code || "PRO";
  const currentPlan = PLANS.find(p => p.code === currentPlanCode) || PLANS[2];
  const creditsPercentage = (creditsUsed / creditsLimit) * 100;

  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="Billing" subtitle="Manage your subscription, invoices, and payment methods">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <span>Billing cycle:</span>
          <button onClick={() => setCycle("monthly")} className={`px-3 py-1 rounded-md border ${cycle === 'monthly' ? 'bg-orange-100 border-orange-200 text-orange-700' : 'border-neutral-200/70'}`}>Monthly</button>
          <button onClick={() => setCycle("yearly")} className={`px-3 py-1 rounded-md border ${cycle === 'yearly' ? 'bg-orange-100 border-orange-200 text-orange-700' : 'border-neutral-200/70'}`}>Yearly</button>
        </div>

        {/* Current Plan & Renewal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-neutral-900 mb-1" style={{ fontFamily: 'var(--font-geist)' }}>Current Plan</p>
            <p className="text-2xl font-bold text-neutral-900 mb-1">{currentPlan.name}</p>
            <p className="text-xs text-neutral-600 mb-4">
              ₹{currentPlan.price.toLocaleString('en-IN')}/{cycle === 'monthly' ? 'month' : 'year'}
            </p>
            {renewalDate && (
              <div className="mb-4">
                <p className="text-xs text-neutral-500 mb-1">Renewal Date</p>
                <p className="text-sm font-medium text-neutral-900">{renewalDate}</p>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Link href="/pricing" className="px-3 py-2 text-sm rounded-md border border-neutral-200/70 text-center hover:bg-neutral-50 transition">
                Change Plan
              </Link>
              <button onClick={openBillingPortal} className="px-3 py-2 text-sm rounded-md text-white hover:shadow-lg transition" style={{ background: 'linear-gradient(135deg,#F97316,#1E3A8A)' }}>
                Manage Billing
              </button>
            </div>
          </div>

          {/* Credits Usage */}
          <div className="rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-neutral-900" style={{ fontFamily: 'var(--font-geist)' }}>Credits Usage</p>
              <span className="text-xs text-neutral-500">{creditsUsed} / {creditsLimit}</span>
            </div>
            <div className="mb-4">
              <div className="w-full h-3 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    creditsPercentage > 80 ? 'bg-red-500' :
                    creditsPercentage > 50 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(creditsPercentage, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-neutral-600">
                <span>Credits per month: {creditsLimit}</span>
                <span>Used: {creditsUsed}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50">
                <p className="text-xs text-neutral-600">Remaining</p>
                <p className="text-lg font-bold text-neutral-900">{Math.max(0, creditsLimit - creditsUsed)}</p>
              </div>
              <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50">
                <p className="text-xs text-neutral-600">Usage %</p>
                <p className="text-lg font-bold text-neutral-900">{Math.round(creditsPercentage)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4" style={{ fontFamily: 'var(--font-geist)' }}>
            Available Plans
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((plan) => {
              const isCurrent = plan.code === currentPlanCode;
              const isRecommended = plan.recommended;
              return (
                <motion.div
                  key={plan.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative rounded-xl border p-4 ${
                    isCurrent ? 'border-orange-500 bg-orange-50' :
                    isRecommended ? 'border-blue-200 bg-blue-50' :
                    'border-neutral-200/70 bg-white'
                  }`}
                >
                  {isRecommended && !isCurrent && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-medium">
                      Recommended
                    </span>
                  )}
                  {isCurrent && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-medium">
                      Current
                    </span>
                  )}
                  <h4 className="text-lg font-bold text-neutral-900 mb-1">{plan.name}</h4>
                  <p className="text-2xl font-bold text-neutral-900 mb-1">
                    ₹{plan.price.toLocaleString('en-IN')}
                    <span className="text-sm font-normal text-neutral-600">/mo</span>
                  </p>
                  <p className="text-xs text-neutral-600 mb-3">{plan.credits} verifications/month</p>
                  <ul className="space-y-1.5 mb-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                        <Icon icon="mdi:check-circle" width={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <button disabled className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed">
                      Current Plan
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      {plan.price > currentPlan.price ? (
                        <button className="flex-1 px-3 py-2 text-sm rounded-md text-white hover:shadow-lg transition" style={{ background: 'linear-gradient(135deg,#F97316,#1E3A8A)' }}>
                          Upgrade
                        </button>
                      ) : (
                        <button className="flex-1 px-3 py-2 text-sm rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition">
                          Downgrade
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Invoice History */}
        <div className="rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-neutral-900 mb-4" style={{ fontFamily: 'var(--font-geist)' }}>Invoice History</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">Plan</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {history.map((h, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 text-sm text-neutral-900">
                      {new Date(String(h.timestamp)).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{String(h.product_id)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900">
                      {((Number(h.price) || 0) / 100).toLocaleString('en-IN', { style: 'currency', currency: String(h.currency || 'INR') })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-neutral-500">
                      No invoices yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage Analytics */}
        <div className="mt-6 rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-neutral-900 mb-4" style={{ fontFamily: 'var(--font-geist)' }}>Usage Analytics</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-neutral-200/70 p-4">
              <p className="text-xs text-neutral-600 mb-1">Verifications (30d)</p>
              <p className="text-2xl font-bold text-neutral-900" style={{ fontFamily: 'var(--font-geist)' }}>248</p>
            </div>
            <div className="rounded-lg border border-neutral-200/70 p-4">
              <p className="text-xs text-neutral-600 mb-1">Credits used/team member</p>
              <p className="text-2xl font-bold text-neutral-900" style={{ fontFamily: 'var(--font-geist)' }}>~150</p>
            </div>
            <div className="rounded-lg border border-neutral-200/70 p-4">
              <p className="text-xs text-neutral-600 mb-1">Trend</p>
              <p className="text-2xl font-bold text-green-600" style={{ fontFamily: 'var(--font-geist)' }}>+12%</p>
            </div>
          </div>
        </div>
      </PageShell>
    </Protected>
  );
}
