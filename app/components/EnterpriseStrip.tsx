"use client";

import React from "react";
import Link from "next/link";

const NAVY = "#1E3A8A";

export default function EnterpriseStrip() {
  return (
    <section className="w-full py-10" style={{ background: NAVY }}>
      <div className="mx-auto max-w-7xl px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-xl text-white" style={{ fontFamily: "var(--font-geist)", fontWeight: 600 }}>Enterprise Ready, Fortune-500 Secure</h3>
          <p className="text-sm mt-2 text-white/80">SAML/SSO, SCIM user sync, multi-tenant isolation, custom branding, SLA dashboards, session policy. Data residency, backups, audit-proofs—trusted by leading enterprises.</p>
          <div className="mt-4">
            <Link href="/features" className="px-4 py-2 rounded-full text-sm border border-white/30 text-white/90 inline-block">Learn More</Link>
          </div>
        </div>
        <div className="justify-self-center md:justify-self-end">
          <div className="h-28 w-28 rounded-3xl border border-white/20 bg-white/10" aria-hidden />
        </div>
      </div>
    </section>
  );
}
