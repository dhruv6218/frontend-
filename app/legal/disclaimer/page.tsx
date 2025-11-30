"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-900 bg-clip-text text-transparent mb-4">
          Disclaimer
        </h1>
        <p className="text-neutral-600 mb-8">Last updated: November 2025</p>

        <div className="prose prose-neutral max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. No Professional Advice</h2>
            <p className="text-neutral-700 mb-4">
              All information and reports provided by Ravono Vendor Compliance are for general informational and risk-assessment
              purposes only.
            </p>
            <p className="text-neutral-700">
              They do not constitute legal, tax, financial, or compliance advice, and should not be treated as a substitute for
              professional judgment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Manual Verification Required</h2>
            <div className="p-6 rounded-xl bg-orange-50 border-2 border-orange-200 mb-4">
              <p className="text-neutral-900 font-semibold mb-2">⚠️ Critical Requirement</p>
              <p className="text-neutral-700">
                Users are solely responsible for independently checking each report before acting on it.
              </p>
            </div>
            <div className="space-y-4 text-neutral-700">
              <p>You should confirm critical information using:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Official government portals</li>
                <li>Primary documents</li>
                <li>Banks and financial institutions</li>
                <li>Qualified advisors (CAs, lawyers, compliance experts)</li>
              </ul>
              <p className="font-semibold">
                Decisions such as onboarding a vendor, extending credit, or signing contracts must not rely only on the automated report.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. APIs, Data Sources, and Delays</h2>
            <p className="text-neutral-700 mb-4">
              Reports depend on external APIs, public databases, and third-party systems that can be slow, unavailable, or change
              without notice.
            </p>
            <p className="text-neutral-700 mb-4">
              As a result, data in a report may sometimes be delayed, incomplete, or inaccurate.
            </p>
            <p className="text-neutral-700">
              We use reasonable technical measures (logging, retries, monitoring), but we do not control those external systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. No Responsibility for Loss</h2>
            <p className="text-neutral-700 mb-4">
              Users accept that they use the platform at their own risk.
            </p>
            <p className="text-neutral-700">
              To the fullest extent allowed by law, we are not responsible for any loss, damage, penalty, or legal claim arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 mt-4">
              <li>Use of the reports</li>
              <li>Any error or delay in data</li>
              <li>Reliance on automated checks instead of manual verification</li>
            </ul>
          </section>

          <section className="p-6 rounded-xl bg-blue-50 border border-blue-200">
            <h3 className="font-bold text-neutral-900 mb-2">Summary</h3>
            <p className="text-neutral-700">
              Ravono Vendor Compliance is a tool to assist your due diligence process. It is not a replacement for professional
              judgment, manual verification, or expert advice. Always verify critical information independently before making
              business decisions.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-orange-50 to-blue-50 border border-orange-200">
          <p className="text-sm text-neutral-700">
            Questions about this disclaimer?{" "}
            <Link href="/contact" className="text-orange-600 font-medium hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
