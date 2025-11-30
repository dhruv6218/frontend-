"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PageShell from "@/app/components/dashboard/PageShell";
import Protected from "@/app/components/auth/Protected";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const tabs = [
        { name: "Profile", href: "/dashboard/settings/profile" },
        { name: "Security", href: "/dashboard/settings/security" },
        { name: "Branding", href: "/dashboard/settings/branding" },
    ];

    return (
        <Protected allowedRoles={["user", "manager", "admin"]}>
            <PageShell title="Settings" subtitle="Manage your account and preferences">
                <div className="mb-6 border-b border-neutral-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.href;
                            return (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${isActive
                                            ? "border-orange-500 text-orange-600"
                                            : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                                        }
                  `}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {tab.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                {children}
            </PageShell>
        </Protected>
    );
}
