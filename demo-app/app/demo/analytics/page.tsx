import { AreaChartCard, BarChartCard, LineChartCard } from "../../_components/charts";
import { platformRows, topPosts } from "../../_data/mock";

export default function AnalyticsPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Analytics Showcase</div>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">หน้ารายงานแบบ standalone demo</h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">ใช้ mock data ทั้งหมด เหมาะสำหรับโชว์ลูกค้าโดยไม่ต้องเชื่อมระบบจริง</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <BarChartCard />
        <AreaChartCard />
      </div>
      <LineChartCard />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="text-lg font-semibold text-slate-950">เปรียบเทียบแต่ละแพลตฟอร์ม</div>
          <div className="mt-6 space-y-4">
            {platformRows.map((item) => (
              <div key={item.name} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.posts} โพสต์ • Reach {item.reach}</div>
                  </div>
                  <div className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: item.color }}>{item.engagement}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="text-lg font-semibold text-slate-950">โพสต์เด่นของเดือน</div>
          <div className="mt-6 space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.title} className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">#{index + 1} {post.title}</div>
                    <div className="mt-2 text-xs text-slate-500">Reach {post.reach}</div>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">{post.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
