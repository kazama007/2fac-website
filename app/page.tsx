"use client";
import { useState, useEffect, useRef } from "react";
import { generateTOTP } from "./totp";
import AnimatedBackground from "./background";

interface SavedKey {
  name: string;
  secret: string;
  addedAt: string;
  addedTime: string;
}

export default function Home() {
  const [secret, setSecret] = useState("");
  const [showTools, setShowTools] = useState(false);
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [savedKeys, setSavedKeys] = useState<SavedKey[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    const keys = localStorage.getItem("2fa-saved-keys");
    if (keys) setSavedKeys(JSON.parse(keys));
  }, []);

  useEffect(() => {
    const timer = setInterval(async () => {
      const seconds = 30 - (Math.floor(Date.now() / 1000) % 30);
      setTimeLeft(seconds);
      if (generated && secret) {
        try {
          setCode(await generateTOTP(secret));
        } catch {
          setError("Invalid secret key!");
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [generated, secret]);

  const handleGenerate = async () => {
    if (!secret) return;
    try {
      const newCode = await generateTOTP(secret);
      setCode(newCode);
      setGenerated(true);
      setError("");
      const now = new Date();
      const alreadyExists = savedKeys.find(k => k.secret === secret);
      if (!alreadyExists) {
        const newKey: SavedKey = {
          name: "Account " + (savedKeys.length + 1),
          secret: secret,
          addedAt: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
          addedTime: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        };
        const updated = [...savedKeys, newKey];
        setSavedKeys(updated);
        localStorage.setItem("2fa-saved-keys", JSON.stringify(updated));
      }
    } catch {
      setError("Invalid secret key! Please enter a valid Base32 key.");
      setGenerated(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTools(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowTools(false), 200);
  };

  const categories = [
    {
      name: "Authentication", color: "#7c3aed", icon: "🔐",
      tools: [
        { icon: "🔐", name: "TOTP Generator", desc: "Generate OTP codes like Google Authenticator", href: "/" },
        { icon: "📱", name: "QR Code Generator", desc: "Generate QR codes for authenticator apps", href: "/tools/qr-generator" },
      ]
    },
    {
      name: "Password", color: "#3b82f6", icon: "🔑",
      tools: [
        { icon: "🔑", name: "Password Generator", desc: "Generate strong secure passwords", href: "/tools/password-generator" },
        { icon: "💪", name: "Password Strength", desc: "Check how strong your password is", href: "/tools/password-strength" },
        { icon: "🔓", name: "Password Breach Checker", desc: "Check if your password was leaked in a data breach", href: "/tools/password-breach" },
      ]
    },
    {
      name: "Developer", color: "#22c55e", icon: "👨‍💻",
      tools: [
        { icon: "🔍", name: "JWT Decoder", desc: "Decode and verify JWT tokens", href: "/tools/jwt-decoder" },
        { icon: "#️⃣", name: "Hash Generator", desc: "Generate MD5, SHA-256, SHA-512 hashes", href: "/tools/hash-generator" },
        { icon: "🆔", name: "UUID Generator", desc: "Generate unique IDs instantly", href: "/tools/uuid-generator" },
        { icon: "📝", name: "Base64 Encoder", desc: "Encode and decode Base64 text", href: "/tools/base64" },
        { icon: "📋", name: "JSON Formatter", desc: "Format and validate JSON data", href: "/tools/json-formatter" },
      ]
    },
    {
      name: "Security", color: "#ef4444", icon: "🛡️",
      tools: [
        { icon: "🔗", name: "Link Checker", desc: "Check links for scams and phishing", href: "/tools/link-checker" },
        { icon: "🌐", name: "DNS Lookup", desc: "Check domain DNS records", href: "/tools/dns-lookup" },
        { icon: "📍", name: "IP Lookup", desc: "Find location of any IP address", href: "/tools/ip-lookup" },
        { icon: "🏢", name: "WHOIS Lookup", desc: "Check domain owner and registration info", href: "/tools/whois-lookup" },
      ]
    },
  ];

  const allTools = categories.flatMap(c => c.tools.map(t => ({ ...t, category: c.name, color: c.color })));

  const filtered = allTools
    .filter(t => activeCategory === "All" ? true : t.category === activeCategory)
    .filter(t => search === "" ? true : t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()));

  const ToolCard = ({ tool, color }: { tool: any; color: string }) => (
    <a href={tool.href} style={{ textDecoration: "none" }}>
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${color}22`,
        borderRadius: "12px",
        padding: "20px",
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        height: "100%",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
          <div style={{ width: "40px", height: "40px", background: `${color}22`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
            {tool.icon}
          </div>
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: "600", margin: 0, color: "#fff" }}>{tool.name}</h4>
            <span style={{ fontSize: "11px", color: color, background: `${color}22`, padding: "1px 8px", borderRadius: "10px" }}>
              {tool.category || tool.name}
            </span>
          </div>
        </div>
        <p style={{ fontSize: "13px", color: "#a0a0b0", lineHeight: "1.5", margin: 0 }}>{tool.desc}</p>
      </div>
    </a>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a1a", color: "#ffffff", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <AnimatedBackground />

      {/* Navbar */}
      <nav style={{ padding: "22px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 30px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/logo.png" alt="2fa.ac logo" style={{ height: "30px", width: "auto" }} />
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>

          {/* Tools Dropdown */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a href="#" style={{ color: "#a0a0b0", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500", padding: "8px 14px", borderRadius: "8px", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#a0a0b0"; e.currentTarget.style.background = "transparent"; }}
            >
              {/* Wrench / Utilities icon — same style as screenshot */}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              Tools
            </a>

            {showTools && (
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  position: "absolute",
                  top: "100%",
                  right: "0",
                  background: "#0f0f1e",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  padding: "24px",
                  width: "900px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: "16px",
                  zIndex: 999,
                  boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
                }}>
                {categories.map(category => (
                  <div key={category.name}>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: category.color, letterSpacing: "1px", marginBottom: "10px", paddingBottom: "6px", borderBottom: `1px solid ${category.color}33` }}>
                      {category.icon} {category.name.toUpperCase()}
                    </div>
                    {category.tools.map(tool => (
                      <a key={tool.name} href={tool.href} style={{ display: "block", padding: "8px 10px", color: "#fff", textDecoration: "none", borderRadius: "8px", marginBottom: "4px" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "2px" }}>{tool.icon} {tool.name}</div>
                        <div style={{ fontSize: "11px", color: "#6b7280" }}>{tool.desc}</div>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blog link with document icon */}
          <a href="/blog" style={{ color: "#a0a0b0", textDecoration: "none", fontSize: "14px", fontWeight: "500", padding: "8px 14px", borderRadius: "8px", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#a0a0b0"; e.currentTarget.style.background = "transparent"; }}
          >
            {/* Blog / document-edit icon — same as screenshot */}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Blog
          </a>

          {/* About link with fingerprint icon */}
          <a href="/about" style={{ color: "#a0a0b0", textDecoration: "none", fontSize: "14px", fontWeight: "500", padding: "8px 14px", borderRadius: "8px", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#a0a0b0"; e.currentTarget.style.background = "transparent"; }}
          >
            {/* Fingerprint icon — same as screenshot */}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/>
              <path d="M5 19.5C5.5 18 6 15 6 12c0-1.9.7-3.7 2-5"/>
              <path d="M17.8 21.8C16 21 14.8 19.3 14 17c-.4-1.1-.6-2.3-.6-3.5 0-2.4-1.8-4.5-4.4-4.5"/>
              <path d="M10 9.6c1.3-.2 2.7.1 3.8 1 1 .8 1.6 2 1.6 3.3 0 1.4-.1 2.8-.4 4.1"/>
              <path d="M2 12a10 10 0 0 0 2 6.1"/>
              <path d="M20 12c0 1.5-.2 3-.6 4.3"/>
              <path d="M12 5c.9 0 1.8.1 2.6.4"/>
            </svg>
            About
          </a>

        </div>
      </nav>

      {/* 2FA Tool */}
      <section style={{ maxWidth: "1200px", margin: "30px auto 20px", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
          <a href="/saved-keys" style={{ background: "rgba(124,58,237,0.2)", border: "1px solid #7c3aed", color: "#7c3aed", textDecoration: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
            🔑 2FA History
          </a>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "20px 60px", textAlign: "center", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
          <div style={{ width: "56px", height: "56px", background: "rgba(124,58,237,0.2)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "28px" }}>🔐</div>
          <h2 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "8px", color: "#fff" }}>2FA Code Generator</h2>
          <p style={{ color: "#a0a0b0", fontSize: "15px", marginBottom: "24px" }}>Enter your secret key to instantly generate a 2FA code</p>
          <input type="text" value={secret} onChange={(e) => setSecret(e.target.value.toUpperCase().trim())} placeholder="Enter Secret Key (e.g. JBSWY3DPEHPK3PXP)" style={{ width: "100%", padding: "16px 20px", background: "rgba(255,255,255,0.06)", border: error ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", color: "white", fontSize: "15px", marginBottom: "12px", boxSizing: "border-box", outline: "none" }} />
          {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
          <button onClick={handleGenerate} style={{ width: "100%", padding: "16px", background: "#7c3aed", color: "white", border: "none", borderRadius: "12px", fontSize: "17px", fontWeight: "600", cursor: "pointer", marginBottom: generated ? "24px" : "0" }}>
            Generate Code
          </button>
          {generated && (
            <div style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "14px", padding: "16px" }}>
              <p style={{ fontSize: "12px", color: "#a0a0b0", marginBottom: "8px", letterSpacing: "2px" }}>YOUR 2FA CODE</p>
              <div style={{ fontSize: "60px", fontWeight: "800", letterSpacing: "14px", color: "#7c3aed", fontFamily: "monospace", marginBottom: "12px" }}>
                {code.slice(0, 3)} {code.slice(3)}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "4px", height: "6px", overflow: "hidden", maxWidth: "300px", margin: "0 auto 8px" }}>
                  <div style={{ width: `${(timeLeft / 30) * 100}%`, height: "100%", background: timeLeft > 10 ? "#7c3aed" : "#ef4444", borderRadius: "4px", transition: "width 1s linear" }} />
                </div>
                <span style={{ fontSize: "13px", color: "#a0a0b0" }}>Expires in {timeLeft} seconds</span>
              </div>
              <button onClick={handleCopy} style={{ padding: "10px 30px", background: copied ? "#22c55e" : "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                {copied ? "✓ Copied!" : "Copy Code"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Hero Text */}
      <section style={{ textAlign: "center", padding: "30px 20px", maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-block", background: "rgba(124,58,237,0.15)", border: "1px solid #7c3aed", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "#7c3aed", marginBottom: "16px" }}>
          Trusted by 300+ daily users
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: "800", lineHeight: "1.2", marginBottom: "10px", background: "linear-gradient(135deg, #ffffff 0%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Free Security Tools for Everyone
        </h1>
        <p style={{ fontSize: "14px", color: "#a0a0b0", lineHeight: "1.6" }}>
          20+ free cybersecurity tools. Completely free, no signup required.
        </p>
      </section>

      {/* Trust Metrics */}
      <section style={{ display: "flex", justifyContent: "center", gap: "60px", padding: "40px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
        {[{ num: "20+", label: "Security Tools" }, { num: "300+", label: "Daily Users" }, { num: "99.9%", label: "Uptime" }, { num: "100%", label: "Free Forever" }].map((item) => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#7c3aed" }}>{item.num}</div>
            <div style={{ fontSize: "14px", color: "#a0a0b0", marginTop: "4px" }}>{item.label}</div>
          </div>
        ))}
      </section>

      {/* Tools Section */}
      <section style={{ padding: "60px 40px", maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h2 style={{ textAlign: "center", fontSize: "36px", fontWeight: "700", marginBottom: "12px" }}>All Tools — 100% Free</h2>
        <p style={{ textAlign: "center", color: "#a0a0b0", marginBottom: "30px" }}>No account required, no payment — just use it</p>

        <div style={{ maxWidth: "500px", margin: "0 auto 24px", position: "relative" }}>
          <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "18px" }}>🔍</span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tools... (e.g. JWT, Password, DNS)" style={{ width: "100%", padding: "14px 20px 14px 46px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", color: "white", fontSize: "15px", boxSizing: "border-box", outline: "none" }} />
          {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#a0a0b0", cursor: "pointer", fontSize: "18px" }}>✕</button>}
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "40px", flexWrap: "wrap" }}>
          {["All", ...categories.map(c => c.name)].map(cat => (
            <button key={cat} onClick={() => { setActiveCategory(cat); setSearch(""); }} style={{ padding: "8px 20px", background: activeCategory === cat && !search ? "#7c3aed" : "rgba(255,255,255,0.05)", border: activeCategory === cat && !search ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: activeCategory === cat && !search ? "600" : "400" }}>
              {cat === "All" ? "🌟 All" : categories.find(c => c.name === cat)?.icon + " " + cat}
            </button>
          ))}
        </div>

        {search !== "" ? (
          <div>
            <p style={{ color: "#a0a0b0", fontSize: "14px", marginBottom: "16px" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "<span style={{ color: "#fff" }}>{search}</span>"
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {filtered.length === 0 ? (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", color: "#a0a0b0" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
                  No tools found for "{search}"
                </div>
              ) : filtered.map(tool => <ToolCard key={tool.name} tool={tool} color={tool.color} />)}
            </div>
          </div>
        ) : activeCategory === "All" ? (
          categories.map(category => (
            <div key={category.name} style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ width: "40px", height: "40px", background: `${category.color}22`, border: `1px solid ${category.color}44`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                  {category.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "#fff" }}>{category.name} Tools</h3>
                  <p style={{ fontSize: "13px", color: "#a0a0b0", margin: 0 }}>{category.tools.length} tools available</p>
                </div>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)", marginLeft: "12px" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                {category.tools.map(tool => <ToolCard key={tool.name} tool={{ ...tool, category: category.name }} color={category.color} />)}
              </div>
            </div>
          ))
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {filtered.map(tool => <ToolCard key={tool.name} tool={tool} color={tool.color} />)}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{ background: "#080c18", borderTop: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 40px 40px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px" }}>
          <div>
            <img src="/logo.png" alt="2fa.ac" style={{ height: "32px", marginBottom: "16px" }} />
            <p style={{ fontSize: "14px", color: "#a0a0b0", lineHeight: "1.7", maxWidth: "260px" }}>
              Free cybersecurity tools — 2FA, passwords, JWT, DNS and more. Browser-only, zero signup required.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", letterSpacing: "2px", marginBottom: "20px" }}>POPULAR TOOLS</h4>
            {[
              { name: "TOTP Generator", href: "/" },
              { name: "Password Generator", href: "/tools/password-generator" },
              { name: "JWT Decoder", href: "/tools/jwt-decoder" },
              { name: "Hash Generator", href: "/tools/hash-generator" },
              { name: "IP Lookup", href: "/tools/ip-lookup" },
              { name: "WHOIS Lookup", href: "/tools/whois-lookup" },
            ].map(link => (
              <a key={link.name} href={link.href} style={{ display: "block", color: "#a0a0b0", textDecoration: "none", fontSize: "14px", marginBottom: "12px" }}>{link.name}</a>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", letterSpacing: "2px", marginBottom: "20px" }}>CATEGORIES</h4>
            {[
              { name: "Authentication", href: "/" },
              { name: "Password Tools", href: "/tools/password-generator" },
              { name: "Developer Tools", href: "/tools/jwt-decoder" },
              { name: "Security Tools", href: "/tools/link-checker" },
              { name: "DNS & Network", href: "/tools/dns-lookup" },
              { name: "Blog", href: "/blog" },
            ].map(link => (
              <a key={link.name} href={link.href} style={{ display: "block", color: "#a0a0b0", textDecoration: "none", fontSize: "14px", marginBottom: "12px" }}>{link.name}</a>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", letterSpacing: "2px", marginBottom: "20px" }}>COMPANY & LEGAL</h4>
            {[
              { name: "About", href: "/about" },
              { name: "Blog", href: "/blog" },
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms of Service", href: "/terms" },
              { name: "Contact", href: "/contact" },
            ].map(link => (
              <a key={link.name} href={link.href} style={{ display: "block", color: "#a0a0b0", textDecoration: "none", fontSize: "14px", marginBottom: "12px" }}>{link.name}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1100px", margin: "0 auto" }}>
          <span style={{ fontSize: "13px", color: "#6b7280" }}>© 2025 2fa.ac — Free Cybersecurity Tools for Everyone</span>
          <span style={{ fontSize: "13px", color: "#6b7280" }}>Built with ❤️ for Security</span>
        </div>
      </footer>
    </main>
  );
}