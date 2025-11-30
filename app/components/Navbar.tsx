"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import PillNav from "@/app/components/PillNav";
import { useAuth } from "@/lib/auth/mock-client";
import { useI18n } from "@/app/components/i18n/LanguageProvider";
import LanguageSwitcher from "@/app/components/i18n/LanguageSwitcher";

const ORANGE = "#F97316"; // primary
const NAVY = "#1E3A8A"; // secondary

function useOutsideClick(ref: React.RefObject<HTMLDivElement>, onClose: () => void) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClose]);
}

type DropdownItem = { label: string; href: string };

function Dropdown({ label, items }: { label: string; items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-2 py-2 text-sm hover:opacity-80 transition"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span>{label}</span>
        <Icon icon="mdi:chevron-down" width={18} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.2, 0.9, 0.35, 1] }}
            className="absolute left-0 mt-2 w-64 rounded-xl border border-neutral-200/70 backdrop-blur bg-white/80 shadow-lg overflow-hidden"
            role="menu"
          >
            <ul className="py-2">
              {items.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className="block px-4 py-2 text-sm hover:bg-neutral-50"
                    onClick={() => setOpen(false)}
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { t } = useI18n();

  return (
    <div className={cn("sticky top-0 z-50 backdrop-blur border-b bg-white/85 border-neutral-200/70")}>
      <nav className={cn("mx-auto max-w-7xl px-4 md:px-6 text-[#0F172A]")}>
        {/* Balanced layout: equal space for left brand, center links, right actions */}
        <div className="h-14 flex items-center gap-2 sm:gap-3">
          {/* Left: Brand */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Link href="/" className="flex items-center gap-2" aria-label="Ravono home">
              <img
                src="https://storage.googleapis.com/cosmic-project-image-assets/images/8e59d1f8-6b5d-4575-9fe3-4956de864bf4/logo.jpg"
                alt="Ravono Phoenix emblem"
                className="h-7 w-7 rounded-md object-contain"
              />
              <span className="text-sm font-medium">RAVONO</span>
            </Link>
          </div>

          {/* Center: Main nav */}
          <div className="hidden md:flex items-center justify-center gap-2 sm:gap-3 flex-1 min-w-0">
            <PillNav
              items={[
                { label: t("nav.home"), href: "/" },
                { label: t("nav.features"), href: "/features" },
                { label: t("nav.pricing"), href: "/pricing" },
                { label: t("nav.about"), href: "/about" },
                { label: t("nav.service"), href: "/service" },
                { label: "Suggestions", href: "/suggestions" },
                { label: t("nav.contact"), href: "/contact" },
              ]}
              className=""
              baseColor="#0F172A"
              pillColor="rgba(249,115,22,0.16)"
              hoveredPillTextColor="#0F172A"
              pillTextColor="#0F172A"
            />

            <Link href="/testimonials" className="px-2 py-2 text-sm hover:opacity-80 transition">
              <span>Testimonials</span>
            </Link>
            <Dropdown
              label={t("nav.legal")}
              items={[
                { label: t("nav.privacy"), href: "/legal/privacy" },
                { label: t("nav.terms"), href: "/legal/terms" },
                { label: t("nav.cookies"), href: "/legal/cookies" },
                { label: t("nav.disclaimer"), href: "/legal/disclaimer" }
              ]}
            />
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center justify-end gap-2 sm:gap-3 flex-1 min-w-0">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="text-sm px-3 py-2 rounded-full border border-neutral-200/70 hover:-translate-y-0.5 transition bg-white text-[#0F172A]"
                aria-label="Go to dashboard"
              >
                <span>{t("nav.dashboard")}</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  className="text-sm px-3 py-2 rounded-full border border-neutral-200/70 hover:-translate-y-0.5 transition bg-white text-[#0F172A]"
                  aria-label="Sign In"
                >
                  <span>{t("nav.signin")}</span>
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="text-sm px-3 py-2 rounded-full text-white"
                  style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}
                  aria-label="Start Free"
                >
                  <span>{t("nav.startFree")}</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="ml-auto md:hidden">
            <button className="p-2" aria-label="Open menu" onClick={() => setMobileOpen((o) => !o)}>
              <Icon icon={mobileOpen ? "mdi:close" : "mdi:menu"} width={22} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.9, 0.35, 1] }}
            className={cn("md:hidden overflow-hidden border-t border-neutral-200/70 bg-white/85")}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              <Link href="/" className="px-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link href="/features" className="px-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>Features</Link>
              <Link href="/pricing" className="px-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>Pricing</Link>
              <Link href="/service" className="px-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>Service</Link>
              <Link href="/suggestions" className="px-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>Suggestions</Link>
              <Link href="/contact" className="px-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>Contact</Link>
              <Link href="/about" className="px-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>About</Link>
              <Link href="/testimonials" className="px-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>Testimonials</Link>
              <div className="h-px my-2 w-full bg-neutral-200" />
              <div className="px-2 py-2">
                <LanguageSwitcher />
              </div>
              <Link href="/legal/privacy" className="px-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>Privacy Policy</Link>
              <Link href="/legal/terms" className="px-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>Terms & Conditions</Link>
              <Link href="/legal/cookies" className="px-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>Cookies Policy</Link>
              <Link href="/legal/disclaimer" className="px-2 py-2 text-sm" onClick={() => setMobileOpen(false)}>Disclaimer</Link>
              <div className="flex items-center justify-between pt-3">
                <div className="flex gap-2 ml-auto">
                  {isAuthenticated ? (
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm px-3 py-2 rounded-full border border-neutral-200/70 bg-white text-[#0F172A]">Dashboard</Link>
                  ) : (
                    <>
                      <Link href="/auth/sign-in" onClick={() => setMobileOpen(false)} className="text-sm px-3 py-2 rounded-full border border-neutral-200/70 bg-white text-[#0F172A]">{t("nav.signin")}</Link>
                      <Link href="/auth/sign-up" onClick={() => setMobileOpen(false)} className="text-sm px-3 py-2 rounded-full text-white" style={{ background: `linear-gradient(135deg, ${ORANGE}, ${NAVY})` }}>{t("nav.startFree")}</Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
