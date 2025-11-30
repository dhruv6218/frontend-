"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

interface NavItem {
    label: string;
    href: string;
    icon: string;
}

const navItems: NavItem[] = [
    { label: "Overview", href: "/admin", icon: "mdi:view-dashboard" },
    { label: "Users", href: "/admin/users", icon: "mdi:account-group-outline" },
    { label: "Credits", href: "/admin/credits", icon: "mdi:coin-outline" },
    { label: "Reports", href: "/admin/reports", icon: "mdi:file-chart-outline" },
    { label: "Notifications", href: "/admin/notifications", icon: "mdi:bell-outline" },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: "mdi:clipboard-text-clock-outline" },
    { label: "Settings", href: "/admin/settings", icon: "mdi:cog-outline" },
    { label: "Feedback", href: "/admin/feedback", icon: "mdi:message-text-outline" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Top Bar */}
            <div className="sticky top-0 z-40 bg-white border-b border-neutral-200/70 backdrop-blur">
                <div className="flex items-center justify-between h-14 px-4">
                    {/* Left: Logo + Menu Button */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition"
                            aria-label="Toggle menu"
                        >
                            <Icon icon={sidebarOpen ? "mdi:close" : "mdi:menu"} width={22} />
                        </button>
                        <Link href="/admin" className="flex items-center gap-2">
                            <img
                                src="https://storage.googleapis.com/cosmic-project-image-assets/images/79aa3ba9-d63f-4809-917e-d4732ea12325/pic.jpg"
                                alt="Ravono Logo"
                                className="h-7 w-7 rounded-md object-contain"
                            />
                            <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-geist)" }}>
                                RAVONO ADMIN
                            </span>
                        </Link>
                    </div>

                    {/* Right: Admin User */}
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-medium text-neutral-900">Admin User</p>
                            <p className="text-xs text-neutral-500">admin@ravono.com</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                            AU
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar - Desktop */}
                <aside className="hidden lg:block w-64 border-r border-neutral-200/70 bg-white min-h-[calc(100vh-3.5rem)] sticky top-14">
                    <nav className="p-3 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive
                                            ? "bg-orange-50 text-orange-700 border border-orange-200 font-medium"
                                            : "hover:bg-neutral-100 text-neutral-700"
                                        }`}
                                >
                                    <Icon icon={item.icon} width={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Sidebar - Mobile */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSidebarOpen(false)}
                                className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                            />

                            {/* Sidebar */}
                            <motion.aside
                                initial={{ x: -280 }}
                                animate={{ x: 0 }}
                                exit={{ x: -280 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed left-0 top-14 bottom-0 w-64 bg-white border-r border-neutral-200/70 z-50 lg:hidden overflow-y-auto"
                            >
                                <nav className="p-3 space-y-1">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive
                                                        ? "bg-orange-50 text-orange-700 border border-orange-200 font-medium"
                                                        : "hover:bg-neutral-100 text-neutral-700"
                                                    }`}
                                            >
                                                <Icon icon={item.icon} width={20} />
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
