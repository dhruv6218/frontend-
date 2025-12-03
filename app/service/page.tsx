"use client";

import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/mock-client";
import { safeWindowOpen } from "@/lib/utils/security";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

const SERVICES = [
  {
    icon: "mdi:file-document-check-outline",
    title: "Compliance Report Service (Manual Verification)",
    description: "Have a complex or high-value vendor? Let our team verify it manually and generate a premium report for you.",
    details: "Human-verified, AI-enhanced compliance report with detailed risk notes.",
    pricing: "₹299 per verification report"
  },
  {
    icon: "mdi:web",
    title: "Website Development",
    description: "Fast, mobile-first websites for CA firms, finance teams, and SaaS businesses.",
    details: "Landing pages, dashboards, or complete sites — we build according to your brief.",
    pricing: "Custom — talk to us"
  },
  {
    icon: "mdi:robot-outline",
    title: "Chatbots & WhatsApp Bots",
    description: "Support, FAQs, lead capture, and onboarding bots for your website or WhatsApp.",
    details: "Trained on your data, available 24/7.",
    pricing: "Custom — talk to us"
  },
  {
    icon: "mdi:brain",
    title: "Custom AI Agents",
    description: "Agents that verify vendors, watch risk signals, or automate internal workflows.",
    details: "We design flows, integrate APIs, and ship ready-to-use agents.",
    pricing: "Custom — talk to us"
  }
];

const STEPS = [
  {
    number: "1",
    title: "Submit a request",
    description: "From the service page (or service dashboard after login)"
  },
  {
    number: "2",
    title: "We confirm scope & timeline",
    description: "On WhatsApp or email"
  },
  {
    number: "3",
    title: "Track status and uploads",
    description: "Wait for your work done"
  }
];

export default function ServicePage() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const handleWhatsAppClick = () => {
    safeWindowOpen("https://wa.me/919034950792", "_blank");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-16">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-blue-900 bg-clip-text text-transparent mb-4">
          Custom AI & Web Services, On Demand
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto mb-8">
          Get vendor reports, websites, chatbots, and AI agents built for your business — and track every order from your service dashboard.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link
              href="/service/orders"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-blue-900 text-white font-medium hover:shadow-lg transition"
            >
              Open Service Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/sign-in"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-blue-900 text-white font-medium hover:shadow-lg transition"
            >
              Request a Service
            </Link>
          )}
          <button
            onClick={handleWhatsAppClick}
            className="px-6 py-3 rounded-full border border-neutral-200/70 bg-white/80 text-neutral-900 font-medium hover:bg-neutral-50 transition flex items-center gap-2"
          >
            <Icon icon="mdi:whatsapp" width={20} className="text-green-600" />
            Talk to us on WhatsApp
          </button>
        </div>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="rounded-2xl border border-neutral-200/70 bg-white/80 p-6 hover:shadow-xl transition"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                  <Icon icon={service.icon} width={24} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{service.title}</h3>
                  <p className="text-neutral-700 text-sm mb-2">{service.description}</p>
                  <p className="text-neutral-600 text-sm italic mb-3">{service.details}</p>
                  <p className="text-orange-600 font-semibold text-sm">{service.pricing}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-8">How Ordering Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {STEPS.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="text-center"
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-600 to-blue-900 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">{step.title}</h3>
              <p className="text-neutral-600 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-sm text-neutral-600 mt-8">
          Replies within 24–72 hours on WhatsApp or email for all new service requests.
        </p>
      </motion.div>

      {/* Contact & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-neutral-200/70 bg-gradient-to-br from-orange-50 to-blue-50 p-10 text-center"
      >
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to get started?</h2>
        <p className="text-neutral-700 mb-6 max-w-2xl mx-auto">
          For manual verification (₹299/report) or custom website/chatbot/agent work, submit a request and our team will respond within 24–72 hours.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <button
            onClick={handleWhatsAppClick}
            className="px-6 py-3 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition flex items-center gap-2"
          >
            <Icon icon="mdi:whatsapp" width={20} />
            Chat on WhatsApp
          </button>
          <a
            href="mailto:info@ravonovendor.co.in"
            className="px-6 py-3 rounded-full border border-neutral-200/70 bg-white text-neutral-900 font-medium hover:bg-neutral-50 transition flex items-center gap-2"
          >
            <Icon icon="mdi:email-outline" width={20} />
            info@ravonovendor.co.in
          </a>
        </div>

        <p className="text-sm text-neutral-600">
          WhatsApp: Service queries only | Email: info@ravonovendor.co.in
        </p>
      </motion.div>
    </div>
  );
}
