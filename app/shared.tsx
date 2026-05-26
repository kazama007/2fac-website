"use client";
import { useState, useRef, useEffect } from "react";
import { HeaderAd, FooterAd } from "./adsense";

export function Navbar() {
  const [showTools, setShowTools] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
    }
  }, []);

  const toggleDark = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("darkMode", String(next));
      document.documentElement.style.filter = next ? "invert(1) hue-rotate(180deg)" : "";
      return next;
    });
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTools(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowTools(false), 200);
  };

  const allTools = [
    { icon: "🔐", name: "TOTP Generator", href: "/" },
    { icon: "📱", name: "QR Code Generator", href: "/tools/qr-generator" },
    { icon: "🔑", name: "Password Generator", href: "/tools/password-generator" },
    { icon: "💪", name: "Password Strength", href: "/tools/password-strength" },
    { icon: "🔓", name: "Password Breach Checker", href: "/tools/password-breach" },
    { icon: "🔍", name: "JWT Decoder", href: "/tools/jwt-decoder" },
    { icon: "#️⃣", name: "Hash Generator", href: "/tools/hash-generator" },
    { icon: "🆔", name: "UUID Generator", href: "/tools/uuid-generator" },
    { icon: "📝", name: "Base64 Encoder", href: "/tools/base64" },
    { icon: "📋", name: "JSON Formatter", href: "/tools/json-formatter" },
    { icon: "🔗", name: "Link Checker", href: "/tools/link-checker" },
    { icon: "🌐", name: "DNS Lookup", href: "/tools/dns-lookup" },
    { icon: "📍", name: "IP Lookup", href: "/tools/ip-lookup" },
    { icon: "🏢", name: "WHOIS Lookup", href: "/tools/whois-lookup" },
  ];

  const categories = [
    { name: "Authentication", color: "#7c3aed", icon: "🔐", tools: [
      { icon: "🔐", name: "TOTP Generator", desc: "Generate OTP codes like Google Authenticator", href: "/" },
      { icon: "📱", name: "QR Code Generator", desc: "Generate QR codes for authenticator apps", href: "/tools/qr-generator" },
    ]},
    { name: "Password", color: "#3b82f6", icon: "🔑", tools: [
      { icon: "🔑", name: "Password Generator", desc: "Generate strong secure passwords", href: "/tools/password-generator" },
      { icon: "💪", name: "Password Strength", desc: "Check how strong your password is", href: "/tools/password-strength" },
      { icon: "🔓", name: "Password Breach Checker", desc: "Check if your password was leaked in a data breach", href: "/tools/password-breach" },
    ]},
    { name: "Developer", color: "#7c3aed", icon: "👨‍💻", tools: [
      { icon: "🔍", name: "JWT Decoder", desc: "Decode and verify JWT tokens", href: "/tools/jwt-decoder" },
      { icon: "#️⃣", name: "Hash Generator", desc: "Generate MD5, SHA-256, SHA-512 hashes", href: "/tools/hash-generator" },
      { icon: "🆔", name: "UUID Generator", desc: "Generate unique IDs instantly", href: "/tools/uuid-generator" },
      { icon: "📝", name: "Base64 Encoder", desc: "Encode and decode Base64 text", href: "/tools/base64" },
      { icon: "📋", name: "JSON Formatter", desc: "Format and validate JSON data", href: "/tools/json-formatter" },
    ]},
    { name: "Security", color: "#ef4444", icon: "🛡️", tools: [
      { icon: "🔗", name: "Link Checker", desc: "Check links for scams and phishing", href: "/tools/link-checker" },
      { icon: "🌐", name: "DNS Lookup", desc: "Check domain DNS records", href: "/tools/dns-lookup" },
      { icon: "📍", name: "IP Lookup", desc: "Find location of any IP address", href: "/tools/ip-lookup" },
      { icon: "🏢", name: "WHOIS Lookup", desc: "Check domain owner and registration info", href: "/tools/whois-lookup" },
    ]},
  ];

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", height: "60px",
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(124,58,237,0.1)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
        position: "sticky", top: 0, zIndex: 100,
      }}>

        {/* LEFT: Logo + tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "0 0 auto" }}>
          <a href="/"><img src="/logo2.png" alt="2fa.ac logo" style={{ height: "32px", width: "auto" }} /></a>
          <span className="nav-desktop" style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "400", paddingLeft: "10px", borderLeft: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>
            Free Online Security & Utility Tools
          </span>
        </div>

        {/* CENTER: Desktop Nav */}
        <div className="nav-desktop" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", alignItems: "center", gap: "2px" }}>

          {/* Home */}
          <a href="/" style={{ padding: "6px 12px", borderRadius: "7px", fontSize: "13.5px", fontWeight: "500", color: "#64748b", textDecoration: "none", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#7c3aed"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; }}>
            Home
          </a>

          {/* Tools Dropdown */}
          <div style={{ position: "relative" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <a href="#" style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", borderRadius: "7px", fontSize: "13.5px", fontWeight: "500", color: "#64748b", textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#7c3aed"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; }}>
              Tools
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </a>
            {mounted && showTools && (
              <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{
                position: "fixed", top: "64px", left: "50%", transform: "translateX(-50%)",
                background: "rgba(255,255,255,0.99)", border: "1px solid rgba(124,58,237,0.12)",
                borderRadius: "20px", padding: "8px", width: "min(900px, calc(100vw - 40px))",
                zIndex: 9999, boxShadow: "0 24px 60px rgba(124,58,237,0.12), 0 8px 24px rgba(0,0,0,0.08)",
              }}>
                <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid #f1f5f9", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "2px", fontWeight: "600" }}>ALL TOOLS</span>
                  <span style={{ fontSize: "11px", color: "#cbd5e1" }}>14 tools available</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "4px", padding: "0 4px 8px" }}>
                  {categories.map(category => (
                    <div key={category.name} style={{ borderRadius: "14px", padding: "14px 12px", background: `${category.color}06`, border: `1px solid ${category.color}15` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", paddingBottom: "8px", borderBottom: `1px solid ${category.color}20` }}>
                        <span style={{ fontSize: "14px" }}>{category.icon}</span>
                        <div>
                          <div style={{ fontSize: "10px", fontWeight: "700", color: category.color, letterSpacing: "0.8px" }}>{category.name.toUpperCase()}</div>
                          <div style={{ fontSize: "10px", color: "#94a3b8" }}>{category.tools.length} tools</div>
                        </div>
                      </div>
                      {category.tools.map(tool => (
                        <a key={tool.name} href={tool.href} style={{ display: "block", padding: "6px 8px", color: "#1e293b", textDecoration: "none", borderRadius: "8px", marginBottom: "2px", fontSize: "12px", fontWeight: "500", transition: "all 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = `${category.color}10`; e.currentTarget.style.color = category.color; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1e293b"; }}>
                          {tool.icon} {tool.name}
                          <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "1px", fontWeight: "400" }}>{tool.desc}</div>
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
            <a key={item} href={`/${item.toLowerCase()}`} style={{ padding: "6px 12px", borderRadius: "7px", fontSize: "13.5px", fontWeight: "500", color: "#64748b", textDecoration: "none", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#7c3aed"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; }}>
              {item}
            </a>
          ))}
        </div>

        {/* RIGHT: Dark toggle + Mobile hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "0 0 auto" }}>
          {mounted && (
            <button onClick={toggleDark} title={darkMode ? "Light Mode" : "Dark Mode"}
              style={{ width: "36px", height: "36px", borderRadius: "9px", background: "rgba(124,58,237,0.08)", border: "1.5px solid rgba(124,58,237,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", transition: "all 0.2s" }}>
              {darkMode ? "☀️" : "🌙"}
            </button>
          )}

          {/* Hamburger - mobile only */}
          <button className="nav-mobile-btn" onClick={() => setShowMobile(!showMobile)}
            style={{ display: "none", width: "36px", height: "36px", borderRadius: "9px", background: "rgba(124,58,237,0.08)", border: "1.5px solid rgba(124,58,237,0.2)", cursor: "pointer", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "5px", padding: "8px" }}>
            <span style={{ width: "18px", height: "2px", background: showMobile ? "#7c3aed" : "#64748b", borderRadius: "2px", transition: "all 0.2s", transform: showMobile ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ width: "18px", height: "2px", background: showMobile ? "#7c3aed" : "#64748b", borderRadius: "2px", transition: "all 0.2s", opacity: showMobile ? 0 : 1 }} />
            <span style={{ width: "18px", height: "2px", background: showMobile ? "#7c3aed" : "#64748b", borderRadius: "2px", transition: "all 0.2s", transform: showMobile ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobile && (
        <div className="mobile-menu" style={{
          position: "fixed", top: "60px", left: 0, right: 0, bottom: 0,
          background: "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)",
          zIndex: 99, overflowY: "auto", padding: "16px",
        }}>
          {/* Nav Links */}
          <div style={{ marginBottom: "20px" }}>
            {[
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blog" },
              { name: "About", href: "/about" },
              { name: "Contact", href: "/contact" },
            ].map(item => (
              <a key={item.name} href={item.href} onClick={() => setShowMobile(false)}
                style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderRadius: "12px", textDecoration: "none", color: "#1e293b", fontSize: "16px", fontWeight: "600", marginBottom: "4px", background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.08)" }}>
                {item.name}
              </a>
            ))}
          </div>

          {/* All Tools */}
          <div style={{ marginBottom: "8px", fontSize: "11px", color: "#94a3b8", fontWeight: "700", letterSpacing: "1.5px", padding: "0 4px" }}>ALL TOOLS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {allTools.map(tool => (
              <a key={tool.name} href={tool.href} onClick={() => setShowMobile(false)}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 14px", borderRadius: "12px", textDecoration: "none", color: "#1e293b", fontSize: "13px", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.08)"; e.currentTarget.style.color = "#7c3aed"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#1e293b"; }}>
                <span style={{ fontSize: "18px" }}>{tool.icon}</span>
                <span>{tool.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export function PageHeaderAd() {
  return <HeaderAd />;
}

export function PageFooterAd() {
  return <FooterAd />;
}

export function Footer() {
  return (
    <footer style={{ background: "#1e1b4b", borderTop: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px 30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "32px" }}>
        <div>
          <img src="/logo1.png" alt="2fa.ac" style={{ height: "28px", marginBottom: "12px" }} />
          <p style={{ fontSize: "13px", color: "#a5b4fc", lineHeight: "1.7", maxWidth: "220px" }}>
            Free cybersecurity tools — 2FA, passwords, JWT, DNS and more. Browser-only, zero signup.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: "11px", fontWeight: "700", color: "#6366f1", letterSpacing: "2px", marginBottom: "16px" }}>POPULAR TOOLS</h4>
          {[
            { name: "TOTP Generator", href: "/" },
            { name: "Password Generator", href: "/tools/password-generator" },
            { name: "JWT Decoder", href: "/tools/jwt-decoder" },
            { name: "Hash Generator", href: "/tools/hash-generator" },
            { name: "IP Lookup", href: "/tools/ip-lookup" },
          ].map(link => (
            <a key={link.name} href={link.href} style={{ display: "block", color: "#a5b4fc", textDecoration: "none", fontSize: "13px", marginBottom: "10px" }}>{link.name}</a>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: "11px", fontWeight: "700", color: "#6366f1", letterSpacing: "2px", marginBottom: "16px" }}>CATEGORIES</h4>
          {[
            { name: "All Tools", href: "/tools" },
            { name: "2FA & QR", href: "/tools?category=2FA+%26+QR" },
            { name: "Password", href: "/tools?category=Password" },
            { name: "Developer", href: "/tools?category=Developer" },
            { name: "Blog", href: "/blog" },
          ].map(link => (
            <a key={link.name} href={link.href} style={{ display: "block", color: "#a5b4fc", textDecoration: "none", fontSize: "13px", marginBottom: "10px" }}>{link.name}</a>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: "11px", fontWeight: "700", color: "#6366f1", letterSpacing: "2px", marginBottom: "16px" }}>COMPANY</h4>
          {[
            { name: "About", href: "/about" },
            { name: "Blog", href: "/blog" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Contact", href: "/contact" },
          ].map(link => (
            <a key={link.name} href={link.href} style={{ display: "block", color: "#a5b4fc", textDecoration: "none", fontSize: "13px", marginBottom: "10px" }}>{link.name}</a>
          ))}
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 20px", textAlign: "center" }}>
        <span style={{ fontSize: "12px", color: "#6366f1" }}>© 2025 2fa.ac — Free Cybersecurity Tools for Everyone</span>
      </div>
    </footer>
  );
}