"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { mockService } from "@/lib/mock/service";
import { safeWindowOpen, sanitizeInput } from "@/lib/utils/security";
import { ToastContainer } from "@/app/components/ui/Toast";
import { isValidEmail } from "@/lib/utils/validation";

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
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: "success" | "error" | "info" | "warning" }>>([]);

  const addToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleWhatsAppClick = () => {
    safeWindowOpen("https://wa.me/919034950792", "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!formData.message.trim()) {
      setError("Message is required");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        message: sanitizeInput(formData.message),
      };
      await mockService.contact.submit(sanitizedData);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError((err as Error).message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
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

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-neutral-200/70 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2 text-center">Send us a Message</h2>
          <p className="text-sm text-neutral-600 mb-6 text-center">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Message</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                placeholder="Tell us how we can help..."
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon icon="mdi:loading" className="animate-spin" width={18} />
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </button>
          </form>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700"
              >
                <Icon icon="mdi:check-circle" width={18} />
                <span>Message sent successfully! We'll get back to you soon.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
