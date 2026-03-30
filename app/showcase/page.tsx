import Link from "next/link";
import { ArrowRight, BarChart3, CalendarDays, Layers3, MessageSquare, PenSquare, Sparkles } from "lucide-react";
import { featureCards, plans, showcaseStats } from "./_data/mock";

export default function ShowcaseHomePage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
              <Sparkles className="h-4 w-4" /> Showcase Website • ไม่มี API • ไม่ต้องล็อกอิน
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              เว็บ Preview สำหรับ
              <span className="block bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">โชว์ลูกค้าได้เหมือนระบบจริง</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              ใช้พรีเซนต์สินค้า, คุยราคา, เดโม dashboard, analytics, calendar, inbox และ reports ได้ทันที
              โดยทั้งหมดเป็น mock data ที่ออกแบบมาให้กดเล่นได้เหมือน SaaS จริงมากที่สุด
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/showcase/demo" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                ลองเดโมระบบ <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/showcase/pricing" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                ดูแพ็กเกจราคา
              </Link>
            </div>
          </div>
          <div className="rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-2xl shadow-indigo-100 backdrop-blur-xl">
            <div className="rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-900 to-sky-700 p-6 text-white">
              <div className="text-sm font-medium text-white/70">Preview Dashboard Snapshot</div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {showcaseStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <div className="text-xs text-white/70">{stat.label}</div>
                    <div className="mt-2 text-2xl font-bold">{stat.value}</div>
                    <div className="mt-1 text-xs text-emerald-300">{stat.delta}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <div className="text-lg font-semibold text-slate-900">{item.title}</div>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Preview Modules</div>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">ทุกหน้าพร้อมใช้โชว์งานขาย</h2>
            <p className="mt-3 text-slate-600">กดเข้าแต่ละหน้าเพื่อพรีเซนต์ flow ได้เหมือนใช้ระบบจริง โดยไม่ต้องผูก backend หรือ social account</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              { title: "Analytics", icon: BarChart3, href: "/showcase/demo/analytics" },
              { title: "Composer", icon: PenSquare, href: "/showcase/demo/composer" },
              { title: "Calendar", icon: CalendarDays, href: "/showcase/demo/calendar" },
              { title: "Inbox", icon: MessageSquare, href: "/showcase/demo/inbox" },
              { title: "Reports", icon: Layers3, href: "/showcase/demo/reports" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.title} href={item.href} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-400 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-lg font-semibold text-slate-900">{item.title}</div>
                  <div className="mt-1 text-sm text-slate-500">mock flow พร้อมใช้งานสำหรับโชว์ลูกค้า</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-3xl border p-6 shadow-sm ${plan.highlight ? "border-indigo-300 bg-gradient-to-b from-indigo-50 to-white" : "border-slate-200 bg-white/90"}`}>
              <div className="text-sm font-semibold text-slate-900">{plan.name}</div>
              <div className="mt-3 text-4xl font-bold text-slate-950">{plan.price}<span className="text-base font-medium text-slate-400">/เดือน</span></div>
              <p className="mt-3 text-sm text-slate-600">{plan.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
