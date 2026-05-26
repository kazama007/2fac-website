"use client";
import { useState, useRef, useEffect } from "react";
import { Navbar, Footer } from "../shared";

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

export default function BlogClient({ initialPosts }: { initialPosts: any[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = ["All", ...Array.from(new Set(initialPosts.map(p => p.category)))];
  const filtered = initialPosts.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", color: "#1a1a2e", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />
      <Navbar />
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-block", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "#7c3aed", marginBottom: "16px", fontWeight: "500" }}>📝 2fa.ac Blog</div>
          <h1 style={{ fontSize: "40px", fontWeight: "800", marginBottom: "12px", background: "linear-gradient(135deg, #1e293b 0%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Security Tips & Updates</h1>
          <p style={{ color: "#64748b", fontSize: "16px" }}>Learn about cybersecurity, 2FA, passwords and more</p>
        </div>

        <div style={{ maxWidth: "500px", margin: "0 auto 24px", position: "relative" }}>
          <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..."
            style={{ width: "100%", padding: "12px 20px 12px 44px", background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
            onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
            onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"} />
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "40px", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "6px 16px", background: activeCategory === cat ? getCategoryColor(cat) : "#ffffff", border: activeCategory === cat ? "none" : "1.5px solid #e2e8f0", borderRadius: "20px", color: activeCategory === cat ? "white" : "#64748b", cursor: "pointer", fontSize: "13px", fontWeight: activeCategory === cat ? "600" : "400" }}>{cat}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#64748b" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
            <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px", color: "#1e293b" }}>{initialPosts.length === 0 ? "No posts yet" : "No posts found"}</h3>
            <p>{initialPosts.length === 0 ? "Check back soon!" : "Try different search"}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {filtered.map(post => (
              <a key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", overflow: "hidden", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.06)", height: "100%", boxSizing: "border-box", transition: "transform 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
                  {post.cover_image && <img src={post.cover_image} alt={post.title} style={{ width: "100%", height: "160px", objectFit: "cover" }} />}
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "10px", background: `${getCategoryColor(post.category)}12`, color: getCategoryColor(post.category), fontWeight: "600" }}>{post.category}</span>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>{new Date(post.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </div>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "10px", lineHeight: "1.4" }}>{post.title}</h2>
                    <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: 0 }}>{post.excerpt}</p>
                    <div style={{ marginTop: "16px", color: "#7c3aed", fontSize: "14px", fontWeight: "600" }}>Read more →</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}