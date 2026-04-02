"use client";

import { useState } from "react";
import { DemoShell } from "../../_components/demo-shell";
import { calendarDays } from "../../_data/mock";
import { useShowcaseLanguage } from "../../_components/showcase-language";

export default function ShowcaseCalendarPage() {
  const { language } = useShowcaseLanguage();
  const filters = language === "th" ? ["ทั้งหมด", "โพสต์แล้ว", "รอตรวจ", "วางคิว"] : ["All", "Published", "Review", "Queued"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  return (
    <DemoShell>
      <div className="space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Calendar</div>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">{language === "th" ? "วางแผนคอนเทนต์แบบดูภาพรวมง่าย" : "Plan content with a clean monthly overview"}</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">{language === "th" ? "หน้าปฏิทินนี้เหมาะใช้โชว์ให้เห็นว่าทีมสามารถดูโพสต์ทั้งเดือนและรู้คิวงานทันที" : "This calendar view helps prospects see how teams can manage the entire month and understand the publishing queue instantly."}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeFilter === filter ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
          {calendarDays.map((day) => (
            <div key={`${day.day}-${day.date}`} className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-800">{day.day}</div>
                <div className="text-xs text-slate-400">{day.date}</div>
              </div>
              <div className="mt-4 space-y-2">
                {Array.from({ length: day.items }).map((_, index) => (
                  <div key={index} className="rounded-2xl bg-gradient-to-r from-indigo-50 to-sky-50 px-3 py-2 text-xs font-medium text-slate-700">
                    {language === "th" ? `คอนเทนต์ #${index + 1}` : `Content #${index + 1}`}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}
