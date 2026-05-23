"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";

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

function renderMarkdown(text: string): string {
  return text
    .replace(/^# (.+)$/gm, '<h1 style="font-size:28px;font-weight:800;margin:24px 0 12px;color:#1a1a2e">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:22px;font-weight:700;margin:20px 0 10px;color:#1a1a2e">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:18px;font-weight:600;margin:16px 0 8px;color:#374151">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#1a1a2e;font-weight:700">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:#6b7280">$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:rgba(124,58,237,0.1);color:#7c3aed;padding:2px 6px;border-radius:4px;font-family:monospace">$1</code>')
    .replace(/^- (.+)$/gm, '<li style="margin:6px 0;color:#6b7280;padding-left:8px">$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#7c3aed;text-decoration:underline" target="_blank">$1</a>')
    .replace(/\n\n/g, '</p><p style="margin:12px 0;color:#6b7280;line-height:1.8">');
}

export default function BlogPost() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("blog-posts");
    if (saved) {
      const posts: BlogPost[] = JSON.parse(saved);
      const found = posts.find(p => p.slug === params.slug && p.published);
      if (found) {
        setPost(found);
        setRelated(posts.filter(p => p.id !== found.id && p.published && p.category === found.category).slice(0, 3));
      } else {
        setNotFound(true);
      }
    } else {
      setNotFound(true);
    }
  }, [params.slug]);

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      Security: "#ef4444", Authentication: "#7c3aed", Password: "#3b82f6",
      Developer: "#22c55e", Tutorial: "#f59e0b", News: "#06b6d4",
    };
    return colors[cat] || "#7c3aed";
  };

  if (notFound) {
    return (
      <main style={{ minHeight: "100vh", background: "#f8f9ff", color: "#1a1a2e", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
          <h1 style={{ fontSize: "24px", marginBottom: "12px" }}>Post not found</h1>
          <a href="/blog" style={{ color: "#7c3aed", textDecoration: "none" }}>← Back to Blog</a>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main style={{ minHeight: "100vh", background: "#f8f9ff", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#6b7280" }}>Loading...</div>
      </main>
    );
  }

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

      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", position: "relative", zIndex: 1 }}>

        {/* Back */}
        <a href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#6b7280", textDecoration: "none", fontSize: "14px", marginBottom: "24px", padding: "8px 14px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          ← Back to Blog
        </a>

        {/* Post Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "10px", background: `${getCategoryColor(post.category)}15`, color: getCategoryColor(post.category), fontWeight: "600" }}>
              {post.category}
            </span>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>{post.createdAt}</span>
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", lineHeight: "1.3", marginBottom: "16px", color: "#1a1a2e" }}>
            {post.title}
          </h1>
          <p style={{ fontSize: "16px", color: "#6b7280", lineHeight: "1.6" }}>{post.excerpt}</p>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(0,0,0,0.08)", marginBottom: "32px" }} />

        {/* Content */}
        <div
          style={{ fontSize: "15px", lineHeight: "1.8", color: "#6b7280" }}
          dangerouslySetInnerHTML={{ __html: `<p style="margin:12px 0;color:#6b7280;line-height:1.8">${renderMarkdown(post.content)}</p>` }}
        />

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(0,0,0,0.08)", margin: "40px 0" }} />

        {/* Share */}
        <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "20px", textAlign: "center", marginBottom: "40px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px" }}>Found this helpful? Share it!</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://2fa.ac/blog/${post.slug}`)}`} target="_blank" style={{ padding: "8px 16px", background: "rgba(29,161,242,0.1)", color: "#1da1f2", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>
              𝕏 Twitter
            </a>
            <button onClick={() => navigator.clipboard.writeText(window.location.href)} style={{ padding: "8px 16px", background: "rgba(124,58,237,0.1)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
              🔗 Copy Link
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "#1a1a2e" }}>Related Posts</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
              {related.map(p => (
                <a key={p.id} href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <span style={{ fontSize: "11px", color: getCategoryColor(p.category), fontWeight: "600" }}>{p.category}</span>
                    <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e", margin: "8px 0 6px", lineHeight: "1.4" }}>{p.title}</h4>
                    <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>{p.createdAt}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(0,0,0,0.08)", color: "#9ca3af", fontSize: "14px", marginTop: "40px", position: "relative", zIndex: 1 }}>
        © 2025 2fa.ac — Free Cybersecurity Tools for Everyone
      </footer>
    </main>
  );
}