"use client";
import { useEffect, useRef, useState } from "react";
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

const categories = ["All", "2FA & QR", "Password", "Developer", "Network"];

const tools = [
  {
    icon: "🔐",
    name: "TOTP 2FA Generator",
    desc: "Generate time-based one-time passwords compatible with Google Authenticator and Authy.",
    href: "/",
    category: "2FA & QR",
    badge: "Popular",
    badgeColor: "#7c3aed",
    tags: ["2FA", "TOTP", "OTP"],
  },
  {
    icon: "📱",
    name: "QR Code Generator",
    desc: "Create QR codes for 2FA setup, URLs, or any text. Download as PNG instantly.",
    href: "/tools/qr-generator",
    category: "2FA & QR",
    tags: ["QR", "2FA", "Scanner"],
  },
  {
    icon: "🔑",
    name: "Password Generator",
    desc: "Generate strong, random passwords with custom length and character options.",
    href: "/tools/password-generator",
    category: "Password",
    badge: "Popular",
    badgeColor: "#3b82f6",
    tags: ["Password", "Security"],
  },
  {
    icon: "💪",
    name: "Password Strength Checker",
    desc: "Test your password strength instantly. Get a score, crack time estimate, and tips.",
    href: "/tools/password-strength",
    category: "Password",
    tags: ["Password", "Security"],
  },
  {
    icon: "🔓",
    name: "Password Breach Checker",
    desc: "Check if your password appeared in a data breach using k-anonymity. 100% private.",
    href: "/tools/password-breach",
    category: "Password",
    tags: ["Password", "Breach", "HIBP"],
  },
  {
    icon: "🔍",
    name: "JWT Decoder",
    desc: "Decode and inspect JWT tokens. View header, payload, and expiry details instantly.",
    href: "/tools/jwt-decoder",
    category: "Developer",
    tags: ["JWT", "Token", "Auth"],
  },
  {
    icon: "#️⃣",
    name: "Hash Generator",
    desc: "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text.",
    href: "/tools/hash-generator",
    category: "Developer",
    tags: ["Hash", "MD5", "SHA"],
  },
  {
    icon: "🆔",
    name: "UUID Generator",
    desc: "Generate multiple UUID v4 unique identifiers instantly. Copy all at once.",
    href: "/tools/uuid-generator",
    category: "Developer",
    tags: ["UUID", "ID", "Generator"],
  },
  {
    icon: "📝",
    name: "Base64 Encoder / Decoder",
    desc: "Encode or decode Base64 text instantly. Includes swap mode for quick conversion.",
    href: "/tools/base64",
    category: "Developer",
    tags: ["Base64", "Encode", "Decode"],
  },
  {
    icon: "📋",
    name: "JSON Formatter",
    desc: "Format, validate, and minify JSON data with syntax highlighting and stats.",
    href: "/tools/json-formatter",
    category: "Developer",
    tags: ["JSON", "Format", "Validate"],
  },
  {
    icon: "🔗",
    name: "Link Checker",
    desc: "Detect phishing links, suspicious URLs, and scam websites before clicking.",
    href: "/tools/link-checker",
    category: "Network",
    tags: ["Phishing", "URL", "Safety"],
  },
  {
    icon: "🌐",
    name: "DNS Lookup",
    desc: "Query A, AAAA, MX, NS, TXT, CNAME, and SOA records for any domain.",
    href: "/tools/dns-lookup",
    category: "Network",
    tags: ["DNS", "Domain", "Records"],
  },
  {
    icon: "📍",
    name: "IP Lookup",
    desc: "Find geolocation, ISP, ASN, and network details for any IP address.",
    href: "/tools/ip-lookup",
    category: "Network",
    tags: ["IP", "Geolocation", "ISP"],
  },
  {
    icon: "🏢",
    name: "WHOIS Lookup",
    desc: "Check domain registration info, owner details, expiry date, and name servers.",
    href: "/tools/whois-lookup",
    category: "Network",
    tags: ["WHOIS", "Domain", "Registration"],
  },
];

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = tools.filter(t => {
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const matchSearch = search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const categoryColors: { [k: string]: string } = {
    "2FA & QR": "#7c3aed",
    "Password": "#3b82f6",
    "Developer": "#22c55e",
    "Network": "#f59e0b",
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />
      <Navbar />

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 20px 80px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-block", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "#7c3aed", marginBottom: "16px", fontWeight: "500" }}>
            🔧 All Tools
          </div>
          <h1 style={{ fontSize: "42px", fontWeight: "800", marginBottom: "12px", background: "linear-gradient(135deg, #1e293b 0%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Free Cybersecurity Tools
          </h1>
          <p style={{ color: "#64748b", fontSize: "16px", maxWidth: "520px", margin: "0 auto" }}>
            {tools.length} free tools — no account required, no data collected
          </p>
        </div>

        {/* Search */}
        <div style={{ maxWidth: "480px", margin: "0 auto 28px", position: "relative" }}>
          <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tools..."
            style={{ width: "100%", padding: "13px 20px 13px 44px", background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "14px", boxSizing: "border-box", outline: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
            onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "40px", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ padding: "8px 20px", background: activeCategory === cat ? (categoryColors[cat] || "#7c3aed") : "#ffffff", border: activeCategory === cat ? "none" : "1.5px solid #e2e8f0", borderRadius: "20px", color: activeCategory === cat ? "white" : "#64748b", cursor: "pointer", fontSize: "13px", fontWeight: activeCategory === cat ? "600" : "400", boxShadow: activeCategory === cat ? `0 4px 14px ${(categoryColors[cat] || "#7c3aed")}40` : "0 1px 4px rgba(0,0,0,0.04)", transition: "all 0.2s" }}>
              {cat === "All" ? "⚡ All" : cat === "2FA & QR" ? "🔐 2FA & QR" : cat === "Password" ? "🔑 Password" : cat === "Developer" ? "💻 Developer" : "🌐 Network"}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#94a3b8" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
              {cat} — {tools.filter(t => t.category === cat).length} tools
            </div>
          ))}
        </div>

        {/* Tools Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <p>No tools found for "{search}"</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {filtered.map((tool, i) => (
              <a key={i} href={tool.href} style={{ textDecoration: "none" }}>
                <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", height: "100%", boxSizing: "border-box", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(124,58,237,0.12)"; (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(124,58,237,0.25)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(124,58,237,0.1)"; }}
                >
                  {/* Category dot */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: categoryColors[tool.category] || "#7c3aed", borderRadius: "16px 16px 0 0" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <span style={{ fontSize: "36px" }}>{tool.icon}</span>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {tool.badge && (
                        <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "8px", background: `${tool.badgeColor}15`, color: tool.badgeColor, fontWeight: "700", letterSpacing: "0.5px" }}>
                          {tool.badge}
                        </span>
                      )}
                      <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "8px", background: `${categoryColors[tool.category] || "#7c3aed"}12`, color: categoryColors[tool.category] || "#7c3aed", fontWeight: "600" }}>
                        {tool.category}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>{tool.name}</h3>
                  <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6", margin: "0 0 16px" }}>{tool.desc}</p>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {tool.tags.map(tag => (
                      <span key={tag} style={{ fontSize: "11px", padding: "2px 8px", background: "#f1f5f9", color: "#94a3b8", borderRadius: "6px" }}>{tag}</span>
                    ))}
                  </div>

                  <div style={{ marginTop: "16px", color: "#7c3aed", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                    Open Tool →
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ marginTop: "60px", textAlign: "center", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "20px", padding: "40px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>All tools are completely free</h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "0" }}>No account required. No data collected. Everything runs in your browser.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}