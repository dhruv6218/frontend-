"use client";

import React, { useState } from "react";
import Protected from "@/app/components/auth/Protected";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { mockReportStats } from "@/lib/mock/admin-data";

export default function AdminReports() {
    const [planFilter, setPlanFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");

    const filteredReports = mockReportStats.filter(report => {
        const matchesPlan = planFilter === "All" || report.plan === planFilter;
        const matchesType = typeFilter === "All" || report.verificationType === typeFilter;
        return matchesPlan && matchesType;
    });

    const totalReports = mockReportStats.reduce((sum, r) => sum + r.totalReports, 0);
    const driveConnected = mockReportStats.filter(r => r.driveReports > 0).length;
    const notConnected = mockReportStats.length - driveConnected;

    return (
        <Protected allowedRoles={["admin"]}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-neutral-900" style={{ fontFamily: "var(--font-geist)" }}>
                        Reports & Storage
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">View report statistics and Google Drive connections</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl border border-neutral-200/70 p-5"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Icon icon="mdi:file-chart" width={22} className="text-blue-600" />
                            </div>
                            <span className="text-2xl font-bold text-neutral-900">{totalReports}</span>
                        </div>
                        <p className="text-sm font-medium text-neutral-600">Total Reports</p>
                        <p className="text-xs text-neutral-400 mt-1">All time</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl border border-neutral-200/70 p-5"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                                <Icon icon="mdi:calendar-month" width={22} className="text-orange-600" />
                            </div>
                            <span className="text-2xl font-bold text-neutral-900">{totalReports}</span>
                        </div>
                        <p className="text-sm font-medium text-neutral-600">This Month</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl border border-neutral-200/70 p-5"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                                <Icon icon="mdi:google-drive" width={22} className="text-green-600" />
                            </div>
                            <span className="text-2xl font-bold text-neutral-900">{driveConnected}</span>
                        </div>
                        <p className="text-sm font-medium text-neutral-600">Drive Connected</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl border border-neutral-200/70 p-5"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                                <Icon icon="mdi:cloud-off-outline" width={22} className="text-red-600" />
                            </div>
                            <span className="text-2xl font-bold text-neutral-900">{notConnected}</span>
                        </div>
                        <p className="text-sm font-medium text-neutral-600">Not Connected</p>
                    </motion.div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-neutral-200/70 p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">Date Range</label>
                            <input
                                type="text"
                                placeholder="Select date range..."
                                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">Plan</label>
                            <select
                                value={planFilter}
                                onChange={(e) => setPlanFilter(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            >
                                <option value="All">All Plans</option>
                                <option value="Free">Free</option>
                                <option value="Starter">Starter</option>
                                <option value="Professional">Professional</option>
                                <option value="Business">Business</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">Verification Type</label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            >
                                <option value="All">All Types</option>
                                <option value="GST">GST</option>
                                <option value="PAN">PAN</option>
                                <option value="Aadhaar">Aadhaar</option>
                                <option value="Bank">Bank</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Reports Table */}
                <div className="bg-white rounded-xl border border-neutral-200/70 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">User Email</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden md:table-cell">Organization</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Plan</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Total Reports</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden lg:table-cell">Drive Reports</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Last Report</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {filteredReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-neutral-50 transition">
                                        <td className="px-4 py-3 text-sm text-neutral-900">{report.userEmail}</td>
                                        <td className="px-4 py-3 text-sm text-neutral-600 hidden md:table-cell">{report.organization}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${report.plan === 'Business' ? 'bg-purple-100 text-purple-700' :
                                                    report.plan === 'Professional' ? 'bg-blue-100 text-blue-700' :
                                                        report.plan === 'Starter' ? 'bg-green-100 text-green-700' :
                                                            'bg-neutral-100 text-neutral-700'
                                                }`}>
                                                {report.plan}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-neutral-900">{report.totalReports}</td>
                                        <td className="px-4 py-3 text-sm text-neutral-600 hidden lg:table-cell">{report.driveReports}</td>
                                        <td className="px-4 py-3 text-sm text-neutral-600">
                                            {new Date(report.lastReportDate).toLocaleDateString('en-IN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Protected>
    );
}
