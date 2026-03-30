import { DemoShell } from "../../_components/demo-shell";
import { reportSections } from "../../_data/mock";

export default function ShowcaseReportsPage() {
  return (
    <DemoShell>
      <div className="space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Executive Reports</div>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">รายงานพร้อมประชุม พร้อมพรีเซนต์</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">ออกแบบสำหรับใช้สรุปให้เจ้าของธุรกิจหรือทีมผู้บริหารเห็นภาพรวมและข้อเสนอแนะในไม่กี่นาที</p>
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
          <div className="text-lg font-semibold text-slate-950">รูปแบบรายงานที่ลูกค้าจะเห็น</div>
          <div className="mt-2 text-sm text-slate-500">มีทั้งสรุปผู้บริหาร, สรุปช่องทาง, และข้อเสนอแนะที่นำไปใช้ต่อได้</div>
          <div className="mt-6 rounded-[28px] border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <div className="text-sm font-semibold text-slate-900">Executive Summary</div>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li>ยอด Reach รวมเติบโตต่อเนื่อง</li>
                  <li>TikTok เป็นช่องทางที่มี Engagement สูงสุด</li>
                  <li>โพสต์ช่วงค่ำให้ผลดีกว่าช่วงบ่ายอย่างชัดเจน</li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Recommended Actions</div>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li>เพิ่มงบคอนเทนต์วิดีโอสั้น</li>
                  <li>ทดสอบโปรโมชันใน LINE OA เพิ่ม</li>
                  <li>ใช้โพสต์รีวิวลูกค้าในแคมเปญถัดไป</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}
