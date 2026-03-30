import { ArrowUpRight, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import { DemoShell } from "../_components/demo-shell";
import { activities, onboarding, showcaseStats } from "../_data/mock";

export default function ShowcaseDemoDashboardPage() {
  return (
    <DemoShell>
      <div className="space-y-6">
        <section className="rounded-[32px] bg-gradient-to-br from-slate-950 via-indigo-900 to-sky-700 p-6 text-white shadow-2xl shadow-indigo-100">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/80">
                <Sparkles className="h-4 w-4" /> Demo Workspace
              </div>
              <h1 className="mt-4 text-3xl font-bold">ภาพรวมระบบสำหรับโชว์ลูกค้า</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/75">นี่คือ dashboard เริ่มต้นที่ทำให้ลูกค้าเห็นภาพว่า SyncSocial ช่วยจัดการคอนเทนต์ วัดผล และดูภาพรวมธุรกิจได้อย่างไร</p>
            </div>
            <div className="rounded-3xl bg-white/10 px-5 py-4 backdrop-blur">
              <div className="text-xs text-white/70">สถานะ workspace</div>
              <div className="mt-1 text-lg font-semibold">พร้อมใช้งานสำหรับพรีเซนต์</div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {showcaseStats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <div className="text-sm text-slate-500">{stat.label}</div>
              <div className="mt-3 text-3xl font-bold text-slate-950">{stat.value}</div>
              <div className="mt-2 text-xs font-medium text-emerald-600">{stat.delta}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-slate-950">แผนเริ่มต้นใช้งาน</div>
                <div className="text-sm text-slate-500">เหมาะใช้คุยกับลูกค้าว่าระบบจะเริ่มงานอย่างไร</div>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">4 ขั้นตอน</div>
            </div>
            <div className="mt-6 space-y-4">
              {onboarding.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">{index + 1}</div>
                  <div className="flex-1 text-sm font-medium text-slate-700">{item}</div>
                  <ArrowUpRight className="h-4 w-4 text-slate-300" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="text-lg font-semibold text-slate-950">กิจกรรมล่าสุด</div>
            <div className="mt-2 text-sm text-slate-500">ตัวอย่างสถานะที่ลูกค้าจะเห็นในระบบ</div>
            <div className="mt-6 space-y-4">
              {activities.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    {item.status === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Clock3 className="h-5 w-5 text-amber-500" />}
                    <div className="text-sm font-medium text-slate-800">{item.title}</div>
                  </div>
                  <div className="mt-2 text-xs text-slate-400">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DemoShell>
  );
}
