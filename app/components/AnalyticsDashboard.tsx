"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  MousePointerClick,
  Bookmark,
  Users,
  Loader2,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Facebook,
  Twitter,
  Instagram,
  Link2,
  Sparkles,
  Zap,
  Crown,
  ChevronRight,
  Play,
  Target,
  Award,
  PieChart,
  CalendarDays,
  ThumbsUp,
  LayoutDashboard,
} from "lucide-react";
import tiktokLogo from "../../Logo/tiktok logo.png";

// ---- Types ----

interface PostAnalytics {
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  views: number;
  engagementRate: number;
  lastUpdated: string;
}

interface AnalyticsPost {
  _id: string;
  content: string;
  publishedAt: string;
  status: string;
  analytics: PostAnalytics;
  platform: string;
  platformPostUrl: string;
  thumbnailUrl: string;
  mediaType: string;
}

interface AnalyticsOverview {
  totalPosts: number;
  publishedPosts: number;
  scheduledPosts: number;
  lastSync: string | null;
}

interface DailyData {
  date: string;
  postCount: number;
  metrics: {
    impressions: number;
    reach: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    clicks: number;
    views: number;
  };
}

interface PlatformBreakdown {
  platform: string;
  postCount: number;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  views: number;
}

interface BestTimeSlot {
  day_of_week: number;
  hour: number;
  avg_engagement: number;
  post_count: number;
}

// ---- Helpers ----

function TikTokIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <Image
      src={tiktokLogo}
      alt="TikTok"
      width={32}
      height={32}
      className={className}
      style={style}
    />
  );
}

function platformIcon(platform: string) {
  switch (platform) {
    case "facebook": return Facebook;
    case "twitter": return Twitter;
    case "instagram": return Instagram;
    case "tiktok": return TikTokIcon;
    default: return Link2;
  }
}

function platformColor(platform: string) {
  switch (platform) {
    case "facebook": return "#1877F2";
    case "twitter": return "#000000";
    case "instagram": return "#E4405F";
    case "tiktok": return "#000000";
    default: return "#6366f1";
  }
}

const DAY_LABELS = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];

const SHOWCASE_OVERVIEW: AnalyticsOverview = {
  totalPosts: 36,
  publishedPosts: 34,
  scheduledPosts: 2,
  lastSync: "2026-03-18T19:30:00.000Z",
};

const SHOWCASE_DAILY_DATA: DailyData[] = [
  { date: "2026-03-05", postCount: 2, metrics: { impressions: 3200, reach: 2400, likes: 168, comments: 24, shares: 18, saves: 12, clicks: 31, views: 890 } },
  { date: "2026-03-06", postCount: 3, metrics: { impressions: 4100, reach: 2950, likes: 214, comments: 29, shares: 21, saves: 17, clicks: 36, views: 1120 } },
  { date: "2026-03-07", postCount: 2, metrics: { impressions: 4600, reach: 3210, likes: 238, comments: 31, shares: 24, saves: 19, clicks: 44, views: 1380 } },
  { date: "2026-03-08", postCount: 1, metrics: { impressions: 3800, reach: 2740, likes: 196, comments: 23, shares: 17, saves: 13, clicks: 33, views: 1010 } },
  { date: "2026-03-09", postCount: 2, metrics: { impressions: 5200, reach: 3660, likes: 281, comments: 37, shares: 29, saves: 23, clicks: 51, views: 1560 } },
  { date: "2026-03-10", postCount: 3, metrics: { impressions: 6100, reach: 4290, likes: 326, comments: 42, shares: 33, saves: 28, clicks: 62, views: 1840 } },
  { date: "2026-03-11", postCount: 2, metrics: { impressions: 5700, reach: 4020, likes: 304, comments: 39, shares: 31, saves: 25, clicks: 58, views: 1700 } },
  { date: "2026-03-12", postCount: 3, metrics: { impressions: 6900, reach: 4810, likes: 372, comments: 46, shares: 38, saves: 31, clicks: 69, views: 2060 } },
  { date: "2026-03-13", postCount: 4, metrics: { impressions: 7600, reach: 5250, likes: 404, comments: 52, shares: 42, saves: 36, clicks: 74, views: 2280 } },
  { date: "2026-03-14", postCount: 2, metrics: { impressions: 6400, reach: 4460, likes: 341, comments: 41, shares: 33, saves: 27, clicks: 63, views: 1910 } },
  { date: "2026-03-15", postCount: 3, metrics: { impressions: 7100, reach: 4940, likes: 389, comments: 48, shares: 39, saves: 32, clicks: 72, views: 2150 } },
  { date: "2026-03-16", postCount: 2, metrics: { impressions: 6800, reach: 4720, likes: 358, comments: 44, shares: 35, saves: 29, clicks: 67, views: 2040 } },
  { date: "2026-03-17", postCount: 3, metrics: { impressions: 8300, reach: 5740, likes: 447, comments: 56, shares: 46, saves: 38, clicks: 84, views: 2480 } },
  { date: "2026-03-18", postCount: 4, metrics: { impressions: 9100, reach: 6280, likes: 486, comments: 61, shares: 50, saves: 42, clicks: 91, views: 2710 } },
];

