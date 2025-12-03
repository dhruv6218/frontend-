"use client";

import React, { useState, useMemo } from "react";
import Protected from "@/app/components/auth/Protected";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { mockReportStats } from "@/lib/mock/admin-data";

export default function AdminReports() {
    const [planFilter, setPlanFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("30"); // days

    const filteredReports = useMemo(() => {
        const daysAgo = parseInt(dateFilter);
        const filterDate = new Date();
        filterDate.setDate(filterDate.getDate() - daysAgo);
        
        return mockReportStats.filter(report => {
            const matchesPlan = planFilter === "All" || report.plan === planFilter;
            const matchesType = typeFilter === "All" || report.verificationType === typeFilter;
            const reportDate = new Date(report.lastReportDate);
            const matchesDate = reportDate >= filterDate;
            return matchesPlan && matchesType && matchesDate;
        });
    }, [planFilter, typeFilter, dateFilter]);

    const totalReports = filteredReports.reduce((sum, r) => sum + r.totalReports, 0);
    const driveConnected = filteredReports.filter(r => r.driveReports > 0).length;
    const notConnected = filteredReports.length - driveConnected;

    // Reports by type statistics
    const reportsByType = useMemo(() => {
        const typeMap: Record<string, number> = {};
        filteredReports.forEach(report => {
            const type = report.verificationType || "Other";
            typeMap[type] = (typeMap[type] || 0) + report.totalReports;
        });
        return Object.entries(typeMap).map(([type, count]) => ({ type, count }));
    }, [filteredReports]);

    // Reports by plan statistics
    const reportsByPlan = useMemo(() => {
        const planMap: Record<string, number> = {};
        filteredReports.forEach(report => {
            const plan = report.plan || "Unknown";
            planMap[plan] = (planMap[plan] || 0) + report.totalReports;
        });
        return Object.entries(planMap).map(([plan, count]) => ({ plan, count }));
    }, [filteredReports]);

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

                {/* Charts & Statistics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {/* Reports by Type Chart */}
                    <div className="bg-white rounded-xl border border-neutral-200/70 p-5">
                        <h3 className="text-sm font-semibold text-neutral-900 mb-4" style={{ fontFamily: "var(--font-geist)" }}>
                            Reports by Type
                        </h3>
                        <div className="space-y-3">
                            {reportsByType.length > 0 ? reportsByType.map((item, idx) => {
                                const maxCount = Math.max(...reportsByType.map(r => r.count));
                                const percentage = (item.count / maxCount) * 100;
                                return (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-neutral-700">{item.type}</span>
                                            <span className="text-neutral-600">{item.count} reports</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-blue-600"
                                            />
                                        </div>
                                    </div>
                                );
                            }) : (
                                <p className="text-sm text-neutral-500 text-center py-4">No data available</p>
                            )}
                        </div>
                    </div>

                    {/* Reports by Plan Statistics */}
                    <div className="bg-white rounded-xl border border-neutral-200/70 p-5">
                        <h3 className="text-sm font-semibold text-neutral-900 mb-4" style={{ fontFamily: "var(--font-geist)" }}>
                            Reports by Plan
                        </h3>
                        <div className="space-y-3">
                            {reportsByPlan.length > 0 ? reportsByPlan.map((item, idx) => {
                                const total = reportsByPlan.reduce((sum, r) => sum + r.count, 0);
                                const percentage = total > 0 ? (item.count / total) * 100 : 0;
                                return (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 bg-neutral-50">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${
                                                item.plan === 'Business' ? 'bg-purple-500' :
                                                item.plan === 'Professional' ? 'bg-blue-500' :
                                                item.plan === 'Starter' ? 'bg-green-500' :
                                                'bg-neutral-500'
                                            }`} />
                                            <span className="text-sm font-medium text-neutral-900">{item.plan}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-neutral-600">{item.count}</span>
                                            <span className="text-xs text-neutral-500 w-12 text-right">{percentage.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <p className="text-sm text-neutral-500 text-center py-4">No data available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-neutral-200/70 p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1.5">Date Range</label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            >
                                <option value="7">Last 7 Days</option>
                                <option value="30">Last 30 Days</option>
                                <option value="90">Last 90 Days</option>
                                <option value="365">Last Year</option>
                                <option value="all">All Time</option>
                            </select>
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
