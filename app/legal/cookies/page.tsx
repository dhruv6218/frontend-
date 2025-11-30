"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-900 bg-clip-text text-transparent mb-4">
          Cookies Policy
        </h1>
        <p className="text-neutral-600 mb-8">Last updated: November 2025</p>

        <div className="prose prose-neutral max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. What Cookies Are</h2>
            <p className="text-neutral-700">
              Cookies are small files stored in your browser to remember information and improve your experience on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Types of Cookies We Use</h2>
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <h3 className="font-bold text-neutral-900 mb-2">Essential Cookies</h3>
                <p className="text-neutral-700">
                  Required for login, security, and session management. These cookies are necessary for the service to work correctly.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <h3 className="font-bold text-neutral-900 mb-2">Preference Cookies</h3>
                <p className="text-neutral-700">
                  Remember your settings such as language, theme (light/dark mode), and other preferences.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <h3 className="font-bold text-neutral-900 mb-2">Analytics and Performance Cookies</h3>
                <p className="text-neutral-700">
                  Measure traffic, usage patterns, and help us understand how features are used to improve the platform.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                <h3 className="font-bold text-neutral-900 mb-2">Error-Tracking Cookies</h3>
                <p className="text-neutral-700">
                  Help detect bugs, crashes, and technical issues so we can fix them quickly.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. How We Use Cookies</h2>
            <ul className="list-disc list-inside space-y-2 text-neutral-700">
              <li>To keep you signed in and secure your sessions</li>
              <li>To understand how features are used and improve performance</li>
              <li>To detect abuse, fraud, or technical issues</li>
              <li>To remember your preferences across sessions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. User Choices</h2>
            <p className="text-neutral-700 mb-4">
              You can control or delete cookies using your browser settings.
            </p>
            <div className="p-6 rounded-xl bg-yellow-50 border-2 border-yellow-200">
              <p className="text-neutral-900 font-semibold mb-2">⚠️ Important</p>
              <p className="text-neutral-700">
                Blocking essential cookies may prevent the service from working correctly. You may not be able to log in or
                access key features if essential cookies are disabled.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. More Information</h2>
            <p className="text-neutral-700">
              For more details about how we handle your data, please see our{" "}
              <Link href="/legal/privacy" className="text-orange-600 font-medium hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <p className="text-neutral-700 mt-4">
              For cookie or privacy questions, contact us at{" "}
              <a href="mailto:info@ravonovendor.co.in" className="text-orange-600 font-medium hover:underline">
                info@ravonovendor.co.in
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-orange-50 to-blue-50 border border-orange-200">
          <p className="text-sm text-neutral-700">
            Questions about cookies?{" "}
            <Link href="/contact" className="text-orange-600 font-medium hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