const SHOWCASE_PLATFORM_BREAKDOWN: PlatformBreakdown[] = [
  { platform: "facebook", postCount: 12, impressions: 28400, reach: 19600, likes: 1420, comments: 182, shares: 214, saves: 96, clicks: 263, views: 5400 },
  { platform: "instagram", postCount: 10, impressions: 24200, reach: 17100, likes: 1670, comments: 208, shares: 126, saves: 191, clicks: 174, views: 4680 },
  { platform: "twitter", postCount: 8, impressions: 15600, reach: 11200, likes: 690, comments: 94, shares: 118, saves: 27, clicks: 139, views: 2310 },
  { platform: "tiktok", postCount: 6, impressions: 19800, reach: 13800, likes: 1740, comments: 314, shares: 198, saves: 88, clicks: 95, views: 14420 },
];

const SHOWCASE_BEST_TIMES: BestTimeSlot[] = [
  { day_of_week: 1, hour: 19, avg_engagement: 482, post_count: 6 },
  { day_of_week: 3, hour: 12, avg_engagement: 451, post_count: 5 },
  { day_of_week: 5, hour: 20, avg_engagement: 437, post_count: 7 },
  { day_of_week: 0, hour: 9, avg_engagement: 401, post_count: 4 },
  { day_of_week: 6, hour: 18, avg_engagement: 389, post_count: 5 },
];

const SHOWCASE_TOP_POSTS: AnalyticsPost[] = [
  {
    _id: "demo-1",
    content: "โปรแรงกลางเดือน ซื้อ 1 แถม 1 เฉพาะวันนี้ ยอดคลิกเพิ่มชัดเจนหลังโพสต์เวลา 19:00 น.",
    publishedAt: "2026-03-18T12:00:00.000Z",
    status: "published",
    analytics: { impressions: 9100, reach: 6280, likes: 486, comments: 61, shares: 50, saves: 42, clicks: 91, views: 2710, engagementRate: 7.6, lastUpdated: "2026-03-18T19:30:00.000Z" },
    platform: "facebook",
    platformPostUrl: "",
    thumbnailUrl: "",
    mediaType: "image",
  },
  {
    _id: "demo-2",
    content: "วิดีโอสั้นแนะนำสินค้า 30 วินาที ทำยอดดูและแชร์สูงสุดในสัปดาห์นี้",
    publishedAt: "2026-03-17T11:00:00.000Z",
    status: "published",
    analytics: { impressions: 8300, reach: 5740, likes: 447, comments: 56, shares: 46, saves: 38, clicks: 84, views: 2480, engagementRate: 7.2, lastUpdated: "2026-03-18T19:30:00.000Z" },
    platform: "instagram",
    platformPostUrl: "",
    thumbnailUrl: "",
    mediaType: "video",
  },
  {
    _id: "demo-3",
    content: "โพสต์รีวิวจากลูกค้า ทำให้ TikTok มียอดวิวและคอมเมนต์สูงขึ้นทันที",
    publishedAt: "2026-03-16T14:00:00.000Z",
    status: "published",
    analytics: { impressions: 6800, reach: 4720, likes: 358, comments: 44, shares: 35, saves: 29, clicks: 67, views: 2040, engagementRate: 6.9, lastUpdated: "2026-03-18T19:30:00.000Z" },
    platform: "tiktok",
    platformPostUrl: "",
    thumbnailUrl: "",
    mediaType: "video",
  },
];

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

// ---- Component ----

interface AnalyticsDashboardProps {
  showcaseMode?: boolean;
  showcaseExpanded?: boolean;
}

