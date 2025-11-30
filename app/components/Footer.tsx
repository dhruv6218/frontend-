"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useTheme } from "@/app/components/ThemeProvider";

// color tokens available globally via inline styles where needed

export default function Footer() {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const baseBg = theme === "light" ? "bg-white" : "bg-[#0B1220]";
  const baseText = theme === "light" ? "text-[#0F172A]" : "text-white";
  const subText = theme === "light" ? "text-[#475569]" : "text-[#CBD5E1]";
  const borderCol = theme === "light" ? "border-neutral-200/70" : "border-white/10";

  return (
    <footer className={`${baseBg} ${baseText} border-t ${borderCol}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand + Newsletter */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <img
              src="https://storage.googleapis.com/cosmic-project-image-assets/images/8e59d1f8-6b5d-4575-9fe3-4956de864bf4/logo.jpg"
              alt="Ravono Phoenix logo"
              className="h-7 w-7 rounded-md object-contain"
            />
            <p className="text-sm font-medium">Ravono Vendor Compliance</p>
          </div>
          <p className={`text-sm ${subText}`}>Vendor compliance made simple with AI and automation.</p>
          <form className="mt-3 flex items-center gap-2" aria-label="Newsletter signup">
            <input aria-label="Email address" placeholder="Enter your email" className={`text-sm px-3 py-2 rounded-xl border ${borderCol} bg-white/80 w-full`} />
            <button type="submit" className="text-sm px-3 py-2 rounded-xl text-white" style={{ background: `linear-gradient(135deg, #F97316, #1E3A8A)` }} aria-label="Subscribe">
              <span>Subscribe</span>
            </button>
          </form>
          <div className="flex gap-3 pt-2">
            <a
              href="https://www.linkedin.com/in/dhruv-yadav-80b843367"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-neutral-200/60 text-neutral-400 hover:text-orange-500 transition-colors"
            >
              <Icon icon="mdi:linkedin" width={18} />
            </a>
          </div>
        </div>

        {/* Product */}
        <div>
          <p className="text-sm font-medium">Product</p>
          <ul className={`mt-3 space-y-2 text-sm ${subText}`}>
            <li><Link href="/features">Features</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/service">Services</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <p className="text-sm font-medium">Support</p>
          <ul className={`mt-3 space-y-2 text-sm ${subText}`}>
            <Link href="/contact">Support Center</Link>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <p className="text-sm font-medium">Legal</p>
          <ul className={`mt-3 space-y-2 text-sm ${subText}`}>
            <li><Link href="/legal/privacy">Privacy Policy</Link></li>
            <li><Link href="/legal/terms">Terms & Conditions</Link></li>
            <li><Link href="/legal/disclaimer">Disclaimer</Link></li>
            <li><Link href="/legal/cookies">Cookies Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className={`border-t ${borderCol}`}>
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-4 flex items-center justify-between">
          <p className={`text-xs ${subText}`}>© 2025 Ravono Vendor Compliance. All Rights Reserved.</p>
          <p className={`text-xs ${subText}`}>Made for compliance-first teams.</p>
        </div>
      </div>
    </footer>
  );
}
