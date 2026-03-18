"use client";

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
} from "lucide-react";

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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={className} style={{ ...style, fill: "currentColor" }}>
      <path d="M448 209.9a210.1 210.1 0 0 1-122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a90.9 90.9 0 1 0-43 79.8h73.9V53.8a40.7 40.7 0 0 1 42.1-40.4 282.1 282.1 0 0 0 88.3 14 401.4 401.4 0 0 0 101.6-19.8v72.3z" />
    </svg>
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

export function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addonRequired, setAddonRequired] = useState(false);
  const [showShowcase, setShowShowcase] = useState(false);

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
    fetchAll();
  }, [fetchAll]);

  // ---- Loading ----
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <span className="ml-3 text-slate-500">กำลังโหลด Analytics...</span>
      </div>
    );
  }

  // ---- Add-on Required ----
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

    return (
      <div className="space-y-6">
        <div className="py-8 px-5 bg-gradient-to-br from-amber-50 via-white to-primary-50 rounded-2xl border border-amber-200">
          <div className="max-w-3xl mx-auto text-center">
            <BarChart3 className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Analytics กำลังจะเปิดขายใน SyncSocial</h3>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              ตอนนี้ยังเป็นตัวอย่างหน้ารายงาน แต่คุณสามารถใช้หน้านี้เป็นโชว์เคสให้ลูกค้าเห็นได้ทันทีว่า
              จะรู้ยอดรวม, เห็นแพลตฟอร์มที่คุ้ม, และรู้เวลาโพสต์ที่เหมาะที่สุด
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs sm:text-sm text-slate-600">
              <span className="px-3 py-1 rounded-full bg-white border border-slate-200">ดูยอดรวมในหน้าเดียว</span>
              <span className="px-3 py-1 rounded-full bg-white border border-slate-200">รู้เวลาโพสต์ที่ควรลง</span>
              <span className="px-3 py-1 rounded-full bg-white border border-slate-200">เห็นชัดว่าแพลตฟอร์มไหนทำเงิน</span>
            </div>
            <button
              onClick={() => setShowShowcase((prev) => !prev)}
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition"
            >
              ดูตัวอย่าง <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showShowcase && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <ShowcaseCard
                icon={<Eye className="w-5 h-5 text-primary-500" />}
                title="ลูกค้าเห็นยอดที่สำคัญทันที"
                description="ไม่ต้องเปิดหลายแอปเพื่อไล่ดู Reach, Click และ Engagement ทีละช่องทาง"
              />
              <ShowcaseCard
                icon={<Clock className="w-5 h-5 text-amber-500" />}
                title="รู้เวลาโพสต์ที่คุ้มที่สุด"
                description="ช่วยตัดสินใจง่ายขึ้นว่าโพสต์ช่วงไหนแล้วคนเห็นมาก คนมีโอกาสทักหรือคลิกมากกว่า"
              />
              <ShowcaseCard
                icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
                title="เห็นว่าควรทุ่มแพลตฟอร์มไหน"
                description="เทียบผลลัพธ์แต่ละช่องทางได้ชัดเจน เพื่อวางแผนงบและเวลาให้คุ้มขึ้น"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={<BarChart3 className="w-4 h-4" />} label="โพสต์ทั้งหมด" value={SHOWCASE_OVERVIEW.totalPosts} />
              <StatCard icon={<Eye className="w-4 h-4" />} label="Impressions" value={showcaseTotals.impressions} />
              <StatCard icon={<Users className="w-4 h-4" />} label="Reach" value={showcaseTotals.reach} />
              <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Engagement" value={showcaseTotals.likes + showcaseTotals.comments + showcaseTotals.shares} />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <MiniStat icon={<Heart className="w-3.5 h-3.5 text-red-500" />} label="Likes" value={showcaseTotals.likes} />
              <MiniStat icon={<MessageCircle className="w-3.5 h-3.5 text-blue-500" />} label="Comments" value={showcaseTotals.comments} />
              <MiniStat icon={<Share2 className="w-3.5 h-3.5 text-green-500" />} label="Shares" value={showcaseTotals.shares} />
              <MiniStat icon={<Bookmark className="w-3.5 h-3.5 text-amber-500" />} label="Saves" value={showcaseTotals.saves} />
              <MiniStat icon={<MousePointerClick className="w-3.5 h-3.5 text-purple-500" />} label="Clicks" value={showcaseTotals.clicks} />
              <MiniStat icon={<Eye className="w-3.5 h-3.5 text-cyan-500" />} label="Views" value={showcaseTotals.views} />
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">ตัวอย่างกราฟยอดเห็นโพสต์ (14 วันล่าสุด)</h3>
              <div className="flex items-end gap-1 h-24">
                {SHOWCASE_DAILY_DATA.slice(-14).map((d, i) => {
                  const h = Math.max((d.metrics.impressions / showcaseMaxImpressions) * 100, 2);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="w-full bg-primary-400 rounded-t hover:bg-primary-500 transition-colors cursor-default" style={{ height: `${h}%` }} />
                      <span className="text-[9px] text-slate-400">{new Date(d.date).getDate()}</span>
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-10">
                        {d.date}: {formatNumber(d.metrics.impressions)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-100 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">ลูกค้าจะเห็นอะไรบ้าง</h3>
                <div className="space-y-3">
                  <ShowcaseListItem title="สรุปผลรวมรายสัปดาห์และรายเดือน" description="เห็นว่าโพสต์ทั้งหมดสร้าง Reach, Click และ Engagement ได้มากแค่ไหน" />
                  <ShowcaseListItem title="เปรียบเทียบแต่ละแพลตฟอร์ม" description="รู้เลยว่า Facebook, Instagram หรือ TikTok ตัวไหนคุ้มกับเวลาที่ลงไป" />
                  <ShowcaseListItem title="แนะนำเวลาโพสต์ที่เหมาะ" description="ช่วยให้ทีมไม่ต้องเดาเอง และเลือกเวลาที่มีโอกาสได้ผลดีกว่า" />
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" /> เวลาโพสต์ที่ดีที่สุด
                </h3>
                <div className="space-y-2">
                  {SHOWCASE_BEST_TIMES.map((slot, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-lg font-bold text-primary-600 w-7 text-center">#{i + 1}</span>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-slate-700">
                          {DAY_LABELS[slot.day_of_week]} {String(slot.hour).padStart(2, "0")}:00 น.
                        </span>
                        <span className="text-xs text-slate-400 ml-2">({slot.post_count} โพสต์)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-emerald-600">{formatNumber(Math.round(slot.avg_engagement))}</span>
                        <span className="text-[10px] text-slate-400 ml-1">avg eng.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">แยกตามแพลตฟอร์ม</h3>
              <div className="space-y-3">
                {SHOWCASE_PLATFORM_BREAKDOWN.map((pb) => {
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
                        <div className="flex gap-3 text-[11px] text-slate-500 flex-wrap">
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

            <div className="bg-white border border-slate-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">ตัวอย่างโพสต์ที่ทำผลงานดี</h3>
              <div className="space-y-3">
                {SHOWCASE_TOP_POSTS.map((post) => {
                  const Icon = platformIcon(post.platform);
                  return (
                    <div key={post._id} className="flex gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:shadow-sm transition">
                      <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <Icon className="w-5 h-5" style={{ color: platformColor(post.platform) }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 line-clamp-2 mb-1">{post.content}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {formatNumber(post.analytics.impressions)}</span>
                          <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" /> {formatNumber(post.analytics.likes)}</span>
                          <span className="flex items-center gap-0.5"><MessageCircle className="w-3 h-3" /> {formatNumber(post.analytics.comments)}</span>
                          <span className="flex items-center gap-0.5"><Share2 className="w-3 h-3" /> {formatNumber(post.analytics.shares)}</span>
                          <span className="flex items-center gap-0.5 text-emerald-600 font-medium"><TrendingUp className="w-3 h-3" /> {post.analytics.engagementRate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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

function ShowcaseCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">{icon}</div>
      <h4 className="text-sm font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 leading-6">{description}</p>
    </div>
  );
}

function ShowcaseListItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="text-sm font-semibold text-slate-800">{title}</div>
      <div className="text-sm text-slate-500 mt-1">{description}</div>
    </div>
  );
}
