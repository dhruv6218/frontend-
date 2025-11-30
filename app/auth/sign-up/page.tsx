"use client";

import React, { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/mock-client";
import Link from "next/link";
import { useI18n } from "@/app/components/i18n/LanguageProvider";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function SignUpPage() {
  const { login, loading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid || !agree) return;
    await login("admin@example.com");
    // Small delay to ensure state is set
    await new Promise(resolve => setTimeout(resolve, 200));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative overflow-y-auto">
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
                <img
                  src="https://storage.googleapis.com/cosmic-project-image-assets/images/79aa3ba9-d63f-4809-917e-d4732ea12325/pic.jpg"
                  alt="Ravono Icon"
                  className="h-6 w-6 object-contain"
                />
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1" style={{ fontFamily: "var(--font-geist)" }}>
                Start free
              </h1>
              <p className="text-sm text-slate-500">
                Get 3 free verifications each month. No card required.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Company</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                  required
                  minLength={8}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="w-3.5 h-3.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                <span className="text-xs text-slate-600 group-hover:text-slate-800 transition-colors">I agree to the terms</span>
              </label>

              <button
                disabled={!emailValid || password.length < 8 || !agree || loading}
                className="w-full py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm bg-[#F97316]"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all text-sm"
              >
                <Icon icon="logos:google-icon" width={18} />
                <span>Continue with Google</span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">
                Already have an account? <Link href="/auth/sign-in" className="font-medium text-slate-700 hover:text-slate-900 underline decoration-slate-300 hover:decoration-slate-500 transition-all">Sign in</Link>
              </p>
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
              className="h-10 w-10 rounded-md object-contain shadow-sm"
            />
            <span className="text-lg font-semibold text-slate-900" style={{ fontFamily: "var(--font-geist)" }}>Ravono Vendor Compliance</span>
          </div>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-0.5">•</span>
              <span>One-click vendor verifications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-0.5">•</span>
              <span>Automated compliance reports</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-0.5">•</span>
              <span>Secure document storage</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-0.5">•</span>
              <span>Team collaboration tools</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
