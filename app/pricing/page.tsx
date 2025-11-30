"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { motion } from "framer-motion";

const PLANS = [
  {
    name: "Free",
    price: 0,
    verifications: "3 verifications per month",
    features: [
      "All basic verification types (GST, PAN, Aadhaar, Bank, MCA, CIN, DIN)",
      "Watermarked PDF reports",
      "Manual review reminder in every report",
      "Email support (best effort)"
    ],
    cta: "Start for free",
    href: "/auth/sign-up",
    popular: false
  },
  {
    name: "Starter",
    price: 499,
    verifications: "20 verifications per month",
    features: [
      "All verification types",
      "Watermarked PDF reports",
      "Basic dashboard & history",
      "Email support (standard)"
    ],
    cta: "Choose Starter",
    href: "/auth/sign-up",
    popular: false
  },
  {
    name: "Professional",
    price: 1499,
    verifications: "50 verifications per month",
    features: [
      "Clean, branded PDF reports (no watermark)",
      "AI-generated risk summary in reports",
      "Bulk CSV upload",
      "Google Drive integration (auto save reports)",
      "Priority email + WhatsApp support"
    ],
    cta: "Get Professional",
    href: "/auth/sign-up",
    popular: true
  },
  {
    name: "Business",
    price: 2999,
    verifications: "100 verifications per month",
    features: [
      "Everything in Professional",
      "Full white-labelling (your logo & colors on reports)",
      "API access (for your own systems)",
      "Team access (multiple users)",
      "Dedicated onboarding & support"
    ],
    cta: "Talk to us",
    href: "/contact",
    popular: false
  }
];

const FAQS = [
  {
    q: "How does billing work?",
    a: "You're charged monthly or yearly based on your selected plan. Unused verifications don't roll over to the next billing period."
  },
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes, you can change your plan anytime from your dashboard. Changes take effect immediately, and we'll prorate the difference."
  },
  {
    q: "What happens if I exceed my verification limit?",
    a: "You'll be notified when you're close to your limit. Additional verifications can be purchased at ₹50 each, or you can upgrade to a higher plan."
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use bank-grade encryption, secure storage, and maintain detailed audit logs. All plans include these security features."
  }
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-blue-900 bg-clip-text text-transparent"
        >
          Simple, transparent pricing for every team
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-neutral-600 mt-4 max-w-2xl mx-auto"
        >
          Start free, upgrade only when you need more verifications and automation.
        </motion.p>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 inline-flex items-center gap-3 p-1 rounded-full border border-neutral-200/70 bg-white/80"
        >
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-full text-sm transition ${billingCycle === "monthly"
                ? "bg-gradient-to-r from-orange-600 to-blue-900 text-white"
                : "text-neutral-600 hover:text-neutral-900"
              }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-full text-sm transition ${billingCycle === "yearly"
                ? "bg-gradient-to-r from-orange-600 to-blue-900 text-white"
                : "text-neutral-600 hover:text-neutral-900"
              }`}
          >
            Yearly <span className="text-xs ml-1 text-green-600">Save 15%</span>
          </button>
        </motion.div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {PLANS.map((plan, idx) => {
          const monthlyPrice = plan.price;
          const yearlyPrice = monthlyPrice === 0 ? 0 : Math.round(monthlyPrice * 12 * 0.85);
          const displayPrice = billingCycle === "yearly"
            ? (yearlyPrice === 0 ? "₹0" : `₹${yearlyPrice.toLocaleString('en-IN')}`)
            : (monthlyPrice === 0 ? "₹0" : `₹${monthlyPrice.toLocaleString('en-IN')}`);
          const displayPeriod = billingCycle === "yearly" ? "year" : "month";

          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className={`relative rounded-2xl border p-6 backdrop-blur transition hover:shadow-xl ${plan.popular
                  ? "border-orange-500 bg-gradient-to-br from-orange-50 to-blue-50"
                  : "border-neutral-200/70 bg-white/80"
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-orange-600 to-blue-900 text-white text-xs font-medium">
                  Recommended
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-neutral-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-neutral-900">{displayPrice}</span>
                  <span className="text-neutral-600 ml-2">/{displayPeriod}</span>
                </div>
                {billingCycle === "yearly" && monthlyPrice > 0 && (
                  <p className="text-sm text-green-600 mt-1 font-medium">Save 15%</p>
                )}
                <p className="text-sm text-neutral-600 mt-2">{plan.verifications}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                    <Icon icon="mdi:check-circle" className="text-green-600 mt-0.5 flex-shrink-0" width={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full text-center px-4 py-3 rounded-xl font-medium transition ${plan.popular
                    ? "bg-gradient-to-r from-orange-600 to-blue-900 text-white hover:shadow-lg"
                    : "border border-neutral-200/70 text-neutral-900 hover:bg-neutral-50"
                  }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-neutral-600 mb-12"
      >
        All plans include secure storage, audit logs, and manual review disclaimer in every report.
      </motion.p>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-neutral-200/70 bg-white/80 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 transition"
              >
                <span className="font-medium text-neutral-900">{faq.q}</span>
                <Icon
                  icon={openFaq === idx ? "mdi:chevron-up" : "mdi:chevron-down"}
                  width={24}
                  className="text-neutral-600"
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-neutral-700">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-16 text-center rounded-2xl border border-neutral-200/70 bg-gradient-to-br from-orange-50 to-blue-50 p-10"
      >
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Still have questions?</h2>
        <p className="text-neutral-700 mb-6">Our team is here to help you choose the right plan for your needs.</p>
        <Link
          href="/contact"
          className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-blue-900 text-white font-medium hover:shadow-lg transition"
        >
          Contact Sales
        </Link>
      </motion.div>
    </div>
  );
}
