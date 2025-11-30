"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-900 bg-clip-text text-transparent mb-4">
          Privacy Policy
        </h1>
        <p className="text-neutral-600 mb-8">Last updated: November 2025</p>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Introduction</h2>
            <p className="text-neutral-700 mb-4">
              Ravono Vendor Compliance is a SaaS platform that helps businesses verify vendors and generate compliance reports.
              This Privacy Policy describes what data we collect, how we use it, and users' rights regarding their personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Information We Collect</h2>
            <div className="space-y-4 text-neutral-700">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Account Data</h3>
                <p>Name, email, phone (optional), organization name, and role.</p>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Usage Data</h3>
                <p>IP address, device/browser information, pages visited, and actions (logins, verifications, downloads).</p>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Verification Data</h3>
                <p>Vendor identifiers and documents (GST, PAN, Aadhaar, MCA, CIN, DIN, bank details) that customers submit.</p>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Payment Data</h3>
                <p>Processed by payment providers (such as Razorpay). We do not store full card details.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. How We Use Information</h2>
            <ul className="list-disc list-inside space-y-2 text-neutral-700">
              <li>To create and manage user accounts and organizations</li>
              <li>To perform vendor verifications and generate reports</li>
              <li>To monitor, secure, and improve the platform (logs, analytics, troubleshooting)</li>
              <li>To communicate with users about service changes, billing, and support</li>
              <li>To comply with legal, tax, and accounting obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Sharing of Information</h2>
            <p className="text-neutral-700 mb-4">We share information with:</p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700">
              <li>Infrastructure and service providers (e.g., Supabase for hosting/database/storage, email providers, analytics, error tracking)</li>
              <li>External verification APIs and government portals required to perform checks</li>
              <li>Payment processors that handle billing</li>
              <li>Authorities or legal advisors when required by law or to protect rights and safety</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Data Retention</h2>
            <p className="text-neutral-700">
              We keep account and verification data for as long as the account is active. After closure, we retain limited records
              for a defined period (for legal and audit purposes), then delete or anonymize the data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Security</h2>
            <p className="text-neutral-700">
              We use HTTPS, encryption in transit, access control, and role-based permissions. While no system is perfectly secure,
              we take reasonable technical and organizational measures to protect your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Cookies and Tracking</h2>
            <p className="text-neutral-700 mb-4">We use:</p>
            <ul className="list-disc list-inside space-y-2 text-neutral-700">
              <li><strong>Essential cookies:</strong> Login/session management</li>
              <li><strong>Preference cookies:</strong> Theme and language preferences</li>
              <li><strong>Analytics/error-tracking cookies:</strong> To improve the platform</li>
            </ul>
            <p className="text-neutral-700 mt-4">
              You can control cookies through browser settings, but disabling essential cookies may break core functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Your Rights</h2>
            <ul className="list-disc list-inside space-y-2 text-neutral-700">
              <li>Access, update, or correct your account information</li>
              <li>Request deletion or restriction of data (subject to legal limits)</li>
              <li>Contact us for data requests at <a href="mailto:info@ravonovendor.co.in" className="text-orange-600 hover:underline">info@ravonovendor.co.in</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. Contact</h2>
            <p className="text-neutral-700">
              For privacy questions and data requests, please contact us at{" "}
              <a href="mailto:info@ravonovendor.co.in" className="text-orange-600 hover:underline">
                info@ravonovendor.co.in
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-orange-50 to-blue-50 border border-orange-200">
          <p className="text-sm text-neutral-700">
            Have questions about our privacy practices?{" "}
            <Link href="/contact" className="text-orange-600 font-medium hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
