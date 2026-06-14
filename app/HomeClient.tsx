"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import NextImage from "next/image";
import { generateTOTP } from "./totp";
import AnimatedBackground from "./background";
import { HeaderAd, FooterAd } from "./adsense";
import { TOOLS_BY_CATEGORY, CATEGORY_META, TOOL_COUNT } from "./lib/tools-list";

interface SavedKey {
  name: string;
  secret: string;
  addedAt: string;
  addedTime: string;
}

const categories = Object.entries(TOOLS_BY_CATEGORY).map(([name, tools]) => ({
  name,
  color: CATEGORY_META[name as keyof typeof CATEGORY_META].color,
  icon: CATEGORY_META[name as keyof typeof CATEGORY_META].icon,
  tools,
}));

const allToolsFlat = categories.flatMap(c => c.tools.map(t => ({ ...t, category: c.name, color: c.color })));

// ToolCard — component ke bahar (no re-creation on every render)
const ToolCard = ({ tool, color }: { tool: any; color: string }) => (
  <a href={tool.href} style={{ textDecoration: "none" }}>
    <div
      style={{
        background: "#ffffff",
        border: `1px solid ${color}22`,
        borderRadius: "12px",
        padding: "20px",
        cursor: "pointer",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        height: "100%",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${color}22`;
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
        <div style={{ width: "40px", height: "40px", background: `${color}15`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
          {tool.icon}
        </div>
        <div>
          <h4 style={{ fontSize: "15px", fontWeight: "600", margin: 0, color: "#1a1a2e" }}>{tool.name}</h4>
          <span style={{ fontSize: "11px", color: color, background: `${color}12`, padding: "1px 8px", borderRadius: "10px" }}>
            {tool.category || tool.name}
          </span>
        </div>
      </div>
      <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", margin: 0 }}>{tool.desc}</p>
    </div>
  </a>
);

export default function HomeClient({ seoContent }: { seoContent?: React.ReactNode }) {
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
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const timeoutRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // CSS class based dark mode (no layout thrashing)
  const toggleDark = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("darkMode", String(next));
      document.documentElement.classList.toggle("dark-mode", next);
      return next;
    });
  }, []);

  useEffect(() => {
    try {
      const keys = localStorage.getItem("2fa-saved-keys");
      if (keys) setSavedKeys(JSON.parse(keys));
    } catch { localStorage.removeItem("2fa-saved-keys"); }
    const savedDark = localStorage.getItem("darkMode");
    if (savedDark === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark-mode");
    }
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Optimized timer (Date.now() based, no drift)
  const startTimer = useCallback((currentSecret: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const left = 30 - (Math.floor(Date.now() / 1000) % 30);
      setTimeLeft(left);
      if (left === 30) {
        generateTOTP(currentSecret).then(newCode => setCode(newCode)).catch(() => {});
      }
    }, 1000);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!secret) return;
    try {
      const newCode = await generateTOTP(secret);
      setCode(newCode);
      setGenerated(true);
      setError("");
      startTimer(secret);
      navigator.clipboard.writeText(newCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
      const now = new Date();
      setSavedKeys(prev => {
        const alreadyExists = prev.find(k => k.secret === secret);
        if (alreadyExists) return prev;
        const newKey: SavedKey = {
          name: "Account " + (prev.length + 1),
          secret,
          addedAt: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
          addedTime: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        };
        const updated = [...prev, newKey];
        localStorage.setItem("2fa-saved-keys", JSON.stringify(updated));
        return updated;
      });
    } catch {
      setError("Invalid secret key! Please enter a valid Base32 key.");
      setGenerated(false);
    }
  }, [secret, startTimer]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTools(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setShowTools(false), 200);
  }, []);

  const filtered = allToolsFlat
    .filter(t => activeCategory === "All" ? true : t.category === activeCategory)
    .filter(t => search === "" ? true : t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()));

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", color: "#1a1a2e", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <AnimatedBackground />

      {copied && (
        <div style={{ position: "fixed", top: "24px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", padding: "14px 28px", borderRadius: "50px", fontSize: "15px", fontWeight: "700", zIndex: 9999, boxShadow: "0 8px 32px rgba(124,58,237,0.4)", display: "flex", alignItems: "center", gap: "10px", animation: "slideDown 0.3s ease", maxWidth: "calc(100vw - 32px)", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: "20px" }}>✅</span>Code Copied to Clipboard!
        </div>
      )}

      {/* Navbar */}
      <nav style={{ padding: "0 20px", height: "60px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(124,58,237,0.1)", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "0 0 auto" }}>
          <a href="/"><NextImage src="/logo2.png" alt="2fa.ac — free 2FA code generator logo" width={140} height={32} priority style={{ height: "32px", width: "auto" }} /></a>
          {!isMobile && <span style={{ fontSize: "12px", color: "#94a3b8", paddingLeft: "10px", borderLeft: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>Free 2FA Tools Online</span>}
        </div>

        {!isMobile && (
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "2px" }}>
            <div style={{ position: "relative" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <a href="/tools" style={{ color: "#64748b", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", fontSize: "13.5px", fontWeight: "500", padding: "6px 12px", borderRadius: "8px" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#7c3aed"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; }}>
                Tools <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </a>
              {showTools && (
                <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position: "fixed", top: "64px", left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.98)", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "8px", width: "min(900px, calc(100vw - 40px))", zIndex: 9999, boxShadow: "0 24px 60px rgba(124,58,237,0.12)" }}>
                  <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid #f1f5f9", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "2px", fontWeight: "600" }}>ALL TOOLS</span>
                    <span style={{ fontSize: "11px", color: "#cbd5e1" }}>16 tools available</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "4px", padding: "0 4px 8px" }}>
                    {categories.map(category => (
                      <div key={category.name} style={{ borderRadius: "14px", padding: "14px 12px", background: `${category.color}06`, border: `1px solid ${category.color}15` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", paddingBottom: "8px", borderBottom: `1px solid ${category.color}20` }}>
                          <span style={{ fontSize: "14px" }}>{category.icon}</span>
                          <div>
                            <div style={{ fontSize: "10px", fontWeight: "700", color: category.color }}>{category.name.toUpperCase()}</div>
                            <div style={{ fontSize: "10px", color: "#94a3b8" }}>{category.tools.length} tools</div>
                          </div>
                        </div>
                        {category.tools.map(tool => (
                          <a key={tool.name} href={tool.href} style={{ display: "block", padding: "6px 8px", color: "#1e293b", textDecoration: "none", borderRadius: "8px", marginBottom: "2px", fontSize: "12px", fontWeight: "500" }}
                            onMouseEnter={e => { e.currentTarget.style.background = `${category.color}10`; e.currentTarget.style.color = category.color; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1e293b"; }}>
                            {tool.icon} {tool.name}
                            <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "1px" }}>{tool.desc}</div>
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>🔒 All tools run in your browser</span>
                    <a href="/tools" style={{ fontSize: "11px", color: "#7c3aed", textDecoration: "none", fontWeight: "600" }}>View all →</a>
                  </div>
                </div>
              )}
            </div>
            {["Blog", "About", "Contact"].map(item => (
              <a key={item} href={`/${item.toLowerCase()}`} style={{ color: "#64748b", textDecoration: "none", fontSize: "13.5px", fontWeight: "500", padding: "6px 12px", borderRadius: "8px" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#7c3aed"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; }}>
                {item}
              </a>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "0 0 auto" }}>
          <button onClick={toggleDark} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"} style={{ width: "36px", height: "36px", borderRadius: "9px", background: "rgba(124,58,237,0.08)", border: "1.5px solid rgba(124,58,237,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          {isMobile && (
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} aria-label={showMobileMenu ? "Close menu" : "Open menu"} style={{ width: "36px", height: "36px", borderRadius: "9px", background: "rgba(124,58,237,0.08)", border: "1.5px solid rgba(124,58,237,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {showMobileMenu
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              }
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobile && showMobileMenu && (
        <div style={{ position: "fixed", top: "60px", left: 0, right: 0, bottom: 0, background: "#fff", zIndex: 99, overflowY: "auto", padding: "16px" }}>
          <div style={{ marginBottom: "20px" }}>
            {[{ name: "🏠 Home", href: "/" }, { name: "📝 Blog", href: "/blog" }, { name: "ℹ️ About", href: "/about" }, { name: "📩 Contact", href: "/contact" }].map(item => (
              <a key={item.name} href={item.href} onClick={() => setShowMobileMenu(false)} style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderRadius: "12px", textDecoration: "none", color: "#1e293b", fontSize: "15px", fontWeight: "600", marginBottom: "6px", background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.1)" }}>
                {item.name}
              </a>
            ))}
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", letterSpacing: "1.5px", marginBottom: "10px" }}>🔧 ALL TOOLS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {categories.flatMap(c => c.tools).map(tool => (
              <a key={tool.name} href={tool.href} onClick={() => setShowMobileMenu(false)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px", borderRadius: "12px", textDecoration: "none", color: "#1e293b", fontSize: "13px", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "18px" }}>{tool.icon}</span>
                <span style={{ lineHeight: "1.3" }}>{tool.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <HeaderAd />
      </div>

      {/* 2FA Tool — H1 yahan hai, primary keyword ke saath */}
      <section style={{ maxWidth: "1200px", margin: "20px auto 0", padding: "0 16px", position: "relative", zIndex: 1, minHeight: "500px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px", minHeight: "36px" }}>
          <a href="/saved-keys" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", color: "#7c3aed", textDecoration: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
            🔑 2FA History
          </a>
        </div>
        <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "24px", padding: "clamp(24px, 5vw, 40px) clamp(16px, 5vw, 60px)", textAlign: "center", boxShadow: "0 8px 40px rgba(124,58,237,0.08)" }}>
          <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #7c3aed22, #7c3aed44)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "28px", boxShadow: "0 4px 16px rgba(124,58,237,0.2)" }}>🔐</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 34px)", fontWeight: "800", marginBottom: "8px", color: "#1e293b", lineHeight: 1.25 }}>Free 2FA Code Generator Online</h1>
          <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "12px", maxWidth: "560px", marginLeft: "auto", marginRight: "auto" }}>
            Enter your secret key to instantly generate a TOTP code — works exactly like Google Authenticator, right in your browser.
          </p>
          <p style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", color: "#15803d", borderRadius: "20px", padding: "5px 14px", fontSize: "12.5px", fontWeight: "600", marginBottom: "24px" }}>
            🔒 100% browser-based — your key never leaves your device
          </p>
          <input type="text" inputMode="text" autoCapitalize="characters" autoCorrect="off" spellCheck={false} value={secret} onChange={(e) => setSecret(e.target.value.toUpperCase().trim())} placeholder="Enter Secret Key (e.g. JBSWY3DPEHPK3PXP)" aria-label="2FA secret key"
            style={{ width: "100%", padding: "16px 20px", background: "#f8fafc", border: error ? "1.5px solid #ef4444" : "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "15px", marginBottom: "12px", boxSizing: "border-box", outline: "none" }}
            onFocus={e => { if (!error) e.currentTarget.style.border = "1.5px solid #7c3aed"; }}
            onBlur={e => { if (!error) e.currentTarget.style.border = "1.5px solid #e2e8f0"; }}
          />
          {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }} role="alert">{error}</p>}
          <button onClick={handleGenerate} style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "17px", fontWeight: "700", cursor: "pointer", marginBottom: generated ? "24px" : "0", boxShadow: "0 4px 20px rgba(124,58,237,0.35)", letterSpacing: "0.3px" }}>
            Generate Code
          </button>
          {generated && (
            <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(159,103,255,0.06))", border: "1.5px solid rgba(124,58,237,0.2)", borderRadius: "16px", padding: "clamp(16px, 4vw, 24px)" }}>
              <p style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "8px", letterSpacing: "3px", fontWeight: "600" }}>YOUR 2FA CODE</p>
              <div style={{ fontSize: "clamp(38px, 11vw, 60px)", fontWeight: "800", letterSpacing: "clamp(6px, 2.5vw, 14px)", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "monospace", marginBottom: "16px", whiteSpace: "nowrap" }}>
                {code.slice(0, 3)} {code.slice(3)}
              </div>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ background: "#e2e8f0", borderRadius: "4px", height: "6px", overflow: "hidden", maxWidth: "300px", margin: "0 auto 8px" }}>
                  <div style={{ width: `${(timeLeft / 30) * 100}%`, height: "100%", background: timeLeft > 10 ? "linear-gradient(90deg, #7c3aed, #9f67ff)" : "#ef4444", borderRadius: "4px", transition: "width 1s linear" }} />
                </div>
                <span style={{ fontSize: "13px", color: "#64748b" }}>Expires in {timeLeft} seconds</span>
              </div>
              <button onClick={handleCopy} style={{ padding: "10px 30px", background: copied ? "#22c55e" : "#fff", color: copied ? "#fff" : "#7c3aed", border: "1.5px solid", borderColor: copied ? "#22c55e" : "#7c3aed", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}>
                {copied ? "✓ Copied!" : "Copy Code"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Sub-hero */}
      <section style={{ textAlign: "center", padding: "40px 20px 32px", maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: "clamp(24px, 4.5vw, 32px)", fontWeight: "800", lineHeight: "1.25", marginBottom: "12px", background: "linear-gradient(135deg, #1e293b 0%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Free Security Tools for Everyone</h2>
        <p style={{ fontSize: "15px", color: "#64748b", lineHeight: "1.7" }}>16 free cybersecurity tools — passwords, JWT, DNS, WebRTC leak test and more. No signup required.</p>
      </section>

      {/* Trust Strip — honest, verifiable claims only */}
      <section style={{ display: "flex", justifyContent: "center", gap: "clamp(24px, 6vw, 60px)", padding: "32px 20px", borderTop: "1px solid rgba(124,58,237,0.08)", borderBottom: "1px solid rgba(124,58,237,0.08)", flexWrap: "wrap", position: "relative", zIndex: 1, background: "rgba(255,255,255,0.5)" }}>
        {[
          { num: `${TOOL_COUNT}`, label: "Free Security Tools" },
          { num: "100%", label: "Browser-Based" },
          { num: "0", label: "Data Sent to Servers" },
          { num: "₹0", label: "Free Forever" },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "clamp(26px, 4vw, 32px)", fontWeight: "800", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{item.num}</div>
            <div style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>{item.label}</div>
          </div>
        ))}
      </section>

      {/* Tools Section */}
      <section style={{ padding: "56px 20px", maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: "800", marginBottom: "12px", color: "#1e293b" }}>All Tools — 100% Free</h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "30px" }}>No account required, no payment — just use it</p>
        <div style={{ maxWidth: "500px", margin: "0 auto 24px", position: "relative" }}>
          <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "18px" }}>🔍</span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tools... (e.g. JWT, Password, DNS)" aria-label="Search tools"
            style={{ width: "100%", padding: "14px 20px 14px 46px", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "15px", boxSizing: "border-box", outline: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }} />
          {search && <button onClick={() => setSearch("")} aria-label="Clear search" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px" }}>✕</button>}
        </div>
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "40px", flexWrap: "wrap" }}>
          {["All", ...categories.map(c => c.name)].map(cat => (
            <button key={cat} onClick={() => { setActiveCategory(cat); setSearch(""); }}
              style={{ padding: "8px 20px", background: activeCategory === cat && !search ? "#7c3aed" : "#fff", border: activeCategory === cat && !search ? "none" : "1.5px solid #e2e8f0", borderRadius: "20px", color: activeCategory === cat && !search ? "#fff" : "#64748b", cursor: "pointer", fontSize: "14px", fontWeight: activeCategory === cat && !search ? "600" : "400", boxShadow: activeCategory === cat && !search ? "0 4px 12px rgba(124,58,237,0.3)" : "0 1px 4px rgba(0,0,0,0.04)", transition: "all 0.2s" }}>
              {cat === "All" ? "🌟 All" : categories.find(c => c.name === cat)?.icon + " " + cat}
            </button>
          ))}
        </div>
        {search !== "" ? (
          <div>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "<span style={{ color: "#7c3aed", fontWeight: "600" }}>{search}</span>"
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: "16px" }}>
              {filtered.length === 0
                ? <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", color: "#94a3b8" }}><div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>No tools found for "{search}"</div>
                : filtered.map(tool => <ToolCard key={tool.name} tool={tool} color={tool.color} />)}
            </div>
          </div>
        ) : activeCategory === "All" ? (
          categories.map(category => (
            <div key={category.name} style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ width: "40px", height: "40px", background: `${category.color}15`, border: `1px solid ${category.color}30`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{category.icon}</div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "#1e293b" }}>{category.name} Tools</h3>
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>{category.tools.length} tools available</p>
                </div>
                <div style={{ flex: 1, height: "1px", background: "#e2e8f0", marginLeft: "12px" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: "16px" }}>
                {category.tools.map(tool => <ToolCard key={tool.name} tool={{ ...tool, category: category.name }} color={category.color} />)}
              </div>
            </div>
          ))
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: "16px" }}>
            {filtered.map(tool => <ToolCard key={tool.name} tool={tool} color={tool.color} />)}
          </div>
        )}
      </section>

      {/* Server-rendered SEO content (How-to, What is 2FA, FAQ) */}
      {seoContent}

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <FooterAd />
      </div>

      <footer style={{ background: "#1e1b4b", borderTop: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px 30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "28px" }}>
          <div>
            <NextImage src="/logo1.png" alt="2fa.ac" width={100} height={28} style={{ height: "32px", width: "auto", marginBottom: "16px" }} />
            <p style={{ fontSize: "14px", color: "#a5b4fc", lineHeight: "1.7", maxWidth: "260px" }}>Free cybersecurity tools — 2FA, passwords, JWT, DNS and more. Browser-only, zero signup required.</p>
          </div>
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: "700", color: "#6366f1", letterSpacing: "2px", marginBottom: "20px" }}>POPULAR TOOLS</h4>
            {[{ name: "2FA Code Generator", href: "/" }, { name: "Password Generator", href: "/tools/password-generator" }, { name: "JWT Decoder", href: "/tools/jwt-decoder" }, { name: "Hash Generator", href: "/tools/hash-generator" }, { name: "IP Lookup", href: "/tools/ip-lookup" }, { name: "WHOIS Lookup", href: "/tools/whois-lookup" }].map(link => (
              <a key={link.name} href={link.href} style={{ display: "block", color: "#a5b4fc", textDecoration: "none", fontSize: "14px", marginBottom: "12px" }}>{link.name}</a>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: "700", color: "#6366f1", letterSpacing: "2px", marginBottom: "20px" }}>CATEGORIES</h4>
            {[{ name: "All Tools", href: "/tools" }, { name: "2FA & QR", href: "/tools?category=2FA+%26+QR" }, { name: "Password", href: "/tools?category=Password" }, { name: "Developer", href: "/tools?category=Developer" }, { name: "Network", href: "/tools?category=Network" }, { name: "Blog", href: "/blog" }].map(link => (
              <a key={link.name} href={link.href} style={{ display: "block", color: "#a5b4fc", textDecoration: "none", fontSize: "14px", marginBottom: "12px" }}>{link.name}</a>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: "700", color: "#6366f1", letterSpacing: "2px", marginBottom: "20px" }}>COMPANY & LEGAL</h4>
            {[{ name: "About", href: "/about" }, { name: "Blog", href: "/blog" }, { name: "Privacy Policy", href: "/privacy" }, { name: "Terms of Service", href: "/terms" }, { name: "Contact", href: "/contact" }].map(link => (
              <a key={link.name} href={link.href} style={{ display: "block", color: "#a5b4fc", textDecoration: "none", fontSize: "14px", marginBottom: "12px" }}>{link.name}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "16px 20px", textAlign: "center" }}>
          <span style={{ fontSize: "12px", color: "#6366f1" }}>© 2026 2fa.ac — Free Cybersecurity Tools for Everyone</span>
        </div>
      </footer>
    </main>
  );
}
