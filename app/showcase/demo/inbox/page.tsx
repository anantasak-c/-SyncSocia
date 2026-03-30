"use client";

import { useState } from "react";
import { DemoShell } from "../../_components/demo-shell";
import { inboxMessages } from "../../_data/mock";

export default function ShowcaseInboxPage() {
  const [selected, setSelected] = useState(inboxMessages[0]);

  return (
    <DemoShell>
      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="rounded-[32px] border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="mb-4 px-2">
            <div className="text-lg font-semibold text-slate-950">กล่องข้อความรวม</div>
            <div className="text-sm text-slate-500">เดโมหน้ารวม inbox หลายช่องทาง</div>
          </div>
          <div className="space-y-3">
            {inboxMessages.map((item) => (
              <button key={item.from + item.channel} onClick={() => setSelected(item)} className={`w-full rounded-3xl border p-4 text-left transition ${selected.from === item.from ? "border-indigo-300 bg-indigo-50" : "border-slate-100 bg-slate-50 hover:bg-white"}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-semibold text-slate-900">{item.from}</div>
                  <div className="text-xs text-slate-400">{item.channel}</div>
                </div>
                <div className="mt-2 text-sm text-slate-600">{item.message}</div>
                <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">{item.tag}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-semibold text-slate-950">บทสนทนาตัวอย่าง</div>
              <div className="mt-1 text-sm text-slate-500">ใช้โชว์ทีมขายว่า SyncSocial รวมข้อความให้ตอบง่ายขึ้น</div>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">ตอบภายใน 5 นาที</div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="ml-auto max-w-md rounded-3xl bg-slate-950 px-5 py-4 text-sm text-white">สวัสดีค่ะ สนใจแพ็กเกจที่ช่วยดูรายงานและรวมข้อความจากหลายช่องทาง</div>
            <div className="max-w-md rounded-3xl bg-slate-100 px-5 py-4 text-sm text-slate-700">{selected.message}</div>
            <div className="ml-auto max-w-md rounded-3xl bg-indigo-600 px-5 py-4 text-sm text-white">ได้เลยครับ แพ็กเกจที่เหมาะคือ Growth เพราะมีทั้ง Analytics และ Inbox รวมในหน้าเดียว</div>
          </div>
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">พิมพ์ข้อความตอบลูกค้า... (preview mode)</div>
        </div>
      </div>
    </DemoShell>
  );
}
