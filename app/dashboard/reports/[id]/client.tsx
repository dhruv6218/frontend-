"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { mockService } from "@/lib/mock/service";
import { motion } from "framer-motion";
import Link from "next/link";
import { safeWindowOpen } from "@/lib/utils/security";
import { ToastContainer } from "@/app/components/ui/Toast";

export default function ReportDetailClient({ id }: { id: string }) {
    const [report, setReport] = useState<any>(null);
    const [driveConnected, setDriveConnected] = useState(false);
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: "success" | "error" | "info" | "warning" }>>([]);

    const addToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    useEffect(() => {
        loadReport();
        checkDriveStatus();
    }, [id]);

    async function loadReport() {
        try {
            const data = await mockService.reports.get(id);
            if (data) {
                setReport(data);
                const expiresAt = new Date(data.expires_at);
                const now = new Date();
                const days = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                setDaysRemaining(days);
            }
        } catch (err) {
            // Silently handle errors in production
            if (process.env.NODE_ENV === 'development') {
                console.error("Failed to load report", err);
            }
        } finally {
            setLoading(false);
        }
    }

    async function checkDriveStatus() {
        const status = await mockService.integrations.getDriveStatus();
        setDriveConnected(status.connected);
    }

    const handleDownloadPDF = async () => {
        try {
            const result = await mockService.reports.downloadPDF(id);
            if (result.pdf_url) {
                safeWindowOpen(result.pdf_url, '_blank');
            }
        } catch (err) {
            addToast("Failed to generate PDF. Please try again.", "error");
        }
    };

    const handleSaveToDrive = async () => {
        try {
            await mockService.reports.saveToDrive(id);
            addToast("Report saved to Google Drive successfully!", "success");
        } catch (err) {
            addToast("Failed to save to Drive. Please ensure Drive is connected.", "error");
        }
    };

    if (loading) {
        return (
            <Protected allowedRoles={["user"]}>
                <PageShell title="Loading Report..." subtitle="Please wait">
                    <div className="flex items-center justify-center py-12">
                        <Icon icon="mdi:loading" className="animate-spin text-orange-600" width={32} />
                    </div>
                </PageShell>
            </Protected>
        );
    }

    if (!report) {
        return (
            <Protected allowedRoles={["user"]}>
                <PageShell title="Report Not Found" subtitle="The requested report could not be found">
                    <Link href="/dashboard/reports" className="text-orange-600 hover:text-orange-700">
                        ← Back to Reports
                    </Link>
                </PageShell>
            </Protected>
        );
    }

    const sample = {
        vendor: report.vendor || "Neo Components",
        gstin: "29AAACN9999Q1Z2",
        pan: "AAACN9999Q",
        aadhaar: "**** **** 4321",
        bank: { account: "XXXXXX7890", ifsc: "SBIN0007654" },
        risk: report.risk_level || 74,
        created_at: report.created_at,
    };

    const aiSummary = `This vendor verification report indicates a moderate-to-high risk profile (${sample.risk}/100) based on cross-referenced government databases and financial records. The primary concerns stem from identity verification mismatches across multiple verification channels. Specifically, the PAN holder name does not align with the invoice header, suggesting potential intermediary involvement or documentation inconsistencies. The MCA records show an active company status with no outstanding charges, which is positive, but the registered address differs from the GST principal place of business, raising questions about operational consistency. Bank account verification reveals that the account holder name does not match the PAN record, which could indicate third-party payment processing or potential fraud risk. While GST filings are active, there is a one-month delay in recent filings, which may indicate operational or financial stress. Aadhaar verification was successfully completed via OTP, confirming basic identity validity. Overall, this vendor requires enhanced due diligence before engagement, particularly around payment terms and identity verification.`;

    const basicChecks = [
        { check: "GST Verification", status: "Active", details: "Filings delayed by 1 month", risk: "Low" },
        { check: "PAN Verification", status: "Valid", details: "Name mismatch vs invoice", risk: "Medium" },
        { check: "Aadhaar Verification", status: "Verified", details: "OTP verified successfully", risk: "Low" },
        { check: "Bank Account", status: "Verified", details: "Name mismatch detected", risk: "High" },
        { check: "MCA/CIN", status: "Active", details: "No charges, address mismatch", risk: "Medium" },
    ];

    const redFlags = [
        "PAN name mismatch detected against invoice header - potential intermediary or documentation issue",
        "Bank account holder does not match PAN record - possible third-party payment processing",
        "MCA registered address differs from GST principal place - operational inconsistency",
        "GST filings delayed by 1 month - potential financial or operational stress",
    ];

    const recommendedActions = [
        "Request additional identity documents (Aadhaar card, bank statement) directly from vendor",
        "Conduct manual verification call to confirm business operations and address",
        "Implement enhanced payment terms (e.g., escrow or milestone-based payments)",
        "Schedule in-person or video call meeting with vendor representatives",
        "Review vendor's financial statements and credit history before large orders",
        "Consider requesting trade references from other clients",
    ];

    return (
        <Protected allowedRoles={["user"]}>
            <PageShell title={`Report ${id}`} subtitle="Consolidated vendor verification summary with AI reasoning">
                
                {/* Expiration Warning Banner */}
                {daysRemaining !== null && daysRemaining < 2 && daysRemaining >= 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3"
                    >
                        <Icon icon="mdi:alert-circle" width={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-900 mb-1">
                                Report Expiring Soon
                            </p>
                            <p className="text-xs text-red-700">
                                This report will be automatically deleted in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}. Please download or save to Google Drive to keep a permanent copy.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Report Info & Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Vendor Details */}
                        <div className="rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: 'var(--font-geist)' }}>
                                    Vendor Details
                                </h3>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    sample.risk < 30 ? 'bg-green-100 text-green-700' :
                                    sample.risk < 60 ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    Risk Score: {sample.risk}/100
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">Vendor Name</p>
                                    <p className="font-medium text-neutral-900">{sample.vendor}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">Report Created</p>
                                    <p className="font-medium text-neutral-900">
                                        {new Date(sample.created_at).toLocaleString('en-IN', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric',
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">GSTIN</p>
                                    <p className="font-medium text-neutral-900 font-mono">{sample.gstin}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">PAN</p>
                                    <p className="font-medium text-neutral-900 font-mono">{sample.pan}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">Aadhaar</p>
                                    <p className="font-medium text-neutral-900">{sample.aadhaar}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">Bank Account</p>
                                    <p className="font-medium text-neutral-900">{sample.bank.account} / {sample.bank.ifsc}</p>
                                </div>
                            </div>
                        </div>

                        {/* AI Summary */}
                        <div className="rounded-xl border border-neutral-200/70 bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <Icon icon="mdi:brain" width={20} className="text-purple-600" />
                                <h3 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: 'var(--font-geist)' }}>
                                    AI-Powered Risk Summary
                                </h3>
                            </div>
                            <p className="text-sm text-neutral-700 leading-relaxed">
                                {aiSummary}
                            </p>
                        </div>

                        {/* Basic Checks */}
                        <div className="rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-neutral-900 mb-4" style={{ fontFamily: 'var(--font-geist)' }}>
                                Basic Checks
                            </h3>
                            <div className="space-y-3">
                                {basicChecks.map((check, idx) => (
                                    <div key={idx} className="flex items-start justify-between p-3 rounded-lg border border-neutral-100 bg-neutral-50">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-neutral-900">{check.check}</p>
                                            <p className="text-xs text-neutral-600 mt-1">{check.details}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                check.risk === 'Low' ? 'bg-green-100 text-green-700' :
                                                check.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {check.risk}
                                            </span>
                                            <span className={`w-2 h-2 rounded-full ${
                                                check.status === 'Active' || check.status === 'Verified' || check.status === 'Valid' 
                                                    ? 'bg-green-500' 
                                                    : 'bg-yellow-500'
                                            }`}></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Red Flags */}
                        <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Icon icon="mdi:flag" width={20} className="text-red-600" />
                                <h3 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: 'var(--font-geist)' }}>
                                    Red Flags
                                </h3>
                            </div>
                            <ul className="space-y-2">
                                {redFlags.map((flag, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-red-900">
                                        <Icon icon="mdi:alert-circle" width={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                                        <span>{flag}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recommended Actions */}
                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Icon icon="mdi:lightbulb-on" width={20} className="text-blue-600" />
                                <h3 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: 'var(--font-geist)' }}>
                                    Recommended Actions
                                </h3>
                            </div>
                            <ol className="space-y-2 list-decimal list-inside">
                                {recommendedActions.map((action, idx) => (
                                    <li key={idx} className="text-sm text-neutral-700">
                                        {action}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    {/* Actions Sidebar */}
                    <div className="lg:sticky lg:top-6 h-fit">
                        <div className="rounded-xl border border-neutral-200/70 bg-white p-6 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-neutral-900" style={{ fontFamily: 'var(--font-geist)' }}>
                                Actions
                            </h3>
                            
                            <button
                                onClick={handleDownloadPDF}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white text-sm font-medium hover:shadow-lg transition"
                            >
                                <Icon icon="mdi:file-pdf-box" width={18} />
                                Download PDF
                            </button>

                            <button
                                onClick={handleSaveToDrive}
                                disabled={!driveConnected}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Icon icon="mdi:google-drive" width={18} />
                                {driveConnected ? "Save to Google Drive" : "Connect Drive First"}
                            </button>

                            {!driveConnected && (
                                <Link
                                    href="/dashboard/integrations"
                                    className="block w-full text-center px-4 py-2 rounded-lg text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Connect Google Drive →
                                </Link>
                            )}

                            <div className="pt-4 border-t border-neutral-100">
                                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                                    <p className="text-xs text-amber-800">
                                        <Icon icon="mdi:information-outline" width={14} className="inline mr-1" />
                                        This report will be auto-deleted from Ravono {daysRemaining !== null && daysRemaining >= 0 ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}` : '7 days'} after creation. Download or save to Google Drive for long-term storage.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ToastContainer toasts={toasts} removeToast={removeToast} />
            </PageShell>
        </Protected>
    );
}
