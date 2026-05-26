"use client";
import { useState, useRef, useEffect } from "react";
import { HeaderAd, FooterAd } from "./adsense";

export function Navbar() {
  const [showTools, setShowTools] = useState(false);
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

  const navLinkStyle: React.CSSProperties = {
    padding: "6px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#64748b",
    textDecoration: "none",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      height: "60px",
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(124,58,237,0.1)",
      boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>

      {/* LEFT: Logo + tagline */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "0 0 auto" }}>
        <a href="/"><img src="/logo2.png" alt="2fa.ac logo" style={{ height: "36px", width: "auto" }} /></a>
        <span style={{
          fontSize: "13px",
          color: "#94a3b8",
          fontWeight: "400",
          paddingLeft: "12px",
          borderLeft: "1px solid #e2e8f0",
          whiteSpace: "nowrap",
        }}>
          Free Online Security & Utility Tools
        </span>
      </div>

      {/* CENTER: Nav links — absolutely centered */}
      <div style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}>

        {/* Home */}
        <a href="/" style={{ padding: "6px 14px", borderRadius: "8px", fontSize: "14px", fontWeight: "500", color: "#64748b", textDecoration: "none", transition: "all 0.2s", whiteSpace: "nowrap" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#7c3aed"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; }}>
          Home
        </a>

        {/* Tools Dropdown */}
        <div style={{ position: "relative" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <a href="#" style={navLinkStyle}
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
              background: "rgba(255,255,255,0.98)", border: "1px solid rgba(124,58,237,0.12)",
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

        {/* Blog */}
        <a href="/blog" style={navLinkStyle}
          onMouseEnter={e => { e.currentTarget.style.color = "#7c3aed"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; }}>
          Blog
        </a>

        {/* About */}
        <a href="/about" style={navLinkStyle}
          onMouseEnter={e => { e.currentTarget.style.color = "#7c3aed"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; }}>
          About
        </a>

        {/* Contact */}
        <a href="/contact" style={navLinkStyle}
          onMouseEnter={e => { e.currentTarget.style.color = "#7c3aed"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; }}>
          Contact
        </a>
      </div>

      {/* RIGHT: Dark mode toggle only */}
      <div style={{ display: "flex", alignItems: "center", flex: "0 0 auto" }}>
        {mounted && (
          <button onClick={toggleDark} title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(124,58,237,0.08)", border: "1.5px solid rgba(124,58,237,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        )}
      </div>
    </nav>
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
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 40px 40px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px" }}>
        <div>
          <img src="/logo1.png" alt="2fa.ac" style={{ height: "32px", marginBottom: "16px" }} />
          <p style={{ fontSize: "14px", color: "#a5b4fc", lineHeight: "1.7", maxWidth: "260px" }}>
            Free cybersecurity tools — 2FA, passwords, JWT, DNS and more. Browser-only, zero signup required.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: "11px", fontWeight: "700", color: "#6366f1", letterSpacing: "2px", marginBottom: "20px" }}>POPULAR TOOLS</h4>
          {[
            { name: "TOTP Generator", href: "/" },
            { name: "Password Generator", href: "/tools/password-generator" },
            { name: "JWT Decoder", href: "/tools/jwt-decoder" },
            { name: "Hash Generator", href: "/tools/hash-generator" },
            { name: "IP Lookup", href: "/tools/ip-lookup" },
            { name: "WHOIS Lookup", href: "/tools/whois-lookup" },
          ].map(link => (
            <a key={link.name} href={link.href} style={{ display: "block", color: "#a5b4fc", textDecoration: "none", fontSize: "14px", marginBottom: "12px" }}>{link.name}</a>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: "11px", fontWeight: "700", color: "#6366f1", letterSpacing: "2px", marginBottom: "20px" }}>CATEGORIES</h4>
          {[
            { name: "All Tools", href: "/tools" },
            { name: "2FA & QR", href: "/tools?category=2FA+%26+QR" },
            { name: "Password", href: "/tools?category=Password" },
            { name: "Developer", href: "/tools?category=Developer" },
            { name: "Network", href: "/tools?category=Network" },
            { name: "Blog", href: "/blog" },
          ].map(link => (
            <a key={link.name} href={link.href} style={{ display: "block", color: "#a5b4fc", textDecoration: "none", fontSize: "14px", marginBottom: "12px" }}>{link.name}</a>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: "11px", fontWeight: "700", color: "#6366f1", letterSpacing: "2px", marginBottom: "20px" }}>COMPANY & LEGAL</h4>
          {[
            { name: "About", href: "/about" },
            { name: "Blog", href: "/blog" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Contact", href: "/contact" },
          ].map(link => (
            <a key={link.name} href={link.href} style={{ display: "block", color: "#a5b4fc", textDecoration: "none", fontSize: "14px", marginBottom: "12px" }}>{link.name}</a>
          ))}
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 40px", display: "flex", justifyContent: "space-between", maxWidth: "1100px", margin: "0 auto" }}>
        <span style={{ fontSize: "13px", color: "#6366f1" }}>© 2025 2fa.ac — Free Cybersecurity Tools for Everyone</span>
        <span style={{ fontSize: "13px", color: "#6366f1" }}>Built with ❤️ for Security</span>
      </div>
    </footer>
  );
}