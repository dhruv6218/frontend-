"use client";

import React from "react";
import DashboardLayout from "@/app/components/dashboard/Layout";
import ElectricBorder from "@/app/components/ElectricBorder";

export default function PageShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl" style={{ fontFamily: 'var(--font-geist)', fontWeight: 600 }}><span>{title}</span></h1>
          {subtitle && <p className="text-sm text-neutral-600 mt-1"><span>{subtitle}</span></p>}
        </div>
        <ElectricBorder color="#F97316" chaos={0.4} speed={1.2}>
          <div className="p-4">
            {children}
          </div>
        </ElectricBorder>
      </div>
    </DashboardLayout>
  );
}
