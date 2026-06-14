import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// ─── Server-side admin API ───────────────────────────────────────────────────
// Password is checked ON THE SERVER. Set ADMIN_PASSWORD in Vercel env vars.
// Falls back to the legacy password so nothing breaks before the env var is set.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Kazama#007";

// Service key bypasses RLS for writes. Falls back to anon key so the
// admin keeps working until RLS is enabled in Supabase.
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const pass = req.headers.get("x-admin-password");
  if (pass !== ADMIN_PASSWORD) return unauthorized();

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action, payload } = body || {};
  const supabase = getSupabase();

  try {
    switch (action) {
      // Login check — header already verified above
      case "auth":
        return NextResponse.json({ ok: true });

      case "createPost": {
        const { error } = await supabase.from("blog_posts").insert([payload]);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true });
      }

      case "updatePost": {
        const { id, ...fields } = payload;
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
        const { error } = await supabase.from("blog_posts").update(fields).eq("id", id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true });
      }

      case "deletePost": {
        if (!payload?.id) return NextResponse.json({ error: "id required" }, { status: 400 });
        const { error } = await supabase.from("blog_posts").delete().eq("id", payload.id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true });
      }

      case "saveAds": {
        const { error } = await supabase.from("ads_settings").upsert({
          id: 1,
          publisher_id: payload.publisherId,
          header_ad_slot: payload.headerAdSlot,
          footer_ad_slot: payload.footerAdSlot,
          sidebar_ad_slot: payload.sidebarAdSlot,
          in_article_ad_slot: payload.inArticleAdSlot,
          ads_enabled: payload.adsEnabled,
        });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
