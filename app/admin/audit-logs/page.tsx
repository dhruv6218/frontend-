"use client";

import React, { useState } from "react";
import Protected from "@/app/components/auth/Protected";
import { Icon } from "@iconify/react";
import { mockAuditLogs } from "@/lib/mock/admin-data";

export default function AdminAuditLogs() {
  const [actorFilter, setActorFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesActor = !actorFilter || log.actor.toLowerCase().includes(actorFilter.toLowerCase());
    const matchesAction = actionFilter === "All" || log.actionType === actionFilter;
    return matchesActor && matchesAction;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Protected allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900" style={{ fontFamily: "var(--font-geist)" }}>
            Audit Logs
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Track all system activities and changes</p>
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
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Actor (Email)</label>
              <input
                type="text"
                placeholder="Search by email..."
                value={actorFilter}
                onChange={(e) => setActorFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Action Type</label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="All">All Actions</option>
                <option value="Login">Login</option>
                <option value="Credits changed">Credits changed</option>
                <option value="Plan changed">Plan changed</option>
                <option value="Report generated">Report generated</option>
                <option value="Notification sent">Notification sent</option>
                <option value="User suspended">User suspended</option>
                <option value="User activated">User activated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-xl border border-neutral-200/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Actor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Action Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden md:table-cell">Target</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden lg:table-cell">Details</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden xl:table-cell">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50 transition">
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-900">{log.actor}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${log.actionType === 'Login' ? 'bg-blue-100 text-blue-700' :
                          log.actionType === 'Credits changed' ? 'bg-green-100 text-green-700' :
                            log.actionType === 'User suspended' ? 'bg-red-100 text-red-700' :
                              'bg-neutral-100 text-neutral-700'
                        }`}>
                        {log.actionType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 hidden md:table-cell">{log.target}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 hidden lg:table-cell">{log.details}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500 font-mono hidden xl:table-cell">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Protected>
  );
}
