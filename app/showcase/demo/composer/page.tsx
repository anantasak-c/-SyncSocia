"use client";

import { useMemo, useState } from "react";
import { Wand2 } from "lucide-react";
import { DemoShell } from "../../_components/demo-shell";
import { composerIdeas, previewTabs } from "../../_data/mock";

const previews: Record<(typeof previewTabs)[number], { title: string; body: string; accent: string }> = {
  facebook: {
    title: "Facebook Preview",
    body: "โปรโมชันสิ้นเดือน ลดแรง พร้อมส่งฟรีวันนี้เท่านั้น กดทักแชตเพื่อรับโค้ดส่วนลดได้เลย",
    accent: "from-blue-600 to-sky-400",
  },
  instagram: {
    title: "Instagram Preview",
    body: "เดือนนี้มีโปรพิเศษสำหรับลูกค้าใหม่ พร้อมคอนเทนต์รีวิวที่ช่วยให้ตัดสินใจง่ายขึ้น #โปรแรง #ร้านแนะนำ",
    accent: "from-pink-500 to-orange-400",
  },
  line: {
    title: "LINE OA Preview",
    body: "สวัสดีค่ะ วันนี้มีโปรพิเศษสำหรับสมาชิกใหม่ กดตอบกลับเพื่อรับรายละเอียดได้เลยค่ะ",
    accent: "from-green-500 to-emerald-400",
  },
  tiktok: {
    title: "TikTok Preview",
    body: "คลิปสั้น 15 วินาที เปิดด้วย hook ชัด ๆ แล้วปิดด้วยคำชวนทักแชตเพื่อปิดการขายไวขึ้น",
    accent: "from-slate-900 to-fuchsia-500",
  },
};

export default function ShowcaseComposerPage() {
  const [selectedTab, setSelectedTab] = useState<(typeof previewTabs)[number]>("facebook");
  const [selectedIdea, setSelectedIdea] = useState(composerIdeas[0]);
  const activePreview = useMemo(() => previews[selectedTab], [selectedTab]);

  return (
    <DemoShell>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Composer Demo</div>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">หน้าเขียนโพสต์ที่เหมือนใช้จริง</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">ลูกค้าสามารถเห็น flow การเขียนคอนเทนต์ เลือกไอเดีย และพรีวิวหลายแพลตฟอร์มได้โดยไม่ต้องเชื่อมระบบจริง</p>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">เลือกไอเดียคอนเทนต์</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {composerIdeas.map((idea) => (
                <button key={idea} onClick={() => setSelectedIdea(idea)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedIdea === idea ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                  {idea}
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
                <Wand2 className="h-4 w-4" /> AI Suggestion (mock)
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                หัวข้อที่เลือกตอนนี้คือ <span className="font-semibold text-slate-900">{selectedIdea}</span> ระบบสามารถช่วยแตกหัวข้อเป็นโพสต์ขาย, โพสต์ให้ความรู้, และโพสต์ชวนทักได้ในคลิกเดียว
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">ข้อความตัวอย่าง</div>
            <div className="mt-4 min-h-52 rounded-3xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-700">
              โปรโมชันสิ้นเดือนสำหรับลูกค้าใหม่ 🎉\n\nลดทันทีเมื่อสั่งวันนี้ พร้อมของแถมและจัดส่งไว\n\nเหมาะสำหรับใช้เป็นคอนเทนต์ขายที่ปิดการสนทนาได้เร็วขึ้น โดยเฉพาะเมื่อใช้คู่กับแชตและรายงานผล
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">เลือกพรีวิวแพลตฟอร์ม</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {previewTabs.map((tab) => (
                <button key={tab} onClick={() => setSelectedTab(tab)} className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${selectedTab === tab ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <div className={`rounded-[24px] bg-gradient-to-br ${activePreview.accent} p-5 text-white`}>
                <div className="text-sm font-semibold">{activePreview.title}</div>
                <div className="mt-4 rounded-3xl bg-white/10 p-4 text-sm leading-7 text-white/90 backdrop-blur">
                  {activePreview.body}
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">เวลานัดโพสต์</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">ศุกร์ 19:00 น.</div>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">เป้าหมาย</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">เพิ่มยอดทักแชตและยอดคลิก</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}
