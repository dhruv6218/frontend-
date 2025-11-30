"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/dashboard/Sidebar";
import Topbar from "@/app/components/dashboard/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-[80vh] rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur overflow-hidden">
      <Topbar onToggleSidebar={() => setCollapsed(c => !c)} />
      <div className="grid grid-cols-[auto,1fr]" style={{ gridTemplateColumns: collapsed ? "56px 1fr" : "240px 1fr" }}>
        <div className="min-h-[70vh]">
          <Sidebar collapsed={collapsed} />
        </div>
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
