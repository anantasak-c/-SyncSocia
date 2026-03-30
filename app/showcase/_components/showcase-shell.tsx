import Link from "next/link";
import { BarChart3, LayoutDashboard, MessageSquare, Sparkles } from "lucide-react";

export function ShowcaseShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/showcase" className="flex items-center gap-3 font-semibold text-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-400 text-white shadow-lg shadow-indigo-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm">SyncSocial Preview</div>
              <div className="text-xs font-normal text-slate-500">เว็บโชว์เคสแบบไม่ต้องล็อกอิน</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink href="/showcase">หน้าแรก</NavLink>
            <NavLink href="/showcase/pricing">ราคา</NavLink>
            <NavLink href="/showcase/demo">เดโมระบบ</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/showcase/pricing" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">ดูแพ็กเกจ</Link>
            <Link href="/showcase/demo" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">ลองเดโม</Link>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-slate-200 bg-white/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>SyncSocial Showcase ใช้ mock data ล้วน เหมาะสำหรับใช้พรีเซนต์หรือทดลองขาย</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Dashboard</div>
            <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Analytics</div>
            <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Inbox</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
      {children}
    </Link>
  );
}
