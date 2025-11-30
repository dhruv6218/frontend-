"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "en" | "hi";

type Dict = Record<string, string>;

type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

const loadDict = async (locale: Locale): Promise<Dict> => {
  const res = await fetch(`/locales/${locale}.json`, { cache: "force-cache" });
  try {
    const json = (await res.json()) as Dict;
    return json ?? {};
  } catch {
    return {};
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    return ((localStorage.getItem("rvn_locale") as Locale) || "en");
  });
  const [dict, setDict] = useState<Dict>({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      const d = await loadDict(locale);
      if (mounted) setDict(d);
    })();
    if (typeof window !== "undefined") {
      try { localStorage.setItem("rvn_locale", locale); } catch { /* no-op */ }
      try { document.documentElement.setAttribute("lang", locale); } catch { /* no-op */ }
    }
    return () => { mounted = false; };
  }, [locale]);

  const t = useMemo(() => {
    return (key: string) => dict[key] ?? key;
  }, [dict]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
