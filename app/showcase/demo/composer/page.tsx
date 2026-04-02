"use client";

import { useMemo, useState } from "react";
import { Wand2 } from "lucide-react";
import { DemoShell } from "../../_components/demo-shell";
import { composerIdeas, previewTabs } from "../../_data/mock";
import { useShowcaseLanguage } from "../../_components/showcase-language";

const previews: Record<(typeof previewTabs)[number], { title: Record<"th" | "en", string>; body: Record<"th" | "en", string>; accent: string }> = {
  facebook: {
    title: { th: "Facebook Preview", en: "Facebook Preview" },
    body: { 
      th: "โปรโมชันสิ้นเดือน ลดแรง พร้อมส่งฟรีวันนี้เท่านั้น กดทักแชตเพื่อรับโค้ดส่วนลดได้เลย",
      en: "End-of-month promotion with strong discounts and free shipping today only. Tap to message for discount codes."
    },
    accent: "from-blue-600 to-sky-400",
  },
  instagram: {
    title: { th: "Instagram Preview", en: "Instagram Preview" },
    body: { 
      th: "เดือนนี้มีโปรพิเศษสำหรับลูกค้าใหม่ พร้อมคอนเทนต์รีวิวที่ช่วยให้ตัดสินใจง่ายขึ้น #โปรแรง #ร้านแนะนำ",
      en: "Special promotion this month for new customers, plus review content to make decisions easier."
    },
    accent: "from-pink-500 to-orange-400",
  },
  line: {
    title: { th: "LINE OA Preview", en: "LINE OA Preview" },
    body: { 
      th: "สวัสดีค่ะ วันนี้มีโปรพิเศษสำหรับสมาชิกใหม่ กดตอบกลับเพื่อรับรายละเอียดได้เลยค่ะ",
      en: "Hello! Today's special offer for new members. Reply to receive details."
    },
    accent: "from-green-500 to-emerald-400",
  },
  tiktok: {
    title: { th: "TikTok Preview", en: "TikTok Preview" },
    body: { 
      th: "คลิปสั้น 15 วินาที เปิดด้วย hook ชัด ๆ แล้วปิดด้วยคำชวนทักแชตเพื่อปิดการขายไวขึ้น",
      en: "15-second short video that opens with a clear hook and ends with a strong call-to-action to close sales faster."
    },
    accent: "from-slate-900 to-fuchsia-500",
  },
};

export default function ShowcaseComposerPage() {
  const { language } = useShowcaseLanguage();
  const [selectedTab, setSelectedTab] = useState<(typeof previewTabs)[number]>("facebook");
  const [selectedIdea, setSelectedIdea] = useState(composerIdeas[0]);
  const activePreview = useMemo(() => previews[selectedTab], [selectedTab]);

  return (
    <DemoShell>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Composer</div>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">{language === "th" ? "หน้าเขียนโพสต์ที่เหมือนใช้จริง" : "Realistic post composer"}</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">{language === "th" ? "ลูกค้าสามารถเห็น flow การเขียนคอนเทนต์ เลือกไอเดีย และพรีวิวหลายแพลตฟอร์มได้โดยไม่ต้องเชื่อมระบบจริง" : "Prospects can see the content writing flow, choose ideas, and preview across multiple platforms without live integrations."}</p>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">{language === "th" ? "เลือกไอเดียคอนเทนต์" : "Choose a content idea"}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {composerIdeas.map((idea) => (
                <button key={idea} onClick={() => setSelectedIdea(idea)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedIdea === idea ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                  {idea}
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
                <Wand2 className="h-4 w-4" /> {language === "th" ? "AI Suggestion (mock)" : "AI Suggestion (preview)"}
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {language === "th" ? <>หัวข้อที่เลือกตอนนี้คือ <span className="font-semibold text-slate-900">{selectedIdea}</span> ระบบสามารถช่วยแตกหัวข้อเป็นโพสต์ขาย, โพสต์ให้ความรู้, และโพสต์ชวนทักได้ในคลิกเดียว</> : <>You have selected <span className="font-semibold text-slate-900">{selectedIdea}</span>. The system can expand this into sales posts, educational posts, and engagement posts in a single click.</>}
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">{language === "th" ? "ข้อความตัวอย่าง" : "Example message"}</div>
            <div className="mt-4 min-h-52 rounded-3xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-700 whitespace-pre-line">
              {language === "th" 
                ? "โปรโมชันสิ้นเดือนสำหรับลูกค้าใหม่ 🎉\n\nลดทันทีเมื่อสั่งวันนี้ พร้อมของแถมและจัดส่งไว\n\nเหมาะสำหรับใช้เป็นคอนเทนต์ขายที่ปิดการสนทนาได้เร็วขึ้น โดยเฉพาะเมื่อใช้คู่กับแชตและรายงานผล"
                : "End-of-month promotion for new customers 🎉\n\nGet instant discounts when you order today, plus free gifts and fast shipping.\n\nPerfect as sales content that closes conversations faster, especially when combined with chat and reports."}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">{language === "th" ? "เลือกพรีวิวแพลตฟอร์ม" : "Select platform preview"}</div>
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
                <div className="text-sm font-semibold">{activePreview.title[language]}</div>
                <div className="mt-4 rounded-3xl bg-white/10 p-4 text-sm leading-7 text-white/90 backdrop-blur">
                  {activePreview.body[language]}
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">{language === "th" ? "เวลานัดโพสต์" : "Scheduled time"}</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{language === "th" ? "ศุกร์ 19:00 น." : "Fri 19:00"}</div>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">{language === "th" ? "เป้าหมาย" : "Goal"}</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{language === "th" ? "เพิ่มยอดทักแชตและยอดคลิก" : "Boost messages and clicks"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}
