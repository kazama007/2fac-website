import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from("ads_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (!data) return NextResponse.json(null);

    return NextResponse.json({
      publisherId: data.publisher_id || "",
      headerAdSlot: data.header_ad_slot || "",
      footerAdSlot: data.footer_ad_slot || "",
      sidebarAdSlot: data.sidebar_ad_slot || "",
      inArticleAdSlot: data.in_article_ad_slot || "",
      adsEnabled: data.ads_enabled || false,
    }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json(null);
  }
}
