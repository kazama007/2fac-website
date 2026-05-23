"use client";
import { useState, useEffect, useRef } from "react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
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
    const mouse = { x: width / 2, y: height / 2 };
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; baseX: number; baseY: number }[] = [];
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({ x, y, baseX: x, baseY: y, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.3 + 0.1 });
    }
    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouseMove);
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        const dx = mouse.x - p.x; const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) { const force = (150 - dist) / 150; p.vx += (dx / dist) * force * 0.3; p.vy += (dy / dist) * force * 0.3; }
        p.vx += (p.baseX - p.x) * 0.003; p.vy += (p.baseY - p.y) * 0.003;
        p.vx *= 0.95; p.vy *= 0.95; p.x += p.vx; p.y += p.vy;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.opacity})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) { ctx.beginPath(); ctx.strokeStyle = `rgba(99,102,241,${0.1 * (1 - dist / 100)})`; ctx.lineWidth = 0.5; ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); }
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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("blog-posts");
    if (saved) setPosts(JSON.parse(saved).filter((p: BlogPost) => p.published));
  }, []);

  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category)))];

  const filtered = posts.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      Security: "#ef4444", Authentication: "#7c3aed", Password: "#3b82f6",
      Developer: "#22c55e", Tutorial: "#f59e0b", News: "#06b6d4",
    };
    return colors[cat] || "#7c3aed";
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f8f9ff", color: "#1a1a2e", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />

      {/* Navbar - DARK same as homepage */}
      <nav style={{
        padding: "22px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#0a0a1a",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo.png" alt="2fa.ac" style={{ height: "30px" }} />
        </a>
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="/" style={{ color: "#a0a0b0", textDecoration: "none", fontSize: "14px" }}>Home</a>
          <a href="/tools" style={{ color: "#a0a0b0", textDecoration: "none", fontSize: "14px" }}>Tools</a>
          <a href="/blog" style={{ color: "#ffffff", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>Blog</a>
        </div>
      </nav>

      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-block", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "#7c3aed", marginBottom: "16px" }}>
            📝 2fa.ac Blog
          </div>
          <h1 style={{ fontSize: "40px", fontWeight: "800", marginBottom: "12px", background: "linear-gradient(135deg, #1a1a2e 0%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Security Tips & Updates
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Learn about cybersecurity, 2FA, passwords and more
          </p>
        </div>

        {/* Search */}
        <div style={{ maxWidth: "500px", margin: "0 auto 24px", position: "relative" }}>
          <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            style={{ width: "100%", padding: "12px 20px 12px 44px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "12px", color: "#1a1a2e", fontSize: "14px", boxSizing: "border-box", outline: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "40px", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "6px 16px", background: activeCategory === cat ? getCategoryColor(cat) : "#ffffff", border: activeCategory === cat ? "none" : "1px solid rgba(0,0,0,0.12)", borderRadius: "20px", color: activeCategory === cat ? "white" : "#6b7280", cursor: "pointer", fontSize: "13px", fontWeight: activeCategory === cat ? "600" : "400", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Posts */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#6b7280" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
            <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px", color: "#1a1a2e" }}>
              {posts.length === 0 ? "No posts yet" : "No posts found"}
            </h3>
            <p>{posts.length === 0 ? "Check back soon for security tips!" : "Try a different search or category"}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {filtered.map(post => (
              <a key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "16px", padding: "24px", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "100%", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "10px", background: `${getCategoryColor(post.category)}15`, color: getCategoryColor(post.category), fontWeight: "600" }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>{post.createdAt}</span>
                  </div>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a2e", marginBottom: "10px", lineHeight: "1.4" }}>{post.title}</h2>
                  <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6", margin: 0 }}>{post.excerpt}</p>
                  <div style={{ marginTop: "16px", color: "#7c3aed", fontSize: "14px", fontWeight: "600" }}>
                    Read more →
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(0,0,0,0.08)", color: "#9ca3af", fontSize: "14px", marginTop: "40px", position: "relative", zIndex: 1 }}>
        © 2025 2fa.ac — Free Cybersecurity Tools for Everyone
      </footer>
    </main>
  );
}