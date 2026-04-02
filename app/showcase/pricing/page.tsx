"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { plans } from "../_data/mock";
import { useShowcaseLanguage } from "../_components/showcase-language";

export default function ShowcasePricingPage() {
  const { language } = useShowcaseLanguage();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="max-w-3xl">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">{language === "th" ? "Pricing Preview" : "Pricing Preview"}</div>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">{language === "th" ? "แพ็กเกจที่ใช้คุยขายได้ทันที" : "Plans you can use in sales conversations immediately"}</h1>
        <p className="mt-4 text-lg text-slate-600">{language === "th" ? "หน้านี้ออกแบบมาเพื่อใช้โชว์แพ็กเกจและเปรียบเทียบความคุ้มค่าให้ลูกค้าเห็นอย่างชัดเจน" : "This page is designed to present plans clearly and compare value side by side for prospects."}</p>
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className={`rounded-[32px] border p-7 shadow-sm ${plan.highlight ? "border-indigo-300 bg-gradient-to-b from-indigo-50 to-white shadow-indigo-100" : "border-slate-200 bg-white/90"}`}>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-slate-900">{plan.name}</div>
              {plan.highlight && <div className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">{language === "th" ? "ขายง่ายสุด" : "Best for sales"}</div>}
            </div>
            <div className="mt-5 text-5xl font-bold text-slate-950">{plan.price}</div>
            <div className="mt-2 text-sm text-slate-500">{plan.description}</div>
            <ul className="mt-8 space-y-4 text-sm text-slate-700">
              {plan.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/showcase/demo" className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${plan.highlight ? "bg-slate-950 text-white hover:bg-slate-800" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
              {language === "th" ? "ดูแพ็กเกจนี้ในระบบ" : "View this plan in the product"}
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
