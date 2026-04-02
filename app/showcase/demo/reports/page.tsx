"use client";

import { DemoShell } from "../../_components/demo-shell";
import { reportSections } from "../../_data/mock";
import { useShowcaseLanguage } from "../../_components/showcase-language";

export default function ShowcaseReportsPage() {
  const { language } = useShowcaseLanguage();
  return (
    <DemoShell>
      <div className="space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">{language === "th" ? "Executive Reports" : "Executive Reports"}</div>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">{language === "th" ? "รายงานพร้อมประชุม พร้อมพรีเซนต์" : "Reports ready for meetings and presentations"}</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">{language === "th" ? "ออกแบบสำหรับใช้สรุปให้เจ้าของธุรกิจหรือทีมผู้บริหารเห็นภาพรวมและข้อเสนอแนะในไม่กี่นาที" : "Designed to summarize the big picture and recommendations for business owners or executives in minutes."}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {reportSections.map((section) => (
            <div key={section.title} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <div className="text-sm text-slate-500">{section.title}</div>
              <div className="mt-3 text-xl font-semibold leading-8 text-slate-950">{section.value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="text-lg font-semibold text-slate-950">{language === "th" ? "รูปแบบรายงานที่ลูกค้าจะเห็น" : "Report layouts customers will see"}</div>
          <div className="mt-2 text-sm text-slate-500">{language === "th" ? "มีทั้งสรุปผู้บริหาร, สรุปช่องทาง, และข้อเสนอแนะที่นำไปใช้ต่อได้" : "Includes executive summaries, channel breakdowns, and actionable recommendations."}</div>
          <div className="mt-6 rounded-[28px] border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <div className="text-sm font-semibold text-slate-900">{language === "th" ? "Executive Summary" : "Executive Summary"}</div>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li>{language === "th" ? "ยอด Reach รวมเติบโตต่อเนื่อง" : "Total reach is growing steadily"}</li>
                  <li>{language === "th" ? "TikTok เป็นช่องทางที่มี Engagement สูงสุด" : "TikTok is the top engagement channel"}</li>
                  <li>{language === "th" ? "โพสต์ช่วงค่ำให้ผลดีกว่าช่วงบ่ายอย่างชัดเจน" : "Evening posts clearly outperform afternoon posts"}</li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">{language === "th" ? "Recommended Actions" : "Recommended Actions"}</div>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li>{language === "th" ? "เพิ่มงบคอนเทนต์วิดีโอสั้น" : "Increase short-form video budget"}</li>
                  <li>{language === "th" ? "ทดสอบโปรโมชันใน LINE OA เพิ่ม" : "Test more promotions on LINE OA"}</li>
                  <li>{language === "th" ? "ใช้โพสต์รีวิวลูกค้าในแคมเปญถัดไป" : "Use customer review posts in the next campaign"}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}
