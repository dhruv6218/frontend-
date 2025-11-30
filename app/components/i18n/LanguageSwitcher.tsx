"use client";

import React from "react";
import { useI18n } from "@/app/components/i18n/LanguageProvider";

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const toggle = () => setLocale(locale === "en" ? "hi" : "en");
  return (
    <button
      onClick={toggle}
      className={"text-xs px-2 py-1 rounded-full border border-neutral-200/70 bg-white/80 " + (className || "")}
      aria-label="Toggle language"
      title={locale === "en" ? "Switch to Hindi" : "Switch to English"}
    >
      <span>{locale.toUpperCase()}</span>
    </button>
  );
}
