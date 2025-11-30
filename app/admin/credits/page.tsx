"use client";

import React, { useState } from "react";
import Protected from "@/app/components/auth/Protected";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { mockUsers, mockCreditChanges, type AdminUser, type CreditChange } from "@/lib/mock/admin-data";

export default function AdminCredits() {
    const [searchEmail, setSearchEmail] = useState("");
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [creditChange, setCreditChange] = useState("");
    const [reason, setReason] = useState("");
    const [changes, setChanges] = useState<CreditChange[]>(mockCreditChanges);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSearch = () => {
        const user = mockUsers.find(u => u.email.toLowerCase() === searchEmail.toLowerCase());
        setSelectedUser(user || null);
    };

    const handleApplyChange = () => {
        if (!selectedUser || !creditChange || !reason) return;

        const newChange: CreditChange = {
            id: String(Date.now()),
            timestamp: new Date(),
            adminName: "Admin User",
            userEmail: selectedUser.email,
            change: parseInt(creditChange),
            reason: reason,
        };

        setChanges([newChange, ...changes]);
        setCreditChange("");
        setReason("");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <Protected allowedRoles={["admin"]}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-neutral-900" style={{ fontFamily: "var(--font-geist)" }}>
                        Credits Management
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">Adjust user credits and view history</p>
                </div>

                {/* User Search */}
                <div className="bg-white rounded-xl border border-neutral-200/70 p-6 mb-6">
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">Search User by Email</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Icon icon="mdi:email-outline" width={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="email"
                                placeholder="user@example.com"
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white font-medium text-sm hover:shadow-lg transition"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Selected User Details */}
                {selectedUser && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl border border-neutral-200/70 p-6 mb-6"
                    >
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4" style={{ fontFamily: "var(--font-geist)" }}>
                            User Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-xs text-neutral-500 mb-1">Name</p>
                                <p className="text-sm font-medium text-neutral-900">{selectedUser.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500 mb-1">Email</p>
                                <p className="text-sm font-medium text-neutral-900">{selectedUser.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500 mb-1">Plan</p>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedUser.plan === 'Business' ? 'bg-purple-100 text-purple-700' :
                                        selectedUser.plan === 'Professional' ? 'bg-blue-100 text-blue-700' :
                                            selectedUser.plan === 'Starter' ? 'bg-green-100 text-green-700' :
                                                'bg-neutral-100 text-neutral-700'
                                    }`}>
                                    {selectedUser.plan}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500 mb-1">Current Credits</p>
                                <p className="text-sm font-medium text-neutral-900">{selectedUser.credits} / {selectedUser.monthlyLimit}</p>
                            </div>
                        </div>

                        {/* Credit Adjustment Form */}
                        <div className="border-t border-neutral-200 pt-6">
                            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Adjust Credits</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Change Amount (use + or -)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="e.g., +50 or -20"
                                        value={creditChange}
                                        onChange={(e) => setCreditChange(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Reason <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        placeholder="Explain why credits are being adjusted..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleApplyChange}
                                    disabled={!creditChange || !reason}
                                    className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white font-medium text-sm hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Apply Change
                                </button>
                            </div>
                        </div>

                        {/* Success Message */}
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700"
                            >
                                <Icon icon="mdi:check-circle" width={18} />
                                <span>Credits updated successfully!</span>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Recent Credit Changes */}
                <div className="bg-white rounded-xl border border-neutral-200/70 overflow-hidden">
                    <div className="px-6 py-4 border-b border-neutral-200">
                        <h2 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: "var(--font-geist)" }}>
                            Recent Credit Changes
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Time</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Admin</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">User Email</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Change</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Reason</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {changes.map((change) => (
                                    <tr key={change.id} className="hover:bg-neutral-50 transition">
                                        <td className="px-4 py-3 text-sm text-neutral-600">
                                            {new Date(change.timestamp).toLocaleString('en-IN', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-neutral-900">{change.adminName}</td>
                                        <td className="px-4 py-3 text-sm text-neutral-600">{change.userEmail}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${change.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {change.change > 0 ? '+' : ''}{change.change}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-neutral-600">{change.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {changes.length === 0 && (
                        <div className="text-center py-12">
                            <Icon icon="mdi:history" width={48} className="mx-auto text-neutral-300 mb-3" />
                            <p className="text-sm text-neutral-500">No credit changes yet</p>
                        </div>
                    )}
                </div>
            </div>
        </Protected>
    );
}
