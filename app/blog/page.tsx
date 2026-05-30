import { createClient } from "@supabase/supabase-js";
import BlogClient from "./BlogClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 60;

export default async function BlogPage() {
  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, slug, category, excerpt, cover_image, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return <BlogClient initialPosts={data || []} />;
}
