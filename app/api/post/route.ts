import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createPost } from "@/lib/late";

export const dynamic = "force-dynamic";

// POST /api/post
// Body: { content: string, platforms: [{ platform: string, accountId: string }] }
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { content, platforms, mediaItems, tiktokSettings } = body as {
      content: string;
      platforms: Array<{ platform: string; accountId: string }>;
      mediaItems?: Array<{ type: "image" | "video"; url: string }>;
      tiktokSettings?: {
        privacyLevel: "PUBLIC_TO_EVERYONE" | "MUTUAL_FOLLOW_FRIENDS" | "SELF_ONLY";
        allowComment: boolean;
        allowDuet: boolean;
        allowStitch: boolean;
      };
    };

    // Validation
    if ((!content || !content.trim()) && (!mediaItems || mediaItems.length === 0)) {
      return NextResponse.json(
        { error: "กรุณาเขียนข้อความหรือแนบรูป/วิดีโอ" },
        { status: 400 }
      );
    }

    if (!platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "กรุณาเลือกอย่างน้อย 1 แพลตฟอร์ม" },
        { status: 400 }
      );
    }

    // Separate platforms
    const latePlatforms = platforms.filter(p => p.platform !== "line");
    const isLineSelected = platforms.some(p => p.platform === "line");

    const results = {
      late: null as any,
      line: null as any,
      errors: [] as string[]
    };

    // 1. Execute Late API (if applicable)
    if (latePlatforms.length > 0) {
      try {
        const lateData = await createPost({
          content: content ? content.trim() : "",
          platforms: latePlatforms.map((p) => ({
            platform: p.platform,
            accountId: p.accountId,
          })),
          mediaItems,
          tiktokSettings,
          publishNow: true,
        });
        results.late = lateData;
      } catch (e: any) {
        console.error("Late API Error:", e);
        results.errors.push(`Late API: ${e.message}`);
      }
    }

    // 2. Execute LINE OA Broadcast (if applicable)
    if (isLineSelected) {
      try {
        // Fetch User's LINE Token
        const { data: profile } = await supabase
          .from("profiles")
          .select("line_access_token")
          .eq("id", user.id)
          .single();

        if (!profile?.line_access_token) {
          throw new Error("LINE Access Token not found. Please configure it in settings.");
        }

        // Construct LINE Messages
        const messages = [];

        // Text Message
        if (content && content.trim()) {
          messages.push({
            type: "text",
            text: content.trim()
          });
        }

        // Media Messages
        if (mediaItems && mediaItems.length > 0) {
          for (const item of mediaItems) {
            // LINE limit: 5 messages total. Stop if we reach it.
            if (messages.length >= 5) break;

            if (item.type === "image") {
              messages.push({
                type: "image",
                originalContentUrl: item.url,
                previewImageUrl: item.url // Use same URL for preview
              });
            } else if (item.type === "video") {
               // For video, we need a preview image. Since we don't have one easily,
               // we will send it as a text link for now to ensure delivery.
               messages.push({
                 type: "text",
                 text: `Video: ${item.url}`
               });
            }
          }
        }

        if (messages.length === 0) {
            throw new Error("No content to send to LINE");
        }

        // Call LINE API
        const lineRes = await fetch("https://api.line.me/v2/bot/message/broadcast", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${profile.line_access_token}`
          },
          body: JSON.stringify({ messages })
        });

        if (!lineRes.ok) {
           const errBody = await lineRes.text();
           throw new Error(`LINE API responded with ${lineRes.status}: ${errBody}`);
        }

        results.line = { success: true };

      } catch (e: any) {
        console.error("LINE API Error:", e);
        results.errors.push(`LINE: ${e.message}`);
      }
    }

    // Response Handling
    const finalStatus = results.errors.length === 0 
      ? 'success' 
      : (results.late || results.line ? 'partial' : 'failed');

    // Save to History (Fire and forget, or await if critical)
    try {
      await supabase.from("posts").insert({
        user_id: user.id,
        content: content,
        media_urls: mediaItems?.map((m) => m.url) || [],
        platforms: platforms.map((p) => p.platform),
        status: finalStatus,
      });
    } catch (saveError) {
      console.error("Failed to save post history:", saveError);
    }

    // If all failed
    if (finalStatus === 'failed') {
       return NextResponse.json({ 
         success: false, 
         error: results.errors.join(", ") 
       }, { status: 500 });
    }

    // Partial or Full Success
    return NextResponse.json({
      success: true,
      message: results.errors.length > 0 
        ? "โพสต์บางรายการสำเร็จ แต่บางรายการล้มเหลว" 
        : "โพสต์สำเร็จแล้ว!",
      details: results
    });

  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
    console.error("Post error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
