"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Navbar, Footer } from "../../shared";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  coverImage?: string;
}

function DotsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const DOT_SPACING = 28, DOT_RADIUS = 1.2;
    const mouse = { x: -999, y: -999 };
    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouseMove);
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / DOT_SPACING) + 1;
      const rows = Math.ceil(height / DOT_SPACING) + 1;
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const x = col * DOT_SPACING, y = row * DOT_SPACING;
          const dx = mouse.x - x, dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const intensity = 1 - dist / 100;
            ctx.beginPath(); ctx.arc(x, y, DOT_RADIUS + intensity * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124,58,237,${0.3 + intensity * 0.5})`; ctx.fill();
          } else {
            ctx.beginPath(); ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(148,163,184,0.25)"; ctx.fill();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    const onResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}

const getCategoryColor = (cat: string) => {
  const colors: { [key: string]: string } = { Security: "#ef4444", Authentication: "#7c3aed", Password: "#3b82f6", Developer: "#22c55e", Tutorial: "#f59e0b", News: "#06b6d4" };
  return colors[cat] || "#7c3aed";
};

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("blog-posts");
    if (saved) {
      const posts: BlogPost[] = JSON.parse(saved);
      const found = posts.find(p => p.slug === params.slug && p.published);
      if (found) {
        setPost(found);
        setRelated(posts.filter(p => p.id !== found.id && p.published && p.category === found.category).slice(0, 3));
      } else setNotFound(true);
    } else setNotFound(true);
  }, [params.slug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (notFound) {
    return (
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", color: "#1a1a2e", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
          <h1 style={{ fontSize: "24px", marginBottom: "12px", color: "#1e293b" }}>Post not found</h1>
          <a href="/blog" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: "500" }}>← Back to Blog</a>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#64748b" }}>Loading...</div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", color: "#1a1a2e", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />

      <style>{`
        .blog-content img { max-width: 100%; border-radius: 12px; margin: 16px 0; display: block; }
        .blog-content h1 { font-size: 28px; font-weight: 800; color: #1e293b; margin: 28px 0 12px; }
        .blog-content h2 { font-size: 22px; font-weight: 700; color: #1e293b; margin: 24px 0 10px; padding-bottom: 8px; border-bottom: 2px solid rgba(124,58,237,0.15); }
        .blog-content h3 { font-size: 18px; font-weight: 600; color: #1e293b; margin: 18px 0 8px; }
        .blog-content h4 { font-size: 16px; font-weight: 600; color: #1e293b; margin: 14px 0 6px; }
        .blog-content p { margin: 12px 0; color: #64748b; line-height: 1.8; font-size: 15px; }
        .blog-content ul, .blog-content ol { margin: 12px 0; padding-left: 24px; color: #64748b; }
        .blog-content li { margin: 6px 0; line-height: 1.8; font-size: 15px; }
        .blog-content strong { color: #1e293b; font-weight: 700; }
        .blog-content em { color: #64748b; font-style: italic; }
        .blog-content a { color: #7c3aed; text-decoration: underline; }
        .blog-content blockquote { border-left: 4px solid #7c3aed; padding-left: 16px; margin: 20px 0; color: #94a3b8; font-style: italic; background: rgba(124,58,237,0.04); padding: 12px 16px; border-radius: 0 8px 8px 0; }
        .blog-content code { background: rgba(124,58,237,0.08); color: #7c3aed; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 14px; }
        .blog-content pre { background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 12px; overflow-x: auto; margin: 16px 0; }
        .blog-content table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .blog-content th, .blog-content td { padding: 10px 14px; border: 1px solid #e2e8f0; text-align: left; font-size: 14px; }
        .blog-content th { background: rgba(124,58,237,0.06); color: #7c3aed; font-weight: 600; }
        .blog-content hr { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
      `}</style>

      <Navbar />

      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", position: "relative", zIndex: 1 }}>

        {/* Back */}
        <a href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#7c3aed", textDecoration: "none", fontSize: "14px", marginBottom: "28px", padding: "8px 14px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "8px", fontWeight: "500" }}>
          ← Back to Blog
        </a>

        {/* Post Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "10px", background: `${getCategoryColor(post.category)}12`, color: getCategoryColor(post.category), fontWeight: "600" }}>
              {post.category}
            </span>
            <span style={{ fontSize: "13px", color: "#94a3b8" }}>{post.createdAt}</span>
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", lineHeight: "1.3", marginBottom: "16px", color: "#1e293b" }}>
            {post.title}
          </h1>
          <p style={{ fontSize: "16px", color: "#64748b", lineHeight: "1.7" }}>{post.excerpt}</p>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div style={{ marginBottom: "32px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 30px rgba(124,58,237,0.12)" }}>
            <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "400px", objectFit: "cover", display: "block" }} />
          </div>
        )}

        {/* Content Card */}
        <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "20px", padding: "40px", boxShadow: "0 4px 24px rgba(124,58,237,0.06)", marginBottom: "32px" }}>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Share */}
        <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "16px", padding: "24px", textAlign: "center", marginBottom: "40px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "14px", fontWeight: "500" }}>Found this helpful? Share it!</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://2fa.ac/blog/${post.slug}`)}`} target="_blank"
              style={{ padding: "8px 18px", background: "rgba(29,161,242,0.08)", color: "#1da1f2", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "600", border: "1px solid rgba(29,161,242,0.2)" }}>
              𝕏 Share on Twitter
            </a>
            <button onClick={handleCopy}
              style={{ padding: "8px 18px", background: copied ? "rgba(34,197,94,0.1)" : "rgba(124,58,237,0.08)", color: copied ? "#16a34a" : "#7c3aed", border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(124,58,237,0.2)"}`, borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
              {copied ? "✓ Copied!" : "🔗 Copy Link"}
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px", color: "#1e293b" }}>Related Posts</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
              {related.map(p => (
                <a key={p.id} href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "12px", padding: "18px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "transform 0.2s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"}
                  >
                    <span style={{ fontSize: "11px", color: getCategoryColor(p.category), fontWeight: "600" }}>{p.category}</span>
                    <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", margin: "8px 0 6px", lineHeight: "1.4" }}>{p.title}</h4>
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{p.createdAt}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}