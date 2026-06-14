import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { TOOLS } from "./lib/tools-list";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Revalidate every hour so new blog posts appear in sitemap quickly
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://2fa.ac";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Tool pages — automatically from central list
  const toolPages: MetadataRoute.Sitemap = TOOLS
    .filter(t => t.href !== "/") // skip homepage (2FA generator)
    .map(t => ({
      url: `${baseUrl}${t.href}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: t.sitemapPriority || 0.8,
    }));

  // Dynamic blog posts from Supabase
  try {
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, created_at, updated_at")
      .eq("published", true)
      .order("created_at", { ascending: false });

    const blogPages: MetadataRoute.Sitemap = (posts || []).map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticPages, ...toolPages, ...blogPages];
  } catch {
    return [...staticPages, ...toolPages];
  }
}