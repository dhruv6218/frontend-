"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <img
              src="https://storage.googleapis.com/cosmic-project-image-assets/images/79aa3ba9-d63f-4809-917e-d4732ea12325/pic.jpg"
              alt="Ravono Logo"
              className="h-8 w-8 rounded-md object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-semibold tracking-tight text-slate-900" style={{ fontFamily: "var(--font-geist)" }}>RAVONO</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-6">
              <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                <Icon icon="mdi:lock-reset" width={24} className="text-orange-600" />
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1" style={{ fontFamily: "var(--font-geist)" }}>
                Reset Password
              </h1>
              <p className="text-sm text-slate-500">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {!sent ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!email || loading}
                  className="w-full py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm bg-[#F97316]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Icon icon="mdi:loading" className="animate-spin" width={18} />
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-lg bg-green-50 border border-green-200"
              >
                <div className="flex items-start gap-3">
                  <Icon icon="mdi:check-circle" width={24} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-green-900 mb-1">Check your email</h3>
                    <p className="text-sm text-green-700">
                      We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSent(false);
                    setEmail("");
                  }}
                  className="mt-4 w-full px-4 py-2 rounded-lg border border-green-200 bg-white text-green-700 text-sm font-medium hover:bg-green-50 transition"
                >
                  Try Another Email
                </button>
              </motion.div>
            )}

            <div className="mt-6 text-center">
              <Link href="/auth/sign-in" className="text-xs font-medium text-slate-500 hover:text-slate-800 underline decoration-slate-300 hover:decoration-slate-500 transition-all">
                ← Back to Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Visual Panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-orange-50 to-blue-50 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <img
              src="https://storage.googleapis.com/cosmic-project-image-assets/images/79aa3ba9-d63f-4809-917e-d4732ea12325/pic.jpg"
              alt="Ravono Logo"
              className="h-8 w-8 rounded-md object-contain"
            />
            <span className="text-lg font-semibold text-slate-900" style={{ fontFamily: "var(--font-geist)" }}>Ravono Vendor Compliance</span>
          </div>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-0.5">•</span>
              <span>Secure password reset process</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-0.5">•</span>
              <span>Reset links expire after 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-0.5">•</span>
              <span>Check your email for instructions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

