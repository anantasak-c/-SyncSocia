const LATE_API_BASE =
  process.env.ZERNIO_API_BASE_URL ||
  process.env.LATE_API_BASE_URL?.replace("getlate.dev", "zernio.com") ||
  "https://zernio.com/api";
const LATE_API_KEY = process.env.ZERNIO_API_KEY || process.env.LATE_API_KEY!;

async function lateRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${LATE_API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${LATE_API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Zernio API error ${res.status}: ${body}`
    );
  }

  return res.json() as Promise<T>;
}

// POST /v1/profiles — Create a Late profile
export async function createLateProfile(name: string) {
  return lateRequest<{
    message: string;
    profile: {
      _id: string;
      userId: string;
      name: string;
      description?: string;
      color?: string;
      isDefault: boolean;
      createdAt: string;
    };
  }>("/v1/profiles", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

// GET /v1/connect/{platform} — Get OAuth URL
export async function getConnectUrl(
  platform: string,
  profileId: string,
  redirectUrl: string
) {
  const params = new URLSearchParams({
    profileId,
    redirect_url: redirectUrl,
  });
  return lateRequest<{ authUrl: string; state: string }>(
    `/v1/connect/${platform}?${params.toString()}`,
    { method: "GET" }
  );
}

// GET /v1/accounts — List connected accounts
export async function listAccounts(profileId: string) {
  const params = new URLSearchParams({ profileId });
  return lateRequest<{
    accounts: Array<{
      _id: string;
      platform: string;
      profileId: { _id: string; name: string; slug: string };
      username: string;
      displayName: string;
      profileUrl?: string;
      isActive: boolean;
    }>;
    hasAnalyticsAccess: boolean;
  }>(`/v1/accounts?${params.toString()}`, { method: "GET" });
}

// ---------- Analytics ----------

// GET /v1/analytics — Post analytics (overview or single post)
export async function getAnalytics(params: {
  profileId?: string;
  platform?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  order?: string;
  limit?: number;
  page?: number;
  source?: string;
}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) qs.set(k, String(v));
  });
  return lateRequest<{
    overview: {
      totalPosts: number;
      publishedPosts: number;
      scheduledPosts: number;
      lastSync: string | null;
      dataStaleness: { staleAccountCount: number; syncTriggered: boolean };
    };
    posts: Array<{
      _id: string;
      latePostId: string | null;
      content: string;
      scheduledFor: string;
      publishedAt: string;
      status: string;
      analytics: {
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
      };
      platforms: Array<{
        platform: string;
        status: string;
        accountId: string;
        accountUsername: string | null;
        analytics: {
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
        } | null;
        syncStatus: string;
        platformPostUrl: string | null;
        errorMessage: string | null;
      }>;
      platform: string;
      platformPostUrl: string;
      isExternal: boolean;
      thumbnailUrl: string;
      mediaType: string;
    }>;
    pagination: { page: number; limit: number; total: number; pages: number };
    hasAnalyticsAccess: boolean;
  }>(`/v1/analytics?${qs.toString()}`, { method: "GET" });
}

// GET /v1/analytics/daily-metrics
export async function getDailyMetrics(params: {
  platform?: string;
  profileId?: string;
  fromDate?: string;
  toDate?: string;
  source?: string;
}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) qs.set(k, String(v));
  });
  return lateRequest<{
    dailyData: Array<{
      date: string;
      postCount: number;
      platforms: Record<string, number>;
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
    }>;
    platformBreakdown: Array<{
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
    }>;
  }>(`/v1/analytics/daily-metrics?${qs.toString()}`, { method: "GET" });
}

// GET /v1/analytics/best-time
export async function getBestTimeToPost(params: {
  platform?: string;
  profileId?: string;
  source?: string;
}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) qs.set(k, String(v));
  });
  return lateRequest<{
    slots: Array<{
      day_of_week: number;
      hour: number;
      avg_engagement: number;
      post_count: number;
    }>;
  }>(`/v1/analytics/best-time?${qs.toString()}`, { method: "GET" });
}

// GET /v1/analytics/posting-frequency
export async function getPostingFrequency(params: {
  platform?: string;
  profileId?: string;
  source?: string;
}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) qs.set(k, String(v));
  });
  return lateRequest<{
    frequency: Array<{
      platform: string;
      posts_per_week: number;
      avg_engagement_rate: number;
      avg_engagement: number;
      weeks_count: number;
    }>;
  }>(`/v1/analytics/posting-frequency?${qs.toString()}`, { method: "GET" });
}

// GET /v1/analytics/content-decay
export async function getContentDecay(params: {
  platform?: string;
  profileId?: string;
  source?: string;
}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) qs.set(k, String(v));
  });
  return lateRequest<{
    buckets: Array<{
      bucket_order: number;
      bucket_label: string;
      avg_pct_of_final: number;
      post_count: number;
    }>;
  }>(`/v1/analytics/content-decay?${qs.toString()}`, { method: "GET" });
}

// POST /v1/posts — Create & publish a post
export async function createPost(body: {
  content: string;
  platforms: Array<{
    platform: string;
    accountId: string;
  }>;
  mediaItems?: Array<{
    type: "image" | "video";
    url: string;
  }>;
  tiktokSettings?: {
    privacyLevel: "PUBLIC_TO_EVERYONE" | "MUTUAL_FOLLOW_FRIENDS" | "SELF_ONLY";
    allowComment: boolean;
    allowDuet: boolean;
    allowStitch: boolean;
  };
  publishNow: boolean;
}) {
  return lateRequest<{
    post: {
      _id: string;
      content: string;
      status: string;
      platforms: Array<{
        platform: string;
        status: string;
        platformPostUrl?: string;
      }>;
    };
    message: string;
  }>("/v1/posts", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
