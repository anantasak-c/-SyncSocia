import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { listAccounts } from "@/lib/late";

export const dynamic = "force-dynamic";

// GET /api/accounts — List connected social accounts for the current user
export async function GET() {
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("late_profile_id")
      .eq("id", user.id)
      .single();

    if (!profile?.late_profile_id) {
      return NextResponse.json({ accounts: [] });
    }

    // GET /v1/accounts?profileId=...
    const data = await listAccounts(profile.late_profile_id);

    return NextResponse.json({ accounts: data.accounts });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
    console.error("Accounts error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
