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
    return (
      <div className="text-center py-12 bg-amber-50/50 rounded-2xl border border-amber-200">
        <BarChart3 className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">ต้องการ Analytics Add-on</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          ฟีเจอร์ Analytics จะเปิดใช้งานภายหลัง ติดตามได้เลย!! 
        </p>
        <a
          href="https://sync-socia.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition"
        >
          ติดต่อ <ArrowUpRight className="w-4 h-4" />
        </a>
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
