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
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let width = canvas.width = window.innerWidth, height = canvas.height = window.innerHeight;
    const DOT_SPACING = 28, DOT_RADIUS = 1.2, mouse = { x: -999, y: -999 };
    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouseMove);
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / DOT_SPACING) + 1, rows = Math.ceil(height / DOT_SPACING) + 1;
      for (let col = 0; col < cols; col++) for (let row = 0; row < rows; row++) {
        const x = col * DOT_SPACING, y = row * DOT_SPACING, dx = mouse.x - x, dy = mouse.y - y, dist = Math.sqrt(dx*dx+dy*dy);
        ctx.beginPath(); ctx.arc(x, y, dist < 100 ? DOT_RADIUS + (1-dist/100)*1.2 : DOT_RADIUS, 0, Math.PI*2);
        ctx.fillStyle = dist < 100 ? `rgba(124,58,237,${0.3+(1-dist/100)*0.5})` : "rgba(148,163,184,0.25)"; ctx.fill();
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

function extractHeadings(content: string) {
  const headings: { level: number; text: string; id: string }[] = [];
  const regex = /<h([1-3])[^>]*>(.*?)<\/h[1-3]>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const text = match[2].replace(/<[^>]+>/g, "");
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    headings.push({ level: parseInt(match[1]), text, id });
  }
  return headings;
}

function addHeadingIds(content: string) {
  return content.replace(/<h([1-3])([^>]*)>(.*?)<\/h[1-3]>/gi, (_, level, attrs, text) => {
    const cleanText = text.replace(/<[^>]+>/g, "");
    const id = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
  });
}

const relatedArticles = [
  { title: "How to Create Strong Passwords That Hacker Can't Crack", date: "May 20, 2025", emoji: "🔑" },
  { title: "Best Authenticator Apps in 2025 (Compared)", date: "May 18, 2025", emoji: "📱" },
  { title: "How to Set Up Google Authenticator", date: "May 15, 2025", emoji: "🔐" },
  { title: "SMS vs Authenticator Apps: Which is More Secure?", date: "May 10, 2025", emoji: "💬" },
];

const categoryIcons: { [k: string]: string } = {
  "Authentication": "🔐",
  "Password Security": "🔑",
  "Privacy": "🛡️",
  "Cybersecurity": "🔒",
  "Guides": "📚",
  "Developer": "💻",
  "Security": "🔒",
  "General": "📄",
  "2FA": "🔐",
  "Tools": "🔧",
  "Network": "🌐",
};

