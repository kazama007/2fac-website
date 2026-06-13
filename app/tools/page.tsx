"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar, Footer } from "../shared";
import AnimatedBackground from "../background";
import { HeaderAd, FooterAd } from "../adsense";



const categories = ["All", "2FA & QR", "Password", "Developer", "Network"];

const tools = [
  {
    icon: "🔐",
    name: "2FA Code Generator",
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
    icon: "🔴",
    name: "WebRTC Leak Test",
    desc: "Check if your browser is leaking your real IP through WebRTC — even with a VPN.",
    href: "/tools/webrtc-leak",
    category: "Network",
    tags: ["Privacy", "VPN", "Security"],
  },
  {
    icon: "🔍",
    name: "DNS Leak Test",
    desc: "Check if your VPN is leaking DNS queries to your ISP.",
    href: "/tools/dns-leak-test",
    category: "Network",
    tags: ["Privacy", "VPN", "Security"],
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

function ToolsPageInner() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categoryHeadings: { [k: string]: { title: string; desc: string } } = {
    "All": { title: "Free Cybersecurity Tools", desc: "16 free browser-based tools — no account required, no data collected" },
    "2FA & QR": { title: "2FA & QR Code Tools", desc: "Free two-factor authentication and QR code generator tools" },
    "Password": { title: "Password Security Tools", desc: "Free password generator, strength checker, and breach detection tools" },
    "Developer": { title: "Developer Security Tools", desc: "Free JWT decoder, hash generator, UUID generator, and more" },
    "Network": { title: "Network, Privacy & Security Tools", desc: "Free WebRTC leak test, DNS leak test, IP lookup, DNS lookup, WHOIS, and link checker tools" },
  };
  const currentHeading = categoryHeadings[activeCategory] || categoryHeadings["All"];

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(decodeURIComponent(cat));
  }, [searchParams]);

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
      <AnimatedBackground />
      <Navbar />
      <HeaderAd />

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 20px 80px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-block", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "#7c3aed", marginBottom: "16px", fontWeight: "500" }}>
            🔧 All Tools
          </div>
          <h1 style={{ fontSize: "42px", fontWeight: "800", marginBottom: "12px", background: "linear-gradient(135deg, #1e293b 0%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {currentHeading.title}
          </h1>
          <p style={{ color: "#64748b", fontSize: "16px", maxWidth: "520px", margin: "0 auto" }}>
            {currentHeading.desc}
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

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                    {tool.tags.map(tag => (
                      <span key={tag} style={{ fontSize: "11px", padding: "3px 10px", background: "#f1f5f9", color: "#94a3b8", borderRadius: "20px", fontWeight: "500" }}>{tag}</span>
                    ))}
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <div style={{ background: `linear-gradient(135deg, ${categoryColors[tool.category] || "#7c3aed"}, ${categoryColors[tool.category] || "#7c3aed"}cc)`, borderRadius: "12px", padding: "12px 20px", textAlign: "center", boxShadow: `0 4px 14px ${categoryColors[tool.category] || "#7c3aed"}40` }}>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "white", letterSpacing: "0.2px" }}>Open Tool →</span>
                    </div>
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

      <FooterAd />
      <Footer />
    </main>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={null}>
      <ToolsPageInner />
    </Suspense>
  );
}