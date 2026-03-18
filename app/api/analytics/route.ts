import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  getAnalytics,
  getDailyMetrics,
  getBestTimeToPost,
  getPostingFrequency,
  getContentDecay,
} from "@/lib/late";

export const dynamic = "force-dynamic";

// GET /api/analytics?type=overview|daily|besttime|frequency|decay
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get profileId from Supabase
    const { data: profile } = await supabase
      .from("profiles")
      .select("late_profile_id")
      .eq("id", user.id)
      .single();

    const profileId = profile?.late_profile_id;
    if (!profileId) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "overview";
    const platform = searchParams.get("platform") || undefined;

    switch (type) {
      case "overview": {
        const data = await getAnalytics({
          profileId,
          platform,
          limit: 10,
          sortBy: "date",
          order: "desc",
        });
        return NextResponse.json(data);
      }

      case "daily": {
        const data = await getDailyMetrics({
          profileId,
          platform,
        });
        return NextResponse.json(data);
      }

      case "besttime": {
        const data = await getBestTimeToPost({
          profileId,
          platform,
        });
        return NextResponse.json(data);
      }

      case "frequency": {
        const data = await getPostingFrequency({
          profileId,
          platform,
        });
        return NextResponse.json(data);
      }

      case "decay": {
        const data = await getContentDecay({
          profileId,
          platform,
        });
        return NextResponse.json(data);
      }

      default:
        return NextResponse.json(
          { error: "Invalid analytics type" },
          { status: 400 }
        );
    }
  } catch (err: unknown) {
    console.error("Analytics error:", err);

    const errMsg =
      err instanceof Error ? err.message : "Internal Server Error";
    if (
      errMsg.includes("402") ||
      errMsg.includes("Analytics add-on required") ||
      errMsg.includes("requiresAddon")
    ) {
      return NextResponse.json(
        {
          error: "Analytics add-on required",
          code: "analytics_addon_required",
        },
        { status: 402 }
      );
    }

    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
