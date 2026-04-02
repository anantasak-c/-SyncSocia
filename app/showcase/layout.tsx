import type { Metadata } from "next";
import { ShowcaseLanguageProvider } from "./_components/showcase-language";

export const metadata: Metadata = {
  title: "SyncSocial Showcase",
  description: "เว็บ Preview สำหรับโชว์เดโม SyncSocial แบบไม่ต้องล็อกอิน",
};

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return <ShowcaseLanguageProvider>{children}</ShowcaseLanguageProvider>;
}
