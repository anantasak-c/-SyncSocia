"use client";

import Link from "next/link";
import { BarChart3, CalendarDays, FileText, Home, MessageCircle, PenSquare } from "lucide-react";
import { ShowcaseLanguageToggle, useShowcaseLanguage } from "./showcase-language";

export function DemoShell({ children }: { children: React.ReactNode }) {
  const { language } = useShowcaseLanguage();
  const items = [
    { href: "/showcase/demo", label: language === "th" ? "ภาพรวม" : "Overview", icon: Home },
    { href: "/showcase/demo/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/showcase/demo/composer", label: language === "th" ? "เขียนโพสต์" : "Composer", icon: PenSquare },
    { href: "/showcase/demo/calendar", label: language === "th" ? "ปฏิทิน" : "Calendar", icon: CalendarDays },
    { href: "/showcase/demo/inbox", label: "Inbox", icon: MessageCircle },
    { href: "/showcase/demo/reports", label: language === "th" ? "รายงาน" : "Reports", icon: FileText },
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
      <aside className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-xl">
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-800 p-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">{language === "th" ? "Showcase Workspace" : "Showcase Workspace"}</div>
              <div className="mt-1 text-xs text-white/70">{language === "th" ? "Preview mode • ไม่มีการเชื่อมต่อจริง" : "Preview mode • no live integrations"}</div>
            </div>
            <ShowcaseLanguageToggle />
          </div>
        </div>
        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
