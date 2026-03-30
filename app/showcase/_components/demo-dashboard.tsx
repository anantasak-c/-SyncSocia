"use client";

import Image, { StaticImageData } from "next/image";
import { useMemo, useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Link2,
  CheckCircle2,
  Loader2,
  Sparkles,
  Eye,
  MessageCircle,
  Clock,
  History,
  Send,
  Image as ImageIcon,
  Trash2,
  Zap,
  BarChart3,
} from "lucide-react";
import { PostPreview } from "../../components/PostPreview";
import lineLogo from "../../../Logo/LINE_logo.svg.png";
import telegramLogo from "../../../Logo/telegram logo.webp";
import tiktokLogo from "../../../Logo/tiktok logo.png";
import youtubeLogo from "../../../Logo/youtube logo.png";
import productMockupMain from "../../../Mock-up Product/product-mockup.jpg";
import productMockupAlt from "../../../Mock-up Product/product-mockup (3).jpg";
import productMockupBottle from "../../../Mock-up Product/product-mockup (4).jpg";

interface Account {
  _id: string;
  platform: string;
  username: string;
  displayName: string;
  isActive: boolean;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

interface MediaItem {
  type: "image" | "video";
  url: string;
}

interface PostHistory {
  id: string;
  content: string;
  media_urls: string[];
  platforms: string[];
  status: string;
  created_at: string;
}

function ImagePlatformIcon({ src, alt, className }: { src: StaticImageData; alt: string; className?: string }) {
  const sizeClass = className?.match(/w-(\d+)|h-(\d+)/)?.[1];
  const size = sizeClass ? Number(sizeClass) * 4 : 20;
  return <Image src={src} alt={alt} width={size} height={size} className={className} />;
}

function LineIcon({ className }: { className?: string; style?: React.CSSProperties }) {
  return <ImagePlatformIcon src={lineLogo} alt="LINE OA" className={className} />;
}

function TikTokIcon({ className }: { className?: string; style?: React.CSSProperties }) {
  return <ImagePlatformIcon src={tiktokLogo} alt="TikTok" className={className} />;
}

function YouTubeIcon({ className }: { className?: string; style?: React.CSSProperties }) {
  return <ImagePlatformIcon src={youtubeLogo} alt="YouTube" className={className} />;
}

function TelegramIcon({ className }: { className?: string; style?: React.CSSProperties }) {
  return <ImagePlatformIcon src={telegramLogo} alt="Telegram" className={className} />;
}

const PLATFORMS = [
  { key: "facebook", label: "Facebook", icon: Facebook, color: "#1877F2" },
  { key: "twitter", label: "X (Twitter)", icon: Twitter, color: "#000000" },
  { key: "instagram", label: "Instagram", icon: Instagram, color: "#E4405F" },
  { key: "tiktok", label: "TikTok", icon: TikTokIcon, color: "#000000" },
  { key: "youtube", label: "YouTube", icon: YouTubeIcon, color: "#FF0000" },
  { key: "telegram", label: "Telegram", icon: TelegramIcon, color: "#26A5E4" },
  { key: "line", label: "LINE OA", icon: LineIcon, color: "#00B900" },
] as const;

const DEMO_MEDIA: MediaItem[] = [
  {
    type: "image",
    url: productMockupMain.src,
  },
  {
    type: "image",
    url: productMockupAlt.src,
  },
  {
    type: "image",
    url: productMockupBottle.src,
  },
];

const INITIAL_ACCOUNTS: Account[] = [
  { _id: "facebook-demo", platform: "facebook", username: "syncsocial.shop", displayName: "SyncSocial Shop", isActive: true },
  { _id: "instagram-demo", platform: "instagram", username: "syncsocial.shop", displayName: "SyncSocial IG", isActive: true },
];

const INITIAL_HISTORY: PostHistory[] = [
  { id: "1", content: "โปรโมชันสิ้นเดือน ซื้อ 1 แถม 1 วันนี้วันสุดท้าย", media_urls: [], platforms: ["facebook", "instagram"], status: "success", created_at: "2026-03-29T19:00:00.000Z" },
  { id: "2", content: "รีวิวลูกค้าจริง ใช้แล้วเห็นผลใน 7 วัน", media_urls: [], platforms: ["tiktok"], status: "success", created_at: "2026-03-28T12:30:00.000Z" },
];

function platformIcon(platform: string) {
  const found = PLATFORMS.find((p) => p.key === platform);
  return found?.icon ?? Link2;
}

function platformLabel(platform: string) {
  return PLATFORMS.find((p) => p.key === platform)?.label ?? platform;
}

function platformColor(platform: string) {
  return PLATFORMS.find((p) => p.key === platform)?.color ?? "#6366f1";
}

function formatNumber(n: number) {
  return n.toLocaleString("th-TH");
}

export function DemoDashboard() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [selectedAccounts, setSelectedAccounts] = useState<Record<string, boolean>>({
    "facebook-demo": true,
    "instagram-demo": true,
  });
  const [caption, setCaption] = useState("โปรโมชันสิ้นเดือน ลดทันที พร้อมส่งฟรีวันนี้เท่านั้น สนใจทักแชตได้เลย");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(DEMO_MEDIA);
  const [showPreview, setShowPreview] = useState(true);
  const [previewPlatform, setPreviewPlatform] = useState<"facebook" | "twitter" | "instagram" | "tiktok" | "line">("facebook");
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [history, setHistory] = useState<PostHistory[]>(INITIAL_HISTORY);
  const [hasLineToken, setHasLineToken] = useState(false);

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((item) => item.id !== id)), 3000);
  };

  const analyticsTotals = useMemo(
    () => ({ impressions: 128420, reach: 86440, posts: history.length + 14, engagement: 6842 }),
    [history.length]
  );

  function toggleAccount(accountId: string) {
    setSelectedAccounts((prev) => ({ ...prev, [accountId]: !prev[accountId] }));
  }

  function handleConnect(platform: string) {
    if (platform === "line") {
      setConnectingPlatform(platform);
      setTimeout(() => {
        setHasLineToken(true);
        setAccounts((prev) => {
          if (prev.some((item) => item.platform === "line")) return prev;
          return [...prev, { _id: "line-demo", platform: "line", username: "all-followers", displayName: "LINE OA", isActive: true }];
        });
        setConnectingPlatform(null);
        addToast("เชื่อมต่อ LINE OA (Demo) สำเร็จแล้ว", "success");
      }, 700);
      return;
    }

    setConnectingPlatform(platform);
    setTimeout(() => {
      setAccounts((prev) => {
        if (prev.some((item) => item.platform === platform)) return prev;
        return [
          ...prev,
          {
            _id: `${platform}-demo`,
            platform,
            username: `demo_${platform}`,
            displayName: `${platformLabel(platform)} Demo Account`,
            isActive: true,
          },
        ];
      });
      setSelectedAccounts((prev) => ({ ...prev, [`${platform}-demo`]: true }));
      setConnectingPlatform(null);
      addToast(`เชื่อมต่อ ${platformLabel(platform)} แบบ Demo สำเร็จแล้ว`, "success");
    }, 800);
  }

  function handleFakeAi(mode: string) {
    const variants: Record<string, string> = {
      sale: "โปรสิ้นเดือนมาแล้ว 🎉 ลดแรงพร้อมส่งฟรีวันนี้เท่านั้น สนใจตัวไหนทักแชตได้เลย ทีมงานตอบไวมาก",
      friendly: "ลูกค้าใหม่ไม่ต้องกังวล เรามีทีมคอยแนะนำให้ครบ พร้อมโปรพิเศษช่วงสิ้นเดือนค่ะ",
      short: "ลดแรง ส่งฟรี ทักเลยวันนี้ 🔥",
    };
    setCaption(variants[mode] ?? caption);
    addToast("AI Demo สร้างข้อความตัวอย่างแล้ว", "success");
  }

  function handleAddMedia() {
    setMediaItems(DEMO_MEDIA);
    addToast("เพิ่มรูป mock-up แล้ว", "success");
  }

  function handleRemoveMedia(index: number) {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
  }

  function handlePost() {
    const selected = accounts.filter((a) => selectedAccounts[a._id]);
    if (selected.length === 0) {
      addToast("กรุณาเลือกอย่างน้อย 1 แพลตฟอร์ม", "error");
      return;
    }
    if (!caption.trim() && mediaItems.length === 0) {
      addToast("กรุณาเขียนข้อความหรือแนบรูป", "error");
      return;
    }

    setPosting(true);
    setTimeout(() => {
      setHistory((prev) => [
        {
          id: String(Date.now()),
          content: caption,
          media_urls: mediaItems.map((m) => m.url),
          platforms: selected.map((s) => s.platform),
          status: "success",
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setPosting(false);
      addToast("ส่งโพสต์แบบ Demo สำเร็จแล้ว", "success");
    }, 900);
  }

  const selectedCount = Object.values(selectedAccounts).filter(Boolean).length;

  return (
    <div className="min-h-screen">
      <div className="fixed right-4 top-4 z-50 space-y-2 max-w-sm">
        {toasts.map((t) => (
          <div key={t.id} className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-xl ${t.type === "success" ? "border-emerald-200 bg-emerald-50/90 text-emerald-800" : "border-red-200 bg-red-50/90 text-red-800"}`}>
            {t.message}
          </div>
        ))}
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Zap className="h-7 w-7 text-primary-500" />
            <span className="text-xl font-bold tracking-tight text-slate-900">SyncSocial Demo</span>
          </div>
          <div className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600">Preview Mode • ไม่ต้องล็อกอิน</div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <section className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
          <h2 className="mb-1 text-lg font-semibold text-slate-800">เชื่อมต่อโซเชียลของคุณ</h2>
          <p className="mb-5 text-sm text-slate-400">กดเพื่อเชื่อมต่อบัญชีแบบ Demo ได้ทันที โดยไม่ต้องใช้ OAuth จริง</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {PLATFORMS.map((p) => {
              const Icon = p.icon;
              const connected = accounts.some((a) => a.platform === p.key && a.isActive);
              const lineReady = p.key === "line" && hasLineToken;
              const isConnecting = connectingPlatform === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => !connected && !lineReady && handleConnect(p.key)}
                  disabled={(connected && p.key !== "line") || lineReady || isConnecting}
                  className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all ${connected || lineReady ? "border-emerald-200 bg-emerald-50/60" : "border-slate-200 hover:border-primary-300 hover:bg-primary-50/40"}`}
                >
                  {isConnecting ? <Loader2 className="h-6 w-6 animate-spin" style={{ color: p.color }} /> : <Icon className="h-6 w-6" style={{ color: p.color }} />}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-700">{p.label}</div>
                    <div className="text-xs text-slate-400">{connected || lineReady ? "เชื่อมต่อแล้ว (Demo)" : "กดเพื่อเชื่อมต่อ"}</div>
                  </div>
                  {(connected || lineReady) && <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500" />}
                </button>
              );
            })}
          </div>

          {accounts.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="mb-2 text-xs text-slate-400">บัญชีที่เชื่อมต่อแล้ว:</p>
              <div className="flex flex-wrap gap-2">
                {accounts.map((a) => {
                  const Icon = platformIcon(a.platform);
                  return (
                    <button key={a._id} onClick={() => toggleAccount(a._id)} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${selectedAccounts[a._id] ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-600"}`}>
                      <Icon className="h-3.5 w-3.5" style={{ color: platformColor(a.platform) }} />
                      {a.displayName || a.username}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">สร้างโพสต์ใหม่</h2>
              <p className="text-sm text-slate-400">หน้าตาและ flow ใกล้ระบบจริง แต่ใช้ mock-up data ทั้งหมด</p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">เลือกแล้ว {selectedCount} ช่องทาง</div>
          </div>

          <div className="space-y-4">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
              placeholder="พิมพ์ข้อความที่ต้องการโพสต์..."
            />

            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleFakeAi("sale")} className="rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100">AI ขายเก่ง</button>
              <button onClick={() => handleFakeAi("friendly")} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">AI เป็นกันเอง</button>
              <button onClick={() => handleFakeAi("short")} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">AI สั้นกระชับ</button>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <button onClick={handleAddMedia} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <ImageIcon className="h-4 w-4" /> เพิ่มรูป mock-up
              </button>
              <button onClick={() => setShowPreview((prev) => !prev)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Eye className="h-4 w-4" /> {showPreview ? "ซ่อนพรีวิว" : "แสดงพรีวิว"}
              </button>
              <button onClick={handlePost} disabled={posting} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-70">
                {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} โพสต์แบบ Demo
              </button>
            </div>

            {mediaItems.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {mediaItems.map((item, index) => (
                  <div key={index} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt="mock media" className="aspect-video w-full object-cover" />
                    <button onClick={() => handleRemoveMedia(index)} className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 shadow hover:bg-white">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {showPreview && (
          <section className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">ตัวอย่างโพสต์</h2>
                <p className="text-sm text-slate-400">สลับพรีวิวได้เหมือนระบบจริง</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["facebook", "instagram", "twitter", "tiktok", "line"] as const).map((platform) => (
                  <button key={platform} onClick={() => setPreviewPlatform(platform)} className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${previewPlatform === platform ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
                    {platform}
                  </button>
                ))}
              </div>
            </div>
            <PostPreview
              content={caption}
              mediaItems={mediaItems}
              platform={previewPlatform}
              user={{ name: "SyncSocial Demo", username: "syncsocial_demo" }}
            />
          </section>
        )}

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MiniStat icon={<BarChart3 className="h-4 w-4 text-primary-500" />} label="โพสต์ทั้งหมด" value={analyticsTotals.posts} />
          <MiniStat icon={<Eye className="h-4 w-4 text-cyan-500" />} label="Impressions" value={analyticsTotals.impressions} />
          <MiniStat icon={<MessageCircle className="h-4 w-4 text-emerald-500" />} label="Engagement" value={analyticsTotals.engagement} />
          <MiniStat icon={<Clock className="h-4 w-4 text-amber-500" />} label="Reach" value={analyticsTotals.reach} />
        </section>

        <section className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
            <History className="h-5 w-5 text-slate-400" /> ประวัติการโพสต์แบบ Demo
          </div>
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-medium text-slate-800 line-clamp-1">{item.content}</div>
                  <div className="text-xs text-emerald-600 font-semibold">สำเร็จ</div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                  {item.platforms.map((platform) => (
                    <span key={platform} className="rounded-full bg-white px-2.5 py-1">{platformLabel(platform)}</span>
                  ))}
                </div>
                <div className="mt-2 text-xs text-slate-400">{new Date(item.created_at).toLocaleString("th-TH")}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-lg shadow-slate-200/40 backdrop-blur-xl">
      <div className="mb-2 flex items-center gap-2 text-slate-400">{icon}<span className="text-xs font-medium">{label}</span></div>
      <div className="text-2xl font-bold text-slate-900">{formatNumber(value)}</div>
    </div>
  );
}
