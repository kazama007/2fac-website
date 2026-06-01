import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://2fa.ac";
  const today = new Date().toISOString().split("T")[0];

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: today, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: today, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/tools`, lastModified: today, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/tools/qr-generator`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/password-generator`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/password-strength`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/password-breach`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/jwt-decoder`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/hash-generator`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/uuid-generator`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/base64`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/json-formatter`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/link-checker`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/dns-lookup`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/ip-lookup`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/whois-lookup`, lastModified: "2026-05-01", changeFrequency: "monthly", priority: 0.8 },
  ];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });

    const blogPages: MetadataRoute.Sitemap = (posts || []).map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.created_at).toISOString().split("T")[0],
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticPages, ...blogPages];
  } catch {
    return staticPages;
  }
}