export function AnalyticsDashboard({
  showcaseMode = false,
  showcaseExpanded = false,
}: AnalyticsDashboardProps = {}) {
  const [loading, setLoading] = useState(!showcaseMode);
  const [error, setError] = useState<string | null>(null);
  const [addonRequired, setAddonRequired] = useState(showcaseMode);
  const [showShowcase, setShowShowcase] = useState(showcaseMode ? showcaseExpanded : false);

  // Data
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [topPosts, setTopPosts] = useState<AnalyticsPost[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [platformBreakdown, setPlatformBreakdown] = useState<PlatformBreakdown[]>([]);
  const [bestTimes, setBestTimes] = useState<BestTimeSlot[]>([]);
  const [hasAccess, setHasAccess] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAddonRequired(false);

    try {
      // Fetch overview + top posts
      const overviewRes = await fetch("/api/analytics?type=overview");
      if (overviewRes.status === 402) {
        setAddonRequired(true);
        setLoading(false);
        return;
      }
      if (!overviewRes.ok) throw new Error("Failed to fetch analytics");
      const overviewData = await overviewRes.json();

      if (overviewData.hasAnalyticsAccess === false) {
        setHasAccess(false);
      }

      setOverview(overviewData.overview || null);
      setTopPosts(overviewData.posts || []);

      // Fetch daily metrics (may fail with 402)
      try {
        const dailyRes = await fetch("/api/analytics?type=daily");
        if (dailyRes.ok) {
          const dailyJson = await dailyRes.json();
          setDailyData(dailyJson.dailyData || []);
          setPlatformBreakdown(dailyJson.platformBreakdown || []);
        }
      } catch { /* ignore */ }

      // Fetch best times
      try {
        const btRes = await fetch("/api/analytics?type=besttime");
        if (btRes.ok) {
          const btJson = await btRes.json();
          setBestTimes(btJson.slots || []);
        }
      } catch { /* ignore */ }
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!showcaseMode) {
      fetchAll();
    }
  }, [fetchAll, showcaseMode]);

  useEffect(() => {
    if (showcaseMode) {
      setLoading(false);
      setError(null);
      setAddonRequired(true);
      setShowShowcase(showcaseExpanded);
    }
  }, [showcaseExpanded, showcaseMode]);

  // ---- Loading ----
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <span className="ml-3 text-slate-500">กำลังโหลด Analytics...</span>
      </div>
    );
  }

  // ---- Add-on Required — Premium Showcase ----
  if (addonRequired) {
    const showcaseTotals = SHOWCASE_DAILY_DATA.reduce(
      (acc, d) => ({
        impressions: acc.impressions + d.metrics.impressions,
        reach: acc.reach + d.metrics.reach,
        likes: acc.likes + d.metrics.likes,
        comments: acc.comments + d.metrics.comments,
        shares: acc.shares + d.metrics.shares,
        saves: acc.saves + d.metrics.saves,
        clicks: acc.clicks + d.metrics.clicks,
        views: acc.views + d.metrics.views,
      }),
      { impressions: 0, reach: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, views: 0 }
    );
    const showcaseMaxImpressions = Math.max(...SHOWCASE_DAILY_DATA.map((d) => d.metrics.impressions), 1);
    const maxPlatformImpressions = Math.max(...SHOWCASE_PLATFORM_BREAKDOWN.map((p) => p.impressions), 1);

    return (
      <div className="space-y-5">
        {/* ── Hero Banner ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-6 sm:p-8 text-white">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" /> ตัวอย่างรายงาน Analytics
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 leading-tight">
              เห็นทุกตัวเลขสำคัญ<br className="sm:hidden" /> ในหน้าเดียว
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
              รู้ว่าโพสต์ไหนทำผลงานดี แพลตฟอร์มไหนคุ้ม และควรโพสต์เวลาไหน<br className="hidden sm:block" />
              ไม่ต้องเปิดหลายแอป — ดูที่เดียวจบ
            </p>
            <button
              onClick={() => setShowShowcase((v) => !v)}
              className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 shadow-lg shadow-indigo-900/30 transition-all active:scale-95"
            >
              {showShowcase ? "ซ่อนตัวอย่าง" : "ดูตัวอย่าง"} <Play className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showShowcase && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* ── Feature Highlights ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FeatureCard
                icon={<LayoutDashboard className="w-5 h-5" />}
                color="indigo"
                title="ดูยอดรวมในหน้าเดียว"
                desc="เห็น Reach, Click และ Engagement ทุกช่องทางรวมกัน ไม่ต้องเปิดหลายแอป"
              />
              <FeatureCard
                icon={<CalendarDays className="w-5 h-5" />}
                color="amber"
                title="รู้เวลาโพสต์ที่คุ้มที่สุด"
                desc="ระบบวิเคราะห์ให้ว่าช่วงเวลาไหนมีคนเห็นเยอะ คนทักหรือคลิกมากกว่า"
              />
              <FeatureCard
                icon={<Target className="w-5 h-5" />}
                color="emerald"
                title="เทียบผลแต่ละแพลตฟอร์ม"
                desc="รู้ทันทีว่า Facebook, IG หรือ TikTok ตัวไหนคุ้มค่าเวลาและงบที่ลงไป"
              />
            </div>

            {/* ── Key Metrics ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <GlowStatCard icon={<BarChart3 className="w-5 h-5" />} color="indigo" label="โพสต์ทั้งหมด" value={SHOWCASE_OVERVIEW.totalPosts} suffix="โพสต์" />
              <GlowStatCard icon={<Eye className="w-5 h-5" />} color="blue" label="ยอดเห็น (Impressions)" value={showcaseTotals.impressions} />
              <GlowStatCard icon={<Users className="w-5 h-5" />} color="violet" label="คนเข้าถึง (Reach)" value={showcaseTotals.reach} />
              <GlowStatCard icon={<Heart className="w-5 h-5" />} color="rose" label="กดไลค์" value={showcaseTotals.likes} />
            </div>

            {/* ── Engagement Breakdown Pills ── */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <PillStat icon={<Heart className="w-3.5 h-3.5" />} color="rose" label="กดถูกใจ" value={showcaseTotals.likes} />
              <PillStat icon={<MessageCircle className="w-3.5 h-3.5" />} color="blue" label="คอมเมนต์" value={showcaseTotals.comments} />
              <PillStat icon={<Share2 className="w-3.5 h-3.5" />} color="green" label="แชร์" value={showcaseTotals.shares} />
              <PillStat icon={<Bookmark className="w-3.5 h-3.5" />} color="amber" label="บันทึก" value={showcaseTotals.saves} />
              <PillStat icon={<MousePointerClick className="w-3.5 h-3.5" />} color="purple" label="คลิก" value={showcaseTotals.clicks} />
              <PillStat icon={<Eye className="w-3.5 h-3.5" />} color="cyan" label="ยอดดู" value={showcaseTotals.views} />
            </div>

            {/* ── Impressions Chart ── */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-500" /> กราฟยอดเห็นโพสต์ 14 วัน
                </h3>
                <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">ข้อมูลตัวอย่าง</span>
              </div>
              <div className="flex items-end gap-[3px] h-32">
                {SHOWCASE_DAILY_DATA.slice(-14).map((d, i) => {
                  const pct = Math.max((d.metrics.impressions / showcaseMaxImpressions) * 100, 4);
                  return (
                    <div key={i} className="flex-1 h-full flex flex-col items-center justify-end gap-1 group relative">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-blue-400 hover:from-indigo-600 hover:to-blue-500 transition-all cursor-default"
                        style={{ height: `${pct}%` }}
                      />
                      <span className="text-[9px] text-slate-400 font-medium">{new Date(d.date).getDate()}</span>
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-20">
                        <div className="bg-slate-800 text-white text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                          <span className="font-semibold">{formatNumber(d.metrics.impressions)}</span> ยอดเห็น
                        </div>
                        <div className="w-1.5 h-1.5 bg-slate-800 rotate-45 -mt-0.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Reach Area Chart ── */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-violet-500" /> คนเข้าถึง (Reach) 14 วัน
                </h3>
                <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">ข้อมูลตัวอย่าง</span>
              </div>
              <ReachAreaChart data={SHOWCASE_DAILY_DATA.slice(-14)} />
            </div>

            {/* ── Engagement Donut + Breakdown ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <PieChart className="w-4 h-4 text-rose-500" /> สัดส่วนการมีส่วนร่วม
                </h3>
                <EngagementDonut totals={showcaseTotals} />
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Engagement Rate รายวัน
                </h3>
                <EngagementLineChart data={SHOWCASE_DAILY_DATA.slice(-14)} />
              </div>
            </div>

            {/* ── Platform Breakdown ── */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                <PieChart className="w-4 h-4 text-indigo-500" /> เปรียบเทียบแต่ละแพลตฟอร์ม
              </h3>
              <div className="space-y-4">
                {SHOWCASE_PLATFORM_BREAKDOWN.map((pb) => {
                  const Icon = platformIcon(pb.platform);
                  const color = platformColor(pb.platform);
                  const pct = Math.round((pb.impressions / maxPlatformImpressions) * 100);
                  const totalEng = pb.likes + pb.comments + pb.shares + pb.saves;
                  return (
                    <div key={pb.platform}>
                      <div className="flex items-center gap-3 mb-1.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: color + "14" }}>
                          <Icon className="w-4.5 h-4.5" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-800 capitalize">{pb.platform}</span>
                            <span className="text-xs font-medium text-slate-500">{pb.postCount} โพสต์</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-12">
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                        </div>
                        <div className="flex gap-4 text-[11px] text-slate-500">
                          <span><strong className="text-slate-700">{formatNumber(pb.impressions)}</strong> ยอดเห็น</span>
                          <span><strong className="text-slate-700">{formatNumber(pb.reach)}</strong> เข้าถึง</span>
                          <span><strong className="text-slate-700">{formatNumber(totalEng)}</strong> กดไลค์</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Best Time + Value Props ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Best Time */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-amber-500" /> เวลาโพสต์ที่ดีที่สุด
                </h3>
                <div className="space-y-2">
                  {SHOWCASE_BEST_TIMES.map((slot, i) => {
                    const medals = ["🥇", "🥈", "🥉"];
                    const medal = i < 3 ? medals[i] : `#${i + 1}`;
                    const maxEng = SHOWCASE_BEST_TIMES[0].avg_engagement;
                    const barPct = Math.round((slot.avg_engagement / maxEng) * 100);
                    return (
                      <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                        <span className="text-lg w-7 text-center">{medal}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-800">
                            {DAY_LABELS[slot.day_of_week]} {String(slot.hour).padStart(2, "0")}:00 น.
                          </div>
                          <div className="w-full h-1.5 bg-amber-100 rounded-full mt-1 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400" style={{ width: `${barPct}%` }} />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-amber-700">{formatNumber(Math.round(slot.avg_engagement))}</div>
                          <div className="text-[10px] text-slate-400">ไลค์เฉลี่ย</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Value Proposition */}
              <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 rounded-2xl border border-indigo-100 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <Crown className="w-4 h-4 text-indigo-500" /> ลูกค้าจะได้อะไรบ้าง
                </h3>
                <div className="space-y-3">
                  <ValueItem
                    icon={<Zap className="w-4 h-4 text-amber-500" />}
                    title="สรุปผลรวมอัตโนมัติ"
                    desc="ดูยอดรวมของทุกแพลตฟอร์มได้ทันที ไม่ต้องรวมเอง"
                  />
                  <ValueItem
                    icon={<PieChart className="w-4 h-4 text-indigo-500" />}
                    title="เทียบผลทุกช่องทาง"
                    desc="เห็นชัดว่า Facebook, IG หรือ TikTok ตัวไหนคุ้มกว่า"
                  />
                  <ValueItem
                    icon={<CalendarDays className="w-4 h-4 text-emerald-500" />}
                    title="แนะนำเวลาโพสต์"
                    desc="ไม่ต้องเดา ระบบบอกว่าโพสต์เวลาไหนได้ผลดีที่สุด"
                  />
                  <ValueItem
                    icon={<Award className="w-4 h-4 text-violet-500" />}
                    title="รู้ว่าโพสต์ไหนปัง"
                    desc="จัดอันดับโพสต์ที่ทำผลงานดี เพื่อทำซ้ำสิ่งที่ได้ผล"
                  />
                </div>
              </div>
            </div>

            {/* ── Top Posts ── */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-indigo-500" /> โพสต์ที่ทำผลงานดีที่สุด
              </h3>
              <div className="space-y-3">
                {SHOWCASE_TOP_POSTS.map((post, idx) => {
                  const Icon = platformIcon(post.platform);
                  const color = platformColor(post.platform);
                  return (
                    <div key={post._id} className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: color + "14" }}>
                          <Icon className="w-6 h-6" style={{ color }} />
                        </div>
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 line-clamp-2 mb-2 leading-relaxed">{post.content}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-blue-400" /> <strong className="text-slate-700">{formatNumber(post.analytics.impressions)}</strong> เห็น</span>
                          <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-400" /> <strong className="text-slate-700">{formatNumber(post.analytics.likes)}</strong></span>
                          <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-blue-400" /> <strong className="text-slate-700">{formatNumber(post.analytics.comments)}</strong></span>
                          <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5 text-green-400" /> <strong className="text-slate-700">{formatNumber(post.analytics.shares)}</strong></span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                            <TrendingUp className="w-3 h-3" /> {post.analytics.engagementRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── CTA Footer ── */}
            <div className="text-center py-4">
              <p className="text-xs text-slate-400 mb-1">ข้อมูลด้านบนเป็นตัวอย่างสำหรับโชว์เคส</p>
              <p className="text-xs text-slate-400">เมื่อเปิดใช้งาน Analytics จะแสดงข้อมูลจริงจากทุกแพลตฟอร์มของคุณ</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---- Error ----
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-3">{error}</p>
        <button onClick={fetchAll} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">
          ลองใหม่
        </button>
      </div>
    );
  }

  // ---- Compute summary from daily data ----
  const totalMetrics = dailyData.reduce(
    (acc, d) => ({
      impressions: acc.impressions + d.metrics.impressions,
      reach: acc.reach + d.metrics.reach,
      likes: acc.likes + d.metrics.likes,
      comments: acc.comments + d.metrics.comments,
      shares: acc.shares + d.metrics.shares,
      saves: acc.saves + d.metrics.saves,
      clicks: acc.clicks + d.metrics.clicks,
      views: acc.views + d.metrics.views,
    }),
    { impressions: 0, reach: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, views: 0 }
  );

  // Chart bar max for mini chart
  const maxImpressions = Math.max(...dailyData.slice(-14).map((d) => d.metrics.impressions), 1);

  // Top 5 best time slots
  const topSlots = [...bestTimes].sort((a, b) => b.avg_engagement - a.avg_engagement).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-500" />
          Analytics
        </h2>
        <button
          onClick={fetchAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
        >
          <RefreshCw className="w-3 h-3" /> รีเฟรช
        </button>
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={<BarChart3 className="w-4 h-4" />} label="โพสต์ทั้งหมด" value={overview.totalPosts} />
          <StatCard icon={<Eye className="w-4 h-4" />} label="Impressions" value={totalMetrics.impressions} />
          <StatCard icon={<Users className="w-4 h-4" />} label="Reach" value={totalMetrics.reach} />
          <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Engagement" value={totalMetrics.likes + totalMetrics.comments + totalMetrics.shares} />
        </div>
      )}

      {/* Metric Detail Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <MiniStat icon={<Heart className="w-3.5 h-3.5 text-red-500" />} label="Likes" value={totalMetrics.likes} />
        <MiniStat icon={<MessageCircle className="w-3.5 h-3.5 text-blue-500" />} label="Comments" value={totalMetrics.comments} />
        <MiniStat icon={<Share2 className="w-3.5 h-3.5 text-green-500" />} label="Shares" value={totalMetrics.shares} />
        <MiniStat icon={<Bookmark className="w-3.5 h-3.5 text-amber-500" />} label="Saves" value={totalMetrics.saves} />
        <MiniStat icon={<MousePointerClick className="w-3.5 h-3.5 text-purple-500" />} label="Clicks" value={totalMetrics.clicks} />
        <MiniStat icon={<Eye className="w-3.5 h-3.5 text-cyan-500" />} label="Views" value={totalMetrics.views} />
      </div>

      {/* Mini Impressions Chart (last 14 days) */}
      {dailyData.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Impressions (14 วันล่าสุด)</h3>
          <div className="flex items-end gap-1 h-24">
            {dailyData.slice(-14).map((d, i) => {
              const h = Math.max((d.metrics.impressions / maxImpressions) * 100, 2);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className="w-full bg-primary-400 rounded-t hover:bg-primary-500 transition-colors cursor-default"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[9px] text-slate-400">
                    {new Date(d.date).getDate()}
                  </span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-10">
                    {d.date}: {formatNumber(d.metrics.impressions)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Platform Breakdown */}
      {platformBreakdown.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">แยกตามแพลตฟอร์ม</h3>
          <div className="space-y-3">
            {platformBreakdown.map((pb) => {
              const Icon = platformIcon(pb.platform);
              const totalEng = pb.likes + pb.comments + pb.shares + pb.saves;
              return (
                <div key={pb.platform} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-100">
                    <Icon className="w-4 h-4" style={{ color: platformColor(pb.platform) }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700 capitalize">{pb.platform}</span>
                      <span className="text-xs text-slate-400">{pb.postCount} โพสต์</span>
                    </div>
                    <div className="flex gap-3 text-[11px] text-slate-500">
                      <span>{formatNumber(pb.impressions)} imp.</span>
                      <span>{formatNumber(pb.reach)} reach</span>
                      <span>{formatNumber(totalEng)} eng.</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Best Time to Post */}
      {topSlots.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" /> เวลาโพสต์ที่ดีที่สุด
          </h3>
          <div className="space-y-2">
            {topSlots.map((slot, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100"
              >
                <span className="text-lg font-bold text-primary-600 w-7 text-center">#{i + 1}</span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-slate-700">
                    {DAY_LABELS[slot.day_of_week]} {String(slot.hour).padStart(2, "0")}:00 น.
                  </span>
                  <span className="text-xs text-slate-400 ml-2">
                    ({slot.post_count} โพสต์)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-emerald-600">
                    {formatNumber(Math.round(slot.avg_engagement))}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">avg eng.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Posts */}
      {topPosts.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">โพสต์ล่าสุด</h3>
          <div className="space-y-3">
            {topPosts.map((post) => {
              const Icon = platformIcon(post.platform);
              return (
                <div key={post._id} className="flex gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:shadow-sm transition">
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {post.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Icon className="w-5 h-5" style={{ color: platformColor(post.platform) }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 line-clamp-1 mb-1">
                      {post.content || <span className="italic text-slate-400">ไม่มีข้อความ</span>}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {formatNumber(post.analytics.impressions)}</span>
                      <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" /> {formatNumber(post.analytics.likes)}</span>
                      <span className="flex items-center gap-0.5"><MessageCircle className="w-3 h-3" /> {formatNumber(post.analytics.comments)}</span>
                      <span className="flex items-center gap-0.5"><Share2 className="w-3 h-3" /> {formatNumber(post.analytics.shares)}</span>
                      {post.analytics.engagementRate > 0 && (
                        <span className="flex items-center gap-0.5 text-emerald-600 font-medium">
                          <TrendingUp className="w-3 h-3" /> {post.analytics.engagementRate.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {post.platformPostUrl && (
                    <a
                      href={post.platformPostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-center p-1.5 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No data state */}
      {!overview && topPosts.length === 0 && dailyData.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">ยังไม่มีข้อมูล Analytics</p>
          <p className="text-xs mt-1">ลองโพสต์เนื้อหาผ่าน SyncSocial แล้วกลับมาดูข้อมูลที่นี่</p>
        </div>
      )}

      {/* Last sync */}
      {overview?.lastSync && (
        <p className="text-[10px] text-slate-300 text-center">
          ซิงค์ล่าสุด: {new Date(overview.lastSync).toLocaleString("th-TH")}
        </p>
      )}
    </div>
  );
}

// ---- Sub-components ----

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-slate-400">{icon}<span className="text-[11px] font-medium">{label}</span></div>
      <span className="text-xl font-bold text-slate-800">{formatNumber(value)}</span>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white border border-slate-50 rounded-lg p-2 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-sm font-bold text-slate-800">{formatNumber(value)}</div>
      <div className="text-[10px] text-slate-400">{label}</div>
    </div>
  );
}

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-600",  border: "border-indigo-100",  iconBg: "bg-indigo-100" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100",   iconBg: "bg-amber-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", iconBg: "bg-emerald-100" },
  blue:    { bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-100",    iconBg: "bg-blue-100" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-100",  iconBg: "bg-violet-100" },
  rose:    { bg: "bg-rose-50",    text: "text-rose-600",    border: "border-rose-100",    iconBg: "bg-rose-100" },
  green:   { bg: "bg-green-50",   text: "text-green-600",   border: "border-green-100",   iconBg: "bg-green-100" },
  purple:  { bg: "bg-purple-50",  text: "text-purple-600",  border: "border-purple-100",  iconBg: "bg-purple-100" },
  cyan:    { bg: "bg-cyan-50",    text: "text-cyan-600",    border: "border-cyan-100",    iconBg: "bg-cyan-100" },
};

function FeatureCard({ icon, color, title, desc }: { icon: React.ReactNode; color: string; title: string; desc: string }) {
  const c = COLOR_MAP[color] || COLOR_MAP.indigo;
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-4 hover:shadow-md transition-shadow`}>
      <div className={`w-10 h-10 rounded-xl ${c.iconBg} ${c.text} flex items-center justify-center mb-3`}>{icon}</div>
      <h4 className="text-sm font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-[13px] text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function GlowStatCard({ icon, color, label, value, suffix }: { icon: React.ReactNode; color: string; label: string; value: number; suffix?: string }) {
  const c = COLOR_MAP[color] || COLOR_MAP.indigo;
  return (
    <div className={`rounded-2xl border ${c.border} bg-white p-4 hover:shadow-md transition-shadow`}>
      <div className={`w-9 h-9 rounded-xl ${c.iconBg} ${c.text} flex items-center justify-center mb-2`}>{icon}</div>
      <div className="text-2xl font-extrabold text-slate-800 tracking-tight">{formatNumber(value)}{suffix && <span className="text-sm font-medium text-slate-400 ml-1">{suffix}</span>}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

function PillStat({ icon, color, label, value }: { icon: React.ReactNode; color: string; label: string; value: number }) {
  const c = COLOR_MAP[color] || COLOR_MAP.indigo;
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-2.5 text-center hover:shadow-sm transition-shadow`}>
      <div className={`flex justify-center mb-1 ${c.text}`}>{icon}</div>
      <div className="text-sm font-bold text-slate-800">{formatNumber(value)}</div>
      <div className="text-[10px] text-slate-500 font-medium">{label}</div>
    </div>
  );
}

function ValueItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-3 p-3 rounded-xl border border-slate-100 bg-white/80 hover:bg-white transition">
      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        <div className="text-[13px] text-slate-500 leading-relaxed mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

function ReachAreaChart({ data }: { data: DailyData[] }) {
  const W = 560, H = 140, PX = 32, PY = 16;
  const plotW = W - PX * 2, plotH = H - PY * 2;
  const maxR = Math.max(...data.map((d) => d.metrics.reach), 1);
  const points = data.map((d, i) => ({
    x: PX + (i / (data.length - 1)) * plotW,
    y: PY + plotH - (d.metrics.reach / maxR) * plotH,
    val: d.metrics.reach,
    day: new Date(d.date).getDate(),
  }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${points[points.length - 1].x},${PY + plotH} L${points[0].x},${PY + plotH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
        <g key={i}>
          <line x1={PX} y1={PY + plotH * (1 - r)} x2={PX + plotW} y2={PY + plotH * (1 - r)} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3,3" />
          <text x={PX - 4} y={PY + plotH * (1 - r) + 3} textAnchor="end" className="text-[8px] fill-slate-400">{formatNumber(Math.round(maxR * r))}</text>
        </g>
      ))}
      <path d={area} fill="url(#reachGrad)" />
      <path d={line} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="white" stroke="#8b5cf6" strokeWidth="1.5" />
          <text x={p.x} y={H - 2} textAnchor="middle" className="text-[8px] fill-slate-400 font-medium">{p.day}</text>
        </g>
      ))}
    </svg>
  );
}

function EngagementDonut({ totals }: { totals: { likes: number; comments: number; shares: number; saves: number; clicks: number; views: number } }) {
  const segments = [
    { label: "กดถูกใจ", value: totals.likes, color: "#f43f5e" },
    { label: "คอมเมนต์", value: totals.comments, color: "#3b82f6" },
    { label: "แชร์", value: totals.shares, color: "#22c55e" },
    { label: "บันทึก", value: totals.saves, color: "#f59e0b" },
    { label: "คลิก", value: totals.clicks, color: "#a855f7" },
  ];
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const R = 60, CX = 80, CY = 80, SW = 16;
  const circumference = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="w-32 h-32 shrink-0">
        {segments.map((seg, i) => {
          const pct = total > 0 ? seg.value / total : 0;
          const dash = pct * circumference;
          const gap = circumference - dash;
          const currentOffset = offset;
          offset += dash;
          return (
            <circle
              key={i}
              cx={CX} cy={CY} r={R}
              fill="none" stroke={seg.color} strokeWidth={SW}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${CX} ${CY})`}
            />
          );
        })}
        <text x={CX} y={CY - 4} textAnchor="middle" className="text-lg font-extrabold fill-slate-800">{formatNumber(total)}</text>
        <text x={CX} y={CY + 12} textAnchor="middle" className="text-[9px] fill-slate-400">รวมทั้งหมด</text>
      </svg>
      <div className="space-y-1.5 flex-1">
        {segments.map((seg) => {
          const pct = total > 0 ? ((seg.value / total) * 100).toFixed(1) : "0";
          return (
            <div key={seg.label} className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-slate-600 flex-1">{seg.label}</span>
              <span className="font-bold text-slate-800">{formatNumber(seg.value)}</span>
              <span className="text-slate-400 w-10 text-right">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EngagementLineChart({ data }: { data: DailyData[] }) {
  const W = 280, H = 140, PX = 8, PY = 16;
  const plotW = W - PX * 2, plotH = H - PY * 2;
  const rates = data.map((d) => {
    const totalEng = d.metrics.likes + d.metrics.comments + d.metrics.shares;
    return d.metrics.impressions > 0 ? (totalEng / d.metrics.impressions) * 100 : 0;
  });
  const maxRate = Math.max(...rates, 1);
  const points = rates.map((r, i) => ({
    x: PX + (i / (data.length - 1)) * plotW,
    y: PY + plotH - (r / maxRate) * plotH,
    val: r,
    day: new Date(data[i].date).getDate(),
  }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${points[points.length - 1].x},${PY + plotH} L${points[0].x},${PY + plotH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((r, i) => (
        <line key={i} x1={PX} y1={PY + plotH * (1 - r)} x2={PX + plotW} y2={PY + plotH * (1 - r)} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3,3" />
      ))}
      <path d={area} fill="url(#engGrad)" />
      <path d={line} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="white" stroke="#10b981" strokeWidth="1.5" />
          <text x={p.x} y={H - 2} textAnchor="middle" className="text-[7px] fill-slate-400">{p.day}</text>
        </g>
      ))}
      <text x={PX} y={PY - 4} className="text-[8px] fill-slate-400">{maxRate.toFixed(1)}%</text>
      <text x={PX} y={PY + plotH + 1} className="text-[8px] fill-slate-400">0%</text>
    </svg>
  );
}
