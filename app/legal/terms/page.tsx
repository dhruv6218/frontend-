"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-900 bg-clip-text text-transparent mb-4">
          Terms & Conditions
        </h1>
        <p className="text-neutral-600 mb-8">Last updated: November 2025</p>

        <div className="prose prose-neutral max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-neutral-700">
              Using the website or app means you agree to these Terms. If you do not agree, you must not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Description of Service</h2>
            <p className="text-neutral-700 mb-4">
              Ravono Vendor Compliance is an online SaaS platform that provides automated and manual vendor verification,
              AI-generated summaries, and PDF reports.
            </p>
            <p className="text-neutral-700">
              <strong>Important:</strong> The service is a support tool only; it is not legal, tax, or investment advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. Accounts and Eligibility</h2>
            <ul className="list-disc list-inside space-y-2 text-neutral-700">
              <li>Users must provide accurate information and keep login details confidential</li>
              <li>Unlawful, abusive, or unauthorized use is prohibited (e.g., scraping, attacking systems, sharing credentials widely)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Plans, Billing, and Credits</h2>
            <div className="space-y-4 text-neutral-700">
              <p>Current plans: Free, Starter, Professional, Business</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Paid plans renew automatically (monthly or yearly) until cancelled</li>
                <li>Taxes may be added where applicable</li>
                <li>Verification credits reset each billing period; unused credits do not roll over</li>
                <li>Over-limit usage may be blocked or charged separately</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Use of Reports and Manual Review Requirement</h2>
            <div className="space-y-4 text-neutral-700">
              <p>Reports are generated using third-party APIs, public records, and automated analysis.</p>
              <p className="font-semibold text-orange-600">
                ⚠️ Users must always review each report manually against official sources (government portals, bank confirmations,
                statutory records, professional advisors) before relying on it.
              </p>
              <p>Data can sometimes be delayed, incomplete, or inaccurate due to external systems or network issues.</p>
              <p>
                The platform does not file statutory returns, does not issue official government certificates, and does not
                replace professional advice.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Third-Party Services</h2>
            <p className="text-neutral-700 mb-4">
              The service integrates with external providers such as verification APIs, Google Drive, email, and payment gateways.
            </p>
            <p className="text-neutral-700">
              These providers are governed by their own terms and privacy policies. We are not responsible for downtime,
              changes, or failures of third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Limitation of Liability</h2>
            <div className="space-y-4 text-neutral-700">
              <p>The service is provided "as is" and "as available," without guarantees of uninterrupted operation or perfect accuracy.</p>
              <p>
                To the maximum extent permitted by law, we are not liable for any indirect, incidental, consequential, or special
                damages (including lost profits, business loss, penalties, or reputational damage).
              </p>
              <p>
                Any direct liability is capped at the fees paid by the user during the last 12 months, or the minimum required by law,
                whichever is lower.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Suspension and Termination</h2>
            <p className="text-neutral-700">
              We may suspend or terminate accounts for non-payment, suspected fraud, abuse, or legal risk. Some records may be
              retained after termination for legal and audit reasons.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. Governing Law and Dispute Resolution</h2>
            <p className="text-neutral-700">
              These Terms are governed by Indian law. Disputes will be handled by the courts or arbitration rules of India.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-orange-50 to-blue-50 border border-orange-200">
          <p className="text-sm text-neutral-700">
            Questions about these terms?{" "}
            <Link href="/contact" className="text-orange-600 font-medium hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
