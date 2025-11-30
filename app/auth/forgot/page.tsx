"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-10 group">
            <img
              src="https://storage.googleapis.com/cosmic-project-image-assets/images/79aa3ba9-d63f-4809-917e-d4732ea12325/pic.jpg"
              alt="Ravono Logo"
              className="h-8 w-8 rounded-md object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-semibold tracking-tight text-slate-900" style={{ fontFamily: "var(--font-geist)" }}>Ravono</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                <Icon icon="solar:key-minimalistic-square-3-bold-duotone" width={24} className="text-orange-600" />
              </div>
              <h1 className="text-3xl font-semibold text-slate-900 mb-2" style={{ fontFamily: "var(--font-geist)" }}>
                Forgot password?
              </h1>
              <p className="text-slate-500">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            {!submitted ? (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    required
                  />
                </div>

                <button
                  disabled={!email || loading}
                  className="w-full py-3.5 rounded-xl text-white font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}
                >
                  {loading ? (
                    <>
                      <Icon icon="line-md:loading-twotone-loop" width={20} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-100 rounded-xl p-6 text-center"
              >
                <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Icon icon="heroicons:check" className="text-green-600" width={24} />
                </div>
                <h3 className="text-green-900 font-medium mb-1">Check your email</h3>
                <p className="text-green-700 text-sm">
                  We sent a password reset link to <span className="font-semibold">{email}</span>
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm text-green-700 hover:text-green-800 font-medium underline"
                >
                  Click to resend
                </button>
              </motion.div>
            )}

            <div className="mt-8 text-center">
              <Link href="/auth/sign-in" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors group">
                <Icon icon="heroicons:arrow-left" width={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Visual Panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900 items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-blue-900/40 mix-blend-overlay" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-lg text-center">
          <div className="mb-8 flex justify-center">
            <div className="h-20 w-20 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl">
              <Icon icon="solar:lock-password-bold-duotone" width={40} className="text-white/80" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-geist)" }}>
            Security First
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            We use enterprise-grade encryption to keep your data and your vendors' data safe and compliant.
          </p>
        </div>
      </div>
    </div>
  );
}
