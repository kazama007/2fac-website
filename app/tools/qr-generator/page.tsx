"use client";
import { useState, useEffect, useRef } from "react";
import { Navbar, Footer } from "../../shared";
import { HeaderAd, FooterAd, SidebarAd } from "../../adsense";

function DotsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let width = canvas.width = window.innerWidth, height = canvas.height = window.innerHeight;
    const DOT_SPACING = 28, DOT_RADIUS = 1.2, mouse = { x: -999, y: -999 };
    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouseMove);
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / DOT_SPACING) + 1, rows = Math.ceil(height / DOT_SPACING) + 1;
      for (let col = 0; col < cols; col++) for (let row = 0; row < rows; row++) {
        const x = col * DOT_SPACING, y = row * DOT_SPACING, dx = mouse.x - x, dy = mouse.y - y, dist = Math.sqrt(dx*dx+dy*dy);
        ctx.beginPath(); ctx.arc(x, y, dist < 100 ? DOT_RADIUS + (1-dist/100)*1.2 : DOT_RADIUS, 0, Math.PI*2);
        ctx.fillStyle = dist < 100 ? `rgba(124,58,237,${0.3+(1-dist/100)*0.5})` : "rgba(148,163,184,0.25)"; ctx.fill();
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

const relatedTools = [
  { name: "TOTP 2FA Generator", href: "/" },
  { name: "Password Generator", href: "/tools/password-generator" },
  { name: "Password Strength Checker", href: "/tools/password-strength" },
  { name: "Hash Generator", href: "/tools/hash-generator" },
  { name: "UUID Generator", href: "/tools/uuid-generator" },
];

const relatedArticles = [
  "What is 2FA and Why You Need It",
  "How to Set Up Google Authenticator",
  "Best Authenticator Apps in 2025",
];

const faqs = [
  { q: "What is a QR Code?", a: "A QR Code is a 2D barcode that encodes text, URLs, or any data. It can be instantly read by scanning with a smartphone camera." },
  { q: "How do I use QR Code for 2FA setup?", a: "Enter your 2FA secret key, generate the QR code, then scan it with Google Authenticator or Authy. The app will automatically start generating OTP codes." },
  { q: "Is this QR Code generator secure?", a: "Yes! Everything runs in your browser. No data is sent to any server. Your secret key is never stored or logged anywhere." },
  { q: "Which apps can scan this QR Code?", a: "Google Authenticator, Authy, Microsoft Authenticator, and any standard QR scanner app can be used to scan these codes." },
  { q: "What QR size should I choose?", a: "256px is ideal for digital use, while 512px is better for printing. Larger sizes provide better scanning quality." },
];

const worksWith = [
  { name: "Google\nAuthenticator", emoji: "🔐" },
  { name: "Authy", emoji: "🛡️" },
  { name: "Microsoft\nAuthenticator", emoji: "🔷" },
  { name: "1Password", emoji: "🔑" },
  { name: "Bitwarden", emoji: "🔒" },
];

export default function QRGenerator() {
  const [text, setText] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    setMounted(true);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [qrUrl, setQrUrl] = useState("");
  const [type, setType] = useState("2fa");
  const [size, setSize] = useState(256);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const generate = () => {
    if (!text) return;
    let content = text;
    if (type === "2fa") content = `otpauth://totp/2fa.ac?secret=${text}&issuer=2fa.ac`;
    if (type === "url") content = text.startsWith("http") ? text : `https://${text}`;
    const encoded = encodeURIComponent(content);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=ffffff&color=1e293b`);
  };

  const download = () => {
    const link = document.createElement("a");
    link.href = qrUrl; link.download = "qrcode.png"; link.click();
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />
      <Navbar />
      <HeaderAd />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 16px 60px", position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>
          <a href="/" style={{ color: "#7c3aed", textDecoration: "none" }}>Home</a><span>›</span>
          <a href="/tools" style={{ color: "#7c3aed", textDecoration: "none" }}>Tools</a><span>›</span>
          <span style={{ color: "#1e293b", fontWeight: "500" }}>QR Code Generator</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "20px", marginBottom: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", flexShrink: 0, boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}>📱</div>
            <div>
              <h1 style={{ fontSize: "30px", fontWeight: "800", color: "#1e293b", margin: "0 0 4px" }}>QR Code Generator</h1>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>Generate QR codes for 2FA setup, URLs, or any text — free and instant.</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "8px 14px", fontSize: "12px", color: "#64748b" }}>
            🕐 Last updated: May 2025
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
          {[{ icon: "✅", label: "100% Free" }, { icon: "🚫", label: "No Signup" }, { icon: "🖥️", label: "Browser-Based" }, { icon: "🔒", label: "Private & Secure" }].map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", color: "#64748b", fontWeight: "500" }}>
              <span>{b.icon}</span>{b.label}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mounted && isMobile ? "1fr" : "1fr 300px", gap: "24px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(124,58,237,0.06)" }}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "10px" }}>QR Code Type</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {[{ value: "2fa", label: "🔐 2FA Secret" }, { value: "url", label: "🔗 URL" }, { value: "text", label: "📝 Text" }].map((t) => (
                    <button key={t.value} onClick={() => { setType(t.value); setText(""); setQrUrl(""); }}
                      style={{ flex: 1, padding: "10px", background: type === t.value ? "rgba(124,58,237,0.1)" : "#f8fafc", border: type === t.value ? "1.5px solid #7c3aed" : "1.5px solid #e2e8f0", borderRadius: "8px", color: type === t.value ? "#7c3aed" : "#64748b", cursor: "pointer", fontSize: "13px", fontWeight: type === t.value ? "600" : "400" }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "8px" }}>
                  {type === "2fa" ? "Enter 2FA Secret Key" : type === "url" ? "Enter URL" : "Enter Text"}
                </label>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)}
                  placeholder={type === "2fa" ? "JBSWY3DPEHPK3PXP" : type === "url" ? "https://example.com" : "Enter any text..."}
                  style={{ width: "100%", padding: "14px 16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                  onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
                  onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>QR Size</label>
                  <span style={{ fontSize: "13px", color: "#7c3aed", fontWeight: "600" }}>{size}x{size}px</span>
                </div>
                <input type="range" min="128" max="512" step="64" value={size} onChange={(e) => setSize(Number(e.target.value))} style={{ width: "100%", accentColor: "#7c3aed" }} />
              </div>

              <button onClick={generate} style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.35)", marginBottom: "16px" }}>
                Generate QR Code
              </button>

              {qrUrl && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "16px", padding: "20px", marginBottom: "14px", display: "inline-block" }}>
                    <img src={qrUrl} alt="QR Code" style={{ display: "block", borderRadius: "8px" }} />
                  </div>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <button onClick={download} style={{ padding: "10px 24px", background: "#22c55e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>⬇ Download PNG</button>
                    <button onClick={() => navigator.clipboard.writeText(qrUrl)} style={{ padding: "10px 24px", background: "#f1f5f9", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>Copy URL</button>
                  </div>
                </div>
              )}

              {type === "2fa" && (
                <div style={{ marginTop: "14px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#64748b" }}>
                  💡 <strong style={{ color: "#7c3aed" }}>How to use:</strong> Enter your 2FA secret key → Generate QR → Scan with Google Authenticator or Authy.
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>About QR Code Generator</h2>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.8", margin: "0 0 10px" }}>Our free QR Code Generator lets you create QR codes instantly for 2FA authentication setup, website URLs, or any custom text. No signup required and completely private.</p>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.8", margin: 0 }}>Perfect for setting up two-factor authentication on apps like Google Authenticator, Authy, or Microsoft Authenticator.</p>
              </div>
              <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>Why Use Our QR Code Generator?</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {["Instant QR code generation — no waiting", "Supports 2FA secret keys, URLs, and text", "Download as PNG for printing or digital use", "All processing happens in your browser", "No account required — completely free", "Compatible with all QR scanner apps"].map((b, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "1.5px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: "#16a34a", fontSize: "10px", fontWeight: "700" }}>✓</span>
                      </div>
                      <span style={{ fontSize: "13px", color: "#64748b" }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "16px", padding: "20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{ fontSize: "28px", flexShrink: 0 }}>🛡️</div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Privacy & Security</h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.7", margin: 0 }}>Your 2FA secret keys and data are never sent to our servers. All QR code generation happens locally using the QR Server API with your data encoded directly in the URL. We do not store, log, or track any information you enter.</p>
              </div>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>Frequently Asked Questions</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ borderBottom: "1px solid #f1f5f9", paddingRight: i % 2 === 0 ? "16px" : "0", paddingLeft: i % 2 === 1 ? "16px" : "0", borderRight: i % 2 === 0 ? "1px solid #f1f5f9" : "none" }}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" as const }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b", paddingRight: "8px" }}>{faq.q}</span>
                      <span style={{ color: "#7c3aed", fontSize: "16px", fontWeight: "700", flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                    </button>
                    {openFaq === i && <div style={{ padding: "0 0 14px", fontSize: "13px", color: "#64748b", lineHeight: "1.7" }}>{faq.a}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(159,103,255,0.08))", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px", padding: "24px", display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ fontSize: "44px", flexShrink: 0 }}>🔐</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>Secure Your Accounts with 2FA</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 12px" }}>Use our TOTP generator to create 2FA codes and protect all your important accounts instantly.</p>
                <a href="/" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "600" }}>Try 2FA Generator →</a>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: mounted && isMobile ? "static" : "sticky", top: "90px" }}>
            <SidebarAd />
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>🔧 Related Tools</h3>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {relatedTools.map((tool, i) => (
                  <a key={i} href={tool.href} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", padding: "10px 12px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: i < relatedTools.length - 1 ? "1px solid #f8fafc" : "none" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.color = "#7c3aed"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
                    <span>→ {tool.name}</span><span style={{ fontSize: "16px", opacity: 0.4 }}>›</span>
                  </a>
                ))}
              </div>
              <a href="/tools" style={{ display: "block", textAlign: "center", marginTop: "10px", padding: "8px", background: "#f1f5f9", color: "#7c3aed", textDecoration: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>View All Tools →</a>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>📝 Related Articles</h3>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {relatedArticles.map((article, i) => (
                  <a key={i} href="/blog" style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", padding: "10px 12px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: i < relatedArticles.length - 1 ? "1px solid #f8fafc" : "none" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.color = "#7c3aed"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
                    <span>→ {article}</span><span style={{ fontSize: "16px", opacity: 0.4 }}>›</span>
                  </a>
                ))}
              </div>
              <a href="/blog" style={{ display: "block", textAlign: "center", marginTop: "10px", padding: "8px", background: "#f1f5f9", color: "#7c3aed", textDecoration: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>View All Articles →</a>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>🔗 Works With</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "8px", marginBottom: "10px" }}>
                {worksWith.map((app, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(124,58,237,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{app.emoji}</div>
                    <span style={{ fontSize: "9px", color: "#94a3b8", textAlign: "center", lineHeight: "1.3", whiteSpace: "pre-line" }}>{app.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "16px", padding: "18px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#7c3aed", marginBottom: "10px" }}>⚡ Quick Info</h3>
              {[{ label: "Type", value: "Free Tool" }, { label: "Processing", value: "Browser-based" }, { label: "Account Required", value: "No" }, { label: "Data Stored", value: "None" }, { label: "Formats", value: "PNG Image" }].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 4 ? "1px solid rgba(124,58,237,0.08)" : "none" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>{item.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#1e293b" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <FooterAd />
      <Footer />
    </main>
  );
}