import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import SlugClient from "./SlugClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, seo_title, seo_description, excerpt, cover_image")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) return { title: "Post Not Found | 2FA.ac" };

  const title = post.seo_title || post.title + " | 2FA.ac";
  const description = post.seo_description || post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://2fa.ac/blog/${slug}`,
      siteName: "2FA.ac",
      images: post.cover_image ? [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: postData } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  const { data: allPosts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, category, excerpt, cover_image, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (!postData) notFound();

  // Map DB fields
  const post = {
    ...postData,
    createdAt: postData.created_at,
    coverImage: postData.cover_image,
    relatedTools: postData.related_tools || [],
    relatedArticles: postData.related_articles || [],
    worksWith: postData.works_with || [],
    faqs: postData.faqs || [],
    seoTitle: postData.seo_title,
    seoDescription: postData.seo_description,
    authorName: postData.author_name || "2FA.AC Team",
    authorAvatar: postData.author_avatar,
    ctaTitle: postData.cta_title,
    ctaDesc: postData.cta_desc,
    ctaButton: postData.cta_button,
    ctaLink: postData.cta_link,
    newsletterTitle: postData.newsletter_title,
    newsletterDesc: postData.newsletter_desc,
  };

  const mappedPosts = (allPosts || []).map(p => ({
    ...p,
    createdAt: p.created_at,
    coverImage: p.cover_image,
  }));

  return <SlugClient post={post} allPosts={mappedPosts} slug={slug} />;
}