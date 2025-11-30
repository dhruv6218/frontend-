"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/lib/auth/mock-client";
import Link from "next/link";

export default function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [unread, setUnread] = useState<number>(0);
  const displayName = (user && (user as unknown as Record<string, unknown>)["displayName"] ? String((user as unknown as Record<string, unknown>)["displayName"]) : "Account");
  const role = (user && (user as unknown as Record<string, unknown>)["role"] ? String((user as unknown as Record<string, unknown>)["role"]) : "user");

  useEffect(() => {
    // Mock unread count
    setUnread(3);
  }, []);

  return (
    <div className="h-12 border-b border-neutral-200/70 bg-white/70 backdrop-blur flex items-center justify-between px-3">
      <div className="flex items-center gap-2">
        <button aria-label="Toggle sidebar" className="p-2 rounded-md hover:bg-neutral-100" onClick={onToggleSidebar}>
          <Icon icon="mdi:menu" width={18} />
        </button>
        <div className="relative">
          <Icon icon="mdi:magnify" width={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            aria-label="Search"
            placeholder="Search vendors, reports, or IDs…"
            className="pl-7 pr-3 py-1.5 rounded-md border border-neutral-200/70 text-sm w-64 bg-white/80"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          aria-label="Toggle theme"
          onClick={() => setTheme(t => (t === "light" ? "dark" : "light"))}
          className="px-2 py-1.5 text-xs rounded-md border border-neutral-200/70 bg-white/80"
        >
          <span>{theme === "light" ? "Light" : "Dark"}</span>
        </button>
        <Link href="/dashboard/notifications" aria-label="Notifications" className="relative p-2 rounded-md hover:bg-neutral-100">
          <Icon icon="mdi:bell-outline" width={18} />
          {unread > 0 && <span className="absolute -top-0.5 -right-0.5 h-4 w-4 text-[10px] rounded-full bg-orange-500 text-white flex items-center justify-center">{unread}</span>}
        </Link>
        <div className="relative group">
          <button aria-label="User menu" className="flex items-center gap-2 px-2 py-1.5 rounded-md border border-neutral-200/70 bg-white/80">
            <Icon icon="mdi:account-circle" width={18} />
            <span className="text-xs">{displayName}</span>
            <Icon icon="mdi:chevron-down" width={16} />
          </button>
          <div className="absolute right-0 mt-1 w-48 rounded-md border border-neutral-200/70 bg-white/90 backdrop-blur shadow hidden group-hover:block">
            <ul className="py-1 text-sm">
              <li className="px-3 py-2 text-neutral-600">Role: {role}</li>
              <li><button className="w-full text-left px-3 py-2 hover:bg-neutral-100">Profile</button></li>
              <li><button className="w-full text-left px-3 py-2 hover:bg-neutral-100" onClick={() => logout()}>Sign out</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
