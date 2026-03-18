import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getConnectUrl } from "@/lib/late";

export const dynamic = "force-dynamic";

// GET /api/connect?platform=facebook
// Returns the Late OAuth URL for the given platform
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "ไม่ได้เข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    const platform = request.nextUrl.searchParams.get("platform");
    if (!platform) {
      return NextResponse.json(
        { error: "กรุณาระบุแพลตฟอร์ม" },
        { status: 400 }
      );
    }

    const validPlatforms = [
      "facebook",
      "instagram",
      "twitter",
      "linkedin",
      "tiktok",
      "youtube",
      "threads",
      "reddit",
      "pinterest",
      "bluesky",
      "googlebusiness",
      "telegram",
      "snapchat",
    ];

    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: "แพลตฟอร์มไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // Get the user's late_profile_id from Supabase
    const { data: profile } = await supabase
      .from("profiles")
      .select("late_profile_id")
      .eq("id", user.id)
      .single();

    if (!profile?.late_profile_id) {
      return NextResponse.json(
        { error: "ยังไม่มีโปรไฟล์ กรุณาลองใหม่อีกครั้ง" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectUrl = `${appUrl}/?connected=${platform}`;

    // GET /v1/connect/{platform}?profileId=...&redirect_url=...
    const data = await getConnectUrl(
      platform,
      profile.late_profile_id,
      redirectUrl
    );

    return NextResponse.json({ authUrl: data.authUrl });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
    console.error("Connect error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