const toolCategories = [
  { name: "2FA & QR", icon: "🔐", href: "/tools?category=2FA+%26+QR", count: 2 },
  { name: "Password", icon: "🔑", href: "/tools?category=Password", count: 3 },
  { name: "Developer", icon: "💻", href: "/tools?category=Developer", count: 5 },
  { name: "Network", icon: "🌐", href: "/tools?category=Network", count: 4 },
  { name: "All Tools", icon: "🔧", href: "/tools", count: 14 },
];

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSubscribe = () => {
    if (!email) { setEmailError("Please enter your email address."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Please enter a valid email address."); return; }
    setEmailError("");
    // Save to localStorage
    const existing: string[] = JSON.parse(localStorage.getItem("newsletter-subscribers") || "[]");
    if (existing.includes(email.toLowerCase())) { setEmailError("You are already subscribed!"); return; }
    existing.push(email.toLowerCase());
    localStorage.setItem("newsletter-subscribers", JSON.stringify(existing));
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };
  const [activeHeading, setActiveHeading] = useState("");
  const [categories, setCategories] = useState<{ name: string; count: number; icon: string }[]>([]);
  const headings = post ? extractHeadings(post.content) : [];

  useEffect(() => {
    const posts: BlogPost[] = JSON.parse(localStorage.getItem("blog-posts") || "[]");
    const found = posts.find(p => p.slug === slug && p.published);
    setPost(found || null);
    setLoading(false);
    // Dynamic categories from actual posts
    const published = posts.filter(p => p.published);
    const catMap: { [k: string]: number } = {};
    published.forEach(p => { catMap[p.category] = (catMap[p.category] || 0) + 1; });
    const cats = Object.entries(catMap).map(([name, count]) => ({
      name, count, icon: categoryIcons[name] || "📄"
    }));
    setCategories(cats);
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const headingEls = document.querySelectorAll("h1[id], h2[id], h3[id]");
      let current = "";
      headingEls.forEach(el => {
        if (el.getBoundingClientRect().top < 150) current = el.id;
      });
      setActiveHeading(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post]);

  const readingTime = post ? Math.ceil(post.content.replace(/<[^>]+>/g, "").split(" ").length / 200) : 0;

  const share = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";
    if (platform === "twitter") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
    if (platform === "facebook") window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    if (platform === "linkedin") window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
    if (platform === "copy") { navigator.clipboard.writeText(url); alert("Link copied!"); }
  };

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff, #faf5ff, #f0f9ff)", fontFamily: "Inter, sans-serif" }}>
      <DotsBackground /><Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 20px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏳</div>
        <p style={{ color: "#64748b" }}>Loading article...</p>
      </div>
      <Footer />
    </main>
  );

  if (!post) return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff, #faf5ff, #f0f9ff)", fontFamily: "Inter, sans-serif" }}>
      <DotsBackground /><Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 20px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "60px", marginBottom: "20px" }}>📄</div>
        <h1 style={{ fontSize: "28px", color: "#1e293b", marginBottom: "12px" }}>Article Not Found</h1>
        <p style={{ color: "#64748b", marginBottom: "24px" }}>The article you are looking for does not exist or has been removed.</p>
        <a href="/blog" style={{ background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", padding: "12px 28px", borderRadius: "10px", textDecoration: "none", fontWeight: "600" }}>← Back to Blog</a>
      </div>
      <Footer />
    </main>
  );

  const processedContent = addHeadingIds(post.content);

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px 80px", position: "relative", zIndex: 1 }}>

        {/* Breadcrumbs */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8", marginBottom: "28px", flexWrap: "wrap" }}>
          <a href="/" style={{ color: "#7c3aed", textDecoration: "none" }}>Home</a><span>›</span>
          <a href="/blog" style={{ color: "#7c3aed", textDecoration: "none" }}>Blog</a><span>›</span>
          <a href={`/blog#${post.category}`} style={{ color: "#7c3aed", textDecoration: "none" }}>{post.category}</a><span>›</span>
          <span style={{ color: "#1e293b" }}>{post.title}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "40px", alignItems: "start" }}>

          {/* MAIN CONTENT */}
          <article>
            {/* Category Badge */}
            <div style={{ marginBottom: "16px" }}>
              <span style={{ background: "rgba(124,58,237,0.1)", color: "#7c3aed", fontSize: "12px", padding: "4px 12px", borderRadius: "6px", fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: "34px", fontWeight: "800", color: "#1e293b", lineHeight: "1.25", marginBottom: "16px" }}>
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p style={{ fontSize: "16px", color: "#64748b", lineHeight: "1.7", marginBottom: "20px" }}>{post.excerpt}</p>
            )}

            {/* Meta */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "13px", color: "#64748b" }}>
                <span>👤 By 2FA.AC Team</span>
                <span>🕐 {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                <span>⏱ {readingTime} min read</span>
                <span>📅 Updated: {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px", color: "#64748b" }}>Share:</span>
                {[{ platform: "twitter", label: "𝕏" }, { platform: "facebook", label: "f" }, { platform: "linkedin", label: "in" }, { platform: "copy", label: "🔗" }].map(s => (
                  <button key={s.platform} onClick={() => share(s.platform)}
                    style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f1f5f9", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: "13px", fontWeight: "700", color: "#64748b" }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "32px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
                <img src={post.coverImage} alt={post.title} style={{ width: "100%", maxHeight: "420px", objectFit: "cover", display: "block" }} />
              </div>
            )}

            {/* Table of Contents */}
            {headings.length > 0 && (
              <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "16px", padding: "24px", marginBottom: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ width: "32px", height: "32px", background: "rgba(124,58,237,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>📋</div>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b" }}>In this article</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                  {headings.map((h, i) => (
                    <a key={i} href={`#${h.id}`} style={{ fontSize: "13px", color: "#7c3aed", textDecoration: "none", display: "flex", alignItems: "flex-start", gap: "6px", paddingLeft: h.level > 1 ? `${(h.level - 1) * 12}px` : "0" }}>
                      <span style={{ color: "#94a3b8", minWidth: "18px" }}>{i + 1}.</span>
                      <span style={{ lineHeight: "1.4" }}>{h.text}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Article Content */}
            <div
              dangerouslySetInnerHTML={{ __html: processedContent }}
              style={{ lineHeight: "1.8", color: "#374151" }}
            />

            {/* Share Bottom */}
            <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", marginBottom: "4px" }}>Was this article helpful?</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{ padding: "8px 20px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#16a34a", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>👍 Yes</button>
                  <button style={{ padding: "8px 20px", background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#64748b", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>👎 No</button>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px", color: "#64748b" }}>Share this article:</span>
                {[{ platform: "twitter", label: "𝕏" }, { platform: "facebook", label: "f" }, { platform: "linkedin", label: "in" }, { platform: "copy", label: "🔗" }].map(s => (
                  <button key={s.platform} onClick={() => share(s.platform)}
                    style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f1f5f9", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: "14px", fontWeight: "700", color: "#64748b" }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ marginTop: "32px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", borderRadius: "20px", padding: "32px", display: "flex", alignItems: "center", gap: "20px", color: "white", boxShadow: "0 8px 32px rgba(124,58,237,0.3)" }}>
              <div style={{ fontSize: "52px", flexShrink: 0 }}>🛡️</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "6px" }}>Secure Your Accounts with 2FA</h3>
                <p style={{ fontSize: "13px", opacity: 0.85, marginBottom: "16px", lineHeight: "1.5" }}>Enable two-factor authentication and protect your accounts from unauthorized access.</p>
                <a href="/tools" style={{ display: "inline-block", background: "white", color: "#7c3aed", textDecoration: "none", padding: "10px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: "700" }}>
                  Explore 2FA Tools →
                </a>
              </div>
            </div>
          </article>

          {/* SIDEBAR */}
          <aside style={{ display: "flex", flexDirection: "column", gap: "20px", position: "sticky", top: "90px" }}>

            {/* Table of Contents Sidebar */}
            {headings.length > 0 && (
              <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>On this page</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {headings.map((h, i) => (
                    <a key={i} href={`#${h.id}`}
                      style={{ fontSize: "13px", color: activeHeading === h.id ? "#7c3aed" : "#64748b", textDecoration: "none", padding: "6px 10px", borderRadius: "6px", display: "flex", gap: "8px", alignItems: "flex-start", background: activeHeading === h.id ? "rgba(124,58,237,0.06)" : "transparent", paddingLeft: `${(h.level - 1) * 12 + 10}px`, borderLeft: activeHeading === h.id ? "2px solid #7c3aed" : "2px solid transparent", fontWeight: activeHeading === h.id ? "600" : "400" }}>
                      <span style={{ color: "#94a3b8", fontSize: "11px", marginTop: "2px" }}>{i + 1}.</span>
                      <span style={{ lineHeight: "1.4" }}>{h.text}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Related Articles */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>Related Articles</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {relatedArticles.map((article, i) => (
                  <a key={i} href="/blog" style={{ display: "flex", gap: "12px", alignItems: "flex-start", textDecoration: "none" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    <div style={{ width: "48px", height: "48px", background: "rgba(124,58,237,0.08)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>{article.emoji}</div>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b", lineHeight: "1.4", margin: "0 0 4px" }}>{article.title}</p>
                      <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>{article.date}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div style={{ background: "linear-gradient(135deg, #7c3aed, #9f67ff)", borderRadius: "16px", padding: "24px", color: "white" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px" }}>Stay Updated</h3>
              <p style={{ fontSize: "13px", opacity: 0.85, marginBottom: "16px", lineHeight: "1.5" }}>Get the latest security tips and tools updates in your inbox.</p>
              {subscribed ? (
                <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎉</div>
                  <p style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 4px" }}>You are subscribed!</p>
                  <p style={{ fontSize: "12px", opacity: 0.8, margin: 0 }}>Thank you! We will keep you updated.</p>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                    placeholder="Enter your email"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: emailError ? "2px solid #fca5a5" : "none", fontSize: "13px", marginBottom: emailError ? "6px" : "10px", boxSizing: "border-box", outline: "none" }}
                  />
                  {emailError && <p style={{ fontSize: "11px", color: "#fca5a5", margin: "0 0 8px", paddingLeft: "4px" }}>{emailError}</p>}
                  <button onClick={handleSubscribe}
                    style={{ width: "100%", padding: "10px", background: "white", color: "#7c3aed", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                    Subscribe
                  </button>
                  <p style={{ fontSize: "11px", opacity: 0.7, marginTop: "8px", textAlign: "center" }}>No spam, unsubscribe anytime.</p>
                </>
              )}
            </div>

            {/* Tool Categories */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>🔧 Tool Categories</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {toolCategories.map((cat, i) => (
                  <a key={i} href={cat.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 10px", borderRadius: "8px", textDecoration: "none" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(124,58,237,0.06)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", background: "rgba(124,58,237,0.08)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{cat.icon}</div>
                      <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>{cat.name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "12px", background: "rgba(124,58,237,0.08)", color: "#7c3aed", padding: "2px 8px", borderRadius: "20px", fontWeight: "600" }}>{cat.count}</span>
                      <span style={{ fontSize: "16px", color: "#94a3b8", opacity: 0.5 }}>›</span>
                    </div>
                  </a>
                ))}
              </div>
              <a href="/tools" style={{ display: "block", textAlign: "center", marginTop: "12px", padding: "9px", background: "#f1f5f9", color: "#7c3aed", textDecoration: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>
                View All Tools →
              </a>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        article h1 { font-size: 28px; font-weight: 800; color: #1e293b; margin: 32px 0 16px; line-height: 1.3; }
        article h2 { font-size: 22px; font-weight: 700; color: #1e293b; margin: 36px 0 14px; padding-top: 8px; line-height: 1.35; }
        article h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 28px 0 12px; line-height: 1.4; }
        article p { margin: 0 0 18px; font-size: 15px; line-height: 1.8; color: #374151; }
        article ul, article ol { margin: 0 0 20px 24px; }
        article li { font-size: 15px; line-height: 1.8; color: #374151; margin-bottom: 6px; }
        article a { color: #7c3aed; text-decoration: underline; }
        article strong { font-weight: 700; color: #1e293b; }
        article em { font-style: italic; }
        article blockquote { border-left: 4px solid #7c3aed; background: rgba(124,58,237,0.05); padding: 16px 20px; border-radius: 0 12px 12px 0; margin: 24px 0; font-style: italic; color: #64748b; }
        article code { background: #f1f5f9; color: #7c3aed; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; }
        article pre { background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 12px; overflow-x: auto; margin: 24px 0; font-size: 13px; line-height: 1.6; }
        article pre code { background: none; color: inherit; padding: 0; }
        article img { max-width: 100%; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        article hr { border: none; border-top: 1px solid #e2e8f0; margin: 32px 0; }
        article table { width: 100%; border-collapse: collapse; margin: 24px 0; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        article thead { background: #7c3aed; }
        article thead th { color: white; font-weight: 700; font-size: 13px; padding: 12px 16px; text-align: left; }
        article tbody tr:nth-child(even) { background: #f8fafc; }
        article tbody td { padding: 12px 16px; font-size: 14px; color: #374151; border-bottom: 1px solid #e2e8f0; }
        article .note, article .callout { background: rgba(124,58,237,0.06); border: 1px solid rgba(124,58,237,0.2); border-radius: 12px; padding: 16px 20px; margin: 20px 0; font-size: 14px; color: #64748b; display: flex; gap: 12px; align-items: flex-start; }
      `}</style>

      <Footer />
    </main>
  );
}