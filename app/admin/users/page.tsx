"use client";

import React, { useState, useMemo } from "react";
import Protected from "@/app/components/auth/Protected";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { mockUsers, type AdminUser } from "@/lib/mock/admin-data";
import Link from "next/link";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlan = planFilter === "All" || user.plan === planFilter;
      const matchesStatus = statusFilter === "All" || user.status === statusFilter;
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [searchQuery, planFilter, statusFilter]);

  const handleManageUser = (user: AdminUser) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  return (
    <Protected allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900" style={{ fontFamily: "var(--font-geist)" }}>
            Users
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Manage user accounts and plans</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-neutral-200/70 p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Icon icon="mdi:magnify" width={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Plan Filter */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="All">All Plans</option>
              <option value="Free">Free</option>
              <option value="Starter">Starter</option>
              <option value="Professional">Professional</option>
              <option value="Business">Business</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-neutral-200/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden md:table-cell">Organization</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Plan</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden lg:table-cell">Credits</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50 transition">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 hidden md:table-cell">{user.organization}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.plan === 'Business' ? 'bg-purple-100 text-purple-700' :
                          user.plan === 'Professional' ? 'bg-blue-100 text-blue-700' :
                            user.plan === 'Starter' ? 'bg-green-100 text-green-700' :
                              'bg-neutral-100 text-neutral-700'
                        }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 hidden lg:table-cell">
                      {user.credits}/{user.monthlyLimit}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleManageUser(user)}
                        className="text-sm font-medium text-orange-600 hover:text-orange-700 transition"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Icon icon="mdi:account-search" width={48} className="mx-auto text-neutral-300 mb-3" />
              <p className="text-sm text-neutral-500">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* User Management Drawer */}
      <AnimatePresence>
        {drawerOpen && selectedUser && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/30 z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: "var(--font-geist)" }}>
                  Manage User
                </h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition"
                >
                  <Icon icon="mdi:close" width={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* User Details */}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">User Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Name:</span>
                      <span className="font-medium text-neutral-900">{selectedUser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Email:</span>
                      <span className="font-medium text-neutral-900">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Organization:</span>
                      <span className="font-medium text-neutral-900">{selectedUser.organization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Created:</span>
                      <span className="font-medium text-neutral-900">
                        {new Date(selectedUser.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Credits:</span>
                      <span className="font-medium text-neutral-900">{selectedUser.credits}/{selectedUser.monthlyLimit}</span>
                    </div>
                  </div>
                </div>

                {/* Plan Management */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Plan</label>
                  <select
                    defaultValue={selectedUser.plan}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="Free">Free</option>
                    <option value="Starter">Starter</option>
                    <option value="Professional">Professional</option>
                    <option value="Business">Business</option>
                  </select>
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Status</label>
                  <div className="flex items-center gap-3">
                    <button
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${selectedUser.status === 'Active'
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : 'bg-neutral-100 text-neutral-600 border-2 border-transparent'
                        }`}
                    >
                      Active
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${selectedUser.status === 'Suspended'
                          ? 'bg-red-100 text-red-700 border-2 border-red-300'
                          : 'bg-neutral-100 text-neutral-600 border-2 border-transparent'
                        }`}
                    >
                      Suspended
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link
                      href={`/admin/credits?user=${selectedUser.email}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition text-sm font-medium text-neutral-700"
                    >
                      <Icon icon="mdi:coin-outline" width={18} />
                      <span>Adjust Credits</span>
                    </Link>
                    <Link
                      href={`/admin/reports?user=${selectedUser.email}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition text-sm font-medium text-neutral-700"
                    >
                      <Icon icon="mdi:file-chart-outline" width={18} />
                      <span>View Reports</span>
                    </Link>
                  </div>
                </div>

                {/* Save Button */}
                <button className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white font-medium text-sm hover:shadow-lg transition">
                  Save Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Protected>
  );
}
