import type { Metadata } from "next";
import { ShowcaseShell } from "./_components/showcase-shell";

export const metadata: Metadata = {
  title: "SyncSocial Showcase",
  description: "เว็บ Preview สำหรับโชว์เดโม SyncSocial แบบไม่ต้องล็อกอิน",
};

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return <ShowcaseShell>{children}</ShowcaseShell>;
}
