"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

const CONTACT_METHODS = [
  {
    icon: "mdi:email-outline",
    title: "General Inquiries",
    value: "ravonoagency06@gmail.com",
    description: "For general questions, issues, and support",
    href: "mailto:ravonoagency06@gmail.com",
    type: "email"
  },
  {
    icon: "mdi:email-check-outline",
    title: "Service Requests",
    value: "info@ravonovendor.co.in",
    description: "For custom services, manual verification, and business inquiries",
    href: "mailto:info@ravonovendor.co.in",
    type: "email"
  },
  {
    icon: "mdi:whatsapp",
    title: "WhatsApp Support",
    value: "Chat with us",
    description: "Quick responses for urgent queries",
    href: "https://wa.me/919034950792",
    type: "whatsapp"
  }
];

const OFFICE_INFO = [
  {
    icon: "mdi:clock-outline",
    title: "Working Hours",
    value: "Monday - Saturday",
    subtitle: "9:00 AM - 7:00 PM IST"
  },
  {
    icon: "mdi:earth",
    title: "Location",
    value: "Remote & Global",
    subtitle: "Serving clients worldwide"
  },
  {
    icon: "mdi:lightning-bolt",
    title: "Response Time",
    value: "24-72 hours",
    subtitle: "For all inquiries"
  }
];

export default function ContactPage() {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/919034950792", "_blank");
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
          Get in Touch
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Have questions? Need support? Want to discuss custom services? We're here to help.
        </p>
      </motion.div>

      {/* Contact Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
      >
        {CONTACT_METHODS.map((method, idx) => (
          <motion.a
            key={method.title}
            href={method.href}
            target={method.type === "whatsapp" ? "_blank" : undefined}
            rel={method.type === "whatsapp" ? "noopener noreferrer" : undefined}
            onClick={method.type === "whatsapp" ? (e) => { e.preventDefault(); handleWhatsAppClick(); } : undefined}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="group rounded-2xl border border-neutral-200/70 bg-white/80 p-6 hover:shadow-xl hover:border-orange-300 transition cursor-pointer"
          >
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-100 to-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Icon
                icon={method.icon}
                width={28}
                className={method.type === "whatsapp" ? "text-green-600" : "text-orange-600"}
              />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">{method.title}</h3>
            <p className={`font-medium mb-2 ${method.type === "whatsapp" ? "text-green-600" : "text-orange-600"}`}>
              {method.value}
            </p>
            <p className="text-sm text-neutral-600">{method.description}</p>
          </motion.a>
        ))}
      </motion.div>

      {/* Office Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
      >
        {OFFICE_INFO.map((info, idx) => (
          <motion.div
            key={info.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="text-center rounded-2xl border border-neutral-200/70 bg-gradient-to-br from-orange-50 to-blue-50 p-6"
          >
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mx-auto mb-4">
              <Icon icon={info.icon} width={24} className="text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">{info.title}</h3>
            <p className="text-lg font-bold text-neutral-900">{info.value}</p>
            <p className="text-sm text-neutral-600 mt-1">{info.subtitle}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-neutral-200/70 bg-gradient-to-br from-orange-50 to-blue-50 p-10 text-center"
      >
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Need Immediate Assistance?</h2>
        <p className="text-neutral-700 mb-6 max-w-2xl mx-auto">
          For urgent queries or quick questions, reach out to us on WhatsApp. We typically respond within a few hours during working hours.
        </p>
        <button
          onClick={handleWhatsAppClick}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 hover:shadow-lg transition"
        >
          <Icon icon="mdi:whatsapp" width={20} />
          Chat on WhatsApp
        </button>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-center"
      >
        <p className="text-sm text-neutral-600">
          We're a remote-first team serving clients globally. All times are in IST (Indian Standard Time).
        </p>
      </motion.div>
    </div>
  );
}
