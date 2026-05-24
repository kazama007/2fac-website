"use client";
import { useState, useRef } from "react";

export function Navbar() {
  const [showTools, setShowTools] = useState(false);
  const timeoutRef = useRef<any>(null);

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

  return (
    <nav style={{ padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(124,58,237,0.1)", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
      <a href="/">
        <img src="/logo2.png" alt="2fa.ac logo" style={{ height: "36px", width: "auto" }} />
      </a>
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {/* Tools Dropdown */}
        <div style={{ position: "relative" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <a href="#" style={{ color: "#64748b", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500", padding: "8px 14px", borderRadius: "8px", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#7c3aed"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
            Tools
          </a>
          {showTools && (
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{
              position: "fixed", top: "70px", left: "50%", transform: "translateX(-50%)",
              background: "rgba(255,255,255,0.98)", border: "1px solid rgba(124,58,237,0.12)",
              borderRadius: "20px", padding: "8px", width: "min(900px, calc(100vw - 40px))",
              zIndex: 9999, boxShadow: "0 24px 60px rgba(124,58,237,0.12), 0 8px 24px rgba(0,0,0,0.08)",
            }}>
              <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid #f1f5f9", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "2px", fontWeight: "600" }}>ALL TOOLS</span>
                <span style={{ fontSize: "11px", color: "#cbd5e1" }}>13 tools available</span>
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
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1e293b"; }}
                      >
                        {tool.icon} {tool.name}
                        <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "1px", fontWeight: "400" }}>{tool.desc}</div>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>🔒 All tools run in your browser</span>
                <a href="/" style={{ fontSize: "11px", color: "#7c3aed", textDecoration: "none", fontWeight: "600" }}>View all →</a>
              </div>
            </div>
          )}
        </div>

        <a href="/blog" style={{ color: "#64748b", textDecoration: "none", fontSize: "14px", fontWeight: "500", padding: "8px 14px", borderRadius: "8px", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#7c3aed"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Blog
        </a>
        <a href="/about" style={{ color: "#64748b", textDecoration: "none", fontSize: "14px", fontWeight: "500", padding: "8px 14px", borderRadius: "8px", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#7c3aed"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; }}
        >
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
  );
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
            { name: "Authentication", href: "/" },
            { name: "Password Tools", href: "/tools/password-generator" },
            { name: "Developer Tools", href: "/tools/jwt-decoder" },
            { name: "Security Tools", href: "/tools/link-checker" },
            { name: "DNS & Network", href: "/tools/dns-lookup" },
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