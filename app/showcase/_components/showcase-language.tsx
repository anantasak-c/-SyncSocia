"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ShowcaseLanguage = "th" | "en";

interface ShowcaseLanguageContextValue {
  language: ShowcaseLanguage;
  setLanguage: (language: ShowcaseLanguage) => void;
  toggleLanguage: () => void;
}

const ShowcaseLanguageContext = createContext<ShowcaseLanguageContextValue | null>(null);

export function ShowcaseLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<ShowcaseLanguage>("th");

  useEffect(() => {
    const stored = window.localStorage.getItem("showcase-language");
    if (stored === "th" || stored === "en") {
      setLanguage(stored);
      return;
    }

    const browserLanguage = window.navigator.language.toLowerCase();
    if (browserLanguage.startsWith("th")) {
      setLanguage("th");
    } else {
      setLanguage("en");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("showcase-language", language);
    document.documentElement.lang = language === "th" ? "th" : "en";
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((prev) => (prev === "th" ? "en" : "th")),
    }),
    [language]
  );

  return <ShowcaseLanguageContext.Provider value={value}>{children}</ShowcaseLanguageContext.Provider>;
}

export function useShowcaseLanguage() {
  const context = useContext(ShowcaseLanguageContext);
  if (!context) {
    throw new Error("useShowcaseLanguage must be used within ShowcaseLanguageProvider");
  }
  return context;
}

export function ShowcaseLanguageToggle() {
  const { language, setLanguage } = useShowcaseLanguage();

  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      <button
        onClick={() => setLanguage("th")}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${language === "th" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"}`}
      >
        TH
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${language === "en" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"}`}
      >
        EN
      </button>
    </div>
  );
}
