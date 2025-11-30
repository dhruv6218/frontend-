"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import { Icon } from "@iconify/react";

export default function ReportDetailClient({ id }: { id: string }) {
    const sample = {
        vendor: "Neo Components",
        gstin: "29AAACN9999Q1Z2",
        pan: "AAACN9999Q",
        aadhaar: "**** **** 4321",
        bank: { account: "XXXXXX4401", ifsc: "SBIN0007654" },
        status: "Flagged",
        risk: 74,
        reasoning: [
            "PAN name mismatch detected against invoice header.",
            "MCA status Active but address differs from GST principal place.",
            "Bank account holder does not match PAN record (possible intermediary).",
        ],
    };

    return (
        <Protected allowedRoles={["user"]}>
            <PageShell title={`Report ${id}`} subtitle="Consolidated vendor verification summary with AI reasoning">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2 rounded-lg border border-neutral-200/70 bg-white/80 p-4">
                        <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Vendor</p>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div><span className="text-neutral-500">Name:</span> {sample.vendor}</div>
                            <div><span className="text-neutral-500">Risk Score:</span> {sample.risk}</div>
                            <div><span className="text-neutral-500">GSTIN:</span> {sample.gstin}</div>
                            <div><span className="text-neutral-500">PAN:</span> {sample.pan}</div>
                            <div><span className="text-neutral-500">Aadhaar:</span> {sample.aadhaar}</div>
                            <div><span className="text-neutral-500">Bank:</span> {sample.bank.account} / {sample.bank.ifsc}</div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Checks Summary</p>
                            <ul className="mt-2 text-sm list-disc list-inside">
                                <li>GST: Active; filings delayed by 1 month</li>
                                <li>PAN: Name mismatch vs invoice</li>
                                <li>Aadhaar: Verified via OTP; VID available</li>
                                <li>Bank: Name mismatch (risk)</li>
                                <li>MCA: Active; 0 charges</li>
                            </ul>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Fraud reasoning</p>
                            <ul className="mt-2 text-sm list-disc list-inside">
                                {sample.reasoning.map((r) => (<li key={r}>{r}</li>))}
                            </ul>
                        </div>
                    </div>
                    <div className="rounded-lg border border-neutral-200/70 bg-white/80 p-4">
                        <p className="text-sm" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}>Actions</p>
                        <div className="mt-2 flex flex-col gap-2">
                            <button className="px-3 py-2 text-sm rounded-md text-white" style={{ background: 'linear-gradient(135deg,#F97316,#1E3A8A)' }}>
                                <span className="inline-flex items-center gap-1"><Icon icon="mdi:file-pdf-box" width={18} /> Download PDF</span>
                            </button>
                            <button className="px-3 py-2 text-sm rounded-md border border-neutral-200/70">Share Secure Link</button>
                            <button className="px-3 py-2 text-sm rounded-md border border-neutral-200/70">Create Dispute Ticket</button>
                        </div>
                    </div>
                </div>
            </PageShell>
        </Protected>
    );
}
