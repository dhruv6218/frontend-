"use client";

import React from "react";
import Protected from "@/app/components/auth/Protected";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { mockUsers, mockReportStats, mockAuditLogs } from "@/lib/mock/admin-data";

const ORANGE = "#F97316";

export default function AdminOverview() {
  // Calculate stats
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.status === 'Active').length;
  const usersByPlan = {
    Free: mockUsers.filter(u => u.plan === 'Free').length,
    Starter: mockUsers.filter(u => u.plan === 'Starter').length,
    Professional: mockUsers.filter(u => u.plan === 'Professional').length,
    Business: mockUsers.filter(u => u.plan === 'Business').length,
  };
  const totalReports = mockReportStats.reduce((sum, r) => sum + r.totalReports, 0);

  // Reports by type
  const reportsByType = mockReportStats.reduce((acc, r) => {
    acc[r.verificationType] = (acc[r.verificationType] || 0) + r.totalReports;
    return acc;
  }, {} as Record<string, number>);

  const maxReports = Math.max(...Object.values(reportsByType));

  // Recent activity (last 5 audit logs)
  const recentActivity = mockAuditLogs.slice(0, 5);

  return (
    <Protected allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900" style={{ fontFamily: "var(--font-geist)" }}>
            Admin Overview
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Dashboard and key metrics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-neutral-200/70 p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Icon icon="mdi:account-group" width={22} className="text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{totalUsers}</span>
            </div>
            <p className="text-sm font-medium text-neutral-600">Total Users</p>
          </motion.div>

          {/* Active Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-neutral-200/70 p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Icon icon="mdi:account-check" width={22} className="text-green-600" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{activeUsers}</span>
            </div>
            <p className="text-sm font-medium text-neutral-600">Active Users</p>
          </motion.div>

          {/* Users by Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-neutral-200/70 p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Icon icon="mdi:chart-pie" width={22} className="text-purple-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-neutral-600 mb-2">Users by Plan</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span>Free:</span><span className="font-semibold">{usersByPlan.Free}</span></div>
              <div className="flex justify-between"><span>Starter:</span><span className="font-semibold">{usersByPlan.Starter}</span></div>
              <div className="flex justify-between"><span>Pro:</span><span className="font-semibold">{usersByPlan.Professional}</span></div>
              <div className="flex justify-between"><span>Business:</span><span className="font-semibold">{usersByPlan.Business}</span></div>
            </div>
          </motion.div>

          {/* Total Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-neutral-200/70 p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Icon icon="mdi:file-chart" width={22} className="text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{totalReports}</span>
            </div>
            <p className="text-sm font-medium text-neutral-600">Total Reports</p>
            <p className="text-xs text-neutral-400 mt-1">This month</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reports by Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-neutral-200/70 p-6"
          >
            <h2 className="text-lg font-semibold text-neutral-900 mb-4" style={{ fontFamily: "var(--font-geist)" }}>
              Reports by Type
            </h2>
            <div className="space-y-3">
              {Object.entries(reportsByType).map(([type, count], index) => (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-700">{type}</span>
                    <span className="text-sm font-semibold text-neutral-900">{count}</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxReports) * 100}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(135deg, ${ORANGE}, #1E3A8A)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl border border-neutral-200/70 p-6"
          >
            <h2 className="text-lg font-semibold text-neutral-900 mb-4" style={{ fontFamily: "var(--font-geist)" }}>
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((log) => (
                <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-neutral-100 last:border-0 last:pb-0">
                  <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:clock-outline" width={16} className="text-neutral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900">{log.actionType}</p>
                    <p className="text-xs text-neutral-500 truncate">{log.actor} → {log.target}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Protected>
  );
}
