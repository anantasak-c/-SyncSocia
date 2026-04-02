"use client";

import { AnalyticsDashboard } from "../../../components/AnalyticsDashboard";
import { DemoShell } from "../../_components/demo-shell";
import { useShowcaseLanguage } from "../../_components/showcase-language";

export default function ShowcaseAnalyticsPage() {
  const { language } = useShowcaseLanguage();

  return (
    <DemoShell>
      <div className="space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Analytics</div>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">{language === "th" ? "หน้ารายงานที่ใช้ขายได้เลย" : "An analytics page you can use in sales conversations"}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{language === "th" ? "โชว์ลูกค้าได้ทันทีว่าระบบจะช่วยสรุปผลลัพธ์ แยกตามแพลตฟอร์ม และบอกแนวโน้มที่อ่านง่ายสำหรับการตัดสินใจ" : "Show prospects how the product summarizes results, compares channels, and highlights trends in a format that is easy to act on."}</p>
        </div>

        <AnalyticsDashboard showcaseMode={true} showcaseExpanded={true} />
      </div>
    </DemoShell>
  );
}
