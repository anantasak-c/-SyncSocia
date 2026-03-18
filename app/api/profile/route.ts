import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createLateProfile } from "@/lib/late";

export const dynamic = "force-dynamic";

// GET /api/profile - Get user profile details
export async function GET() {
  try {
    const supabase = createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("line_access_token, late_profile_id")
      .eq("id", user.id)
      .single();

    if (error) {
       // If profile doesn't exist yet, return nulls but don't error out
       if (error.code === 'PGRST116') {
         return NextResponse.json({ profile: { line_access_token: null, late_profile_id: null } });
       }
       throw error;
    }

    return NextResponse.json({ profile });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update user profile (e.g. LINE token)
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { line_access_token } = body;

    // First ensure profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    let error;
    if (!existingProfile) {
      // Create profile if not exists
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({ id: user.id, email: user.email, line_access_token });
      error = insertError;
    } else {
      // Update
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ line_access_token })
        .eq("id", user.id);
      error = updateError;
    }

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/profile — Ensure Late profile exists (Legacy support + Late init)
export async function POST() {
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

    // Check if user already has a late_profile_id
    const { data: profile } = await supabase
      .from("profiles")
      .select("late_profile_id")
      .eq("id", user.id)
      .single();

    if (profile?.late_profile_id) {
      return NextResponse.json({
        late_profile_id: profile.late_profile_id,
      });
    }

    // POST /v1/profiles — create a new Late profile
    const lateResult = await createLateProfile(
      user.email || "SyncSocial User"
    );
    const lateProfileId = lateResult.profile._id;

    // Save the late_profile_id to Supabase
    // Upsert to ensure profile exists
    const { error } = await supabase
      .from("profiles")
      .upsert({ 
        id: user.id, 
        email: user.email,
        late_profile_id: lateProfileId 
      }, { onConflict: 'id' });
      
    if (error) throw error;

    return NextResponse.json({ late_profile_id: lateProfileId });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
    console.error("Profile error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
