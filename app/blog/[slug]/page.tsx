import { Navbar, Footer } from "../../shared";
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
    .select("title, seo_title, seo_description, excerpt")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) return { title: "Post Not Found | 2FA.ac" };

  return {
    title: post.seo_title || post.title + " | 2FA.ac",
    description: post.seo_description || post.excerpt,
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

  if (!postData) {
    return (
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f0f4ff,#faf5ff,#f0f9ff)", fontFamily: "Inter,sans-serif" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: "60px" }}>📄</div>
          <h1 style={{ color: "#1e293b" }}>Article Not Found</h1>
          <a href="/blog" style={{ background: "#7c3aed", color: "white", padding: "12px 28px", borderRadius: "10px", textDecoration: "none" }}>Back to Blog</a>
        </div>
        <Footer />
      </main>
    );
  }

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