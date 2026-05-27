"use client";
import { useState, useEffect, useRef } from "react";
import { Navbar, Footer } from "../../shared";
import { HeaderAd, FooterAd } from "../../adsense";

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

function generatePassword(length: number, upper: boolean, lower: boolean, numbers: boolean, symbols: boolean): string {
  let chars = "";
  if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
  if (numbers) chars += "0123456789";
  if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++; if (password.length >= 12) score++; if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++; if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++; if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { label: "Weak", color: "#ef4444", width: "25%" };
  if (score <= 4) return { label: "Fair", color: "#f59e0b", width: "50%" };
  if (score <= 5) return { label: "Good", color: "#3b82f6", width: "75%" };
  return { label: "Strong", color: "#22c55e", width: "100%" };
}

const faqs = [
  { q: "What makes a password strong?", a: "A strong password is at least 12-16 characters long and includes uppercase, lowercase, numbers, and special symbols. Avoid using common words or personal information." },
  { q: "How often should I change my password?", a: "Change passwords every 3-6 months, or immediately if you suspect a breach. Use unique passwords for every account to minimize risk." },
  { q: "Is it safe to use this password generator?", a: "Yes! All passwords are generated entirely in your browser using JavaScript. No passwords are sent to any server or stored anywhere." },
  { q: "Should I use a password manager?", a: "Absolutely! Password managers like Bitwarden or 1Password store and autofill your passwords securely, so you only need to remember one master password." },
  { q: "Why should I avoid reusing passwords?", a: "If one account is compromised, attackers try the same password on other sites. Using unique passwords for each account keeps all your other accounts safe." },
];

export default function PasswordGenerator() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    setMounted(true);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const generate = () => setPassword(generatePassword(length, upper, lower, numbers, symbols));
  const copy = () => { navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const strength = password ? getStrength(password) : null;

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />
      <Navbar />
      <HeaderAd />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 16px 60px", position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>
          <a href="/" style={{ color: "#7c3aed", textDecoration: "none" }}>Home</a><span>›</span>
          <a href="/tools" style={{ color: "#7c3aed", textDecoration: "none" }}>Tools</a><span>›</span>
          <span style={{ color: "#1e293b", fontWeight: "500" }}>Password Generator</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "20px", marginBottom: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #3b82f6, #60a5fa)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", flexShrink: 0, boxShadow: "0 8px 24px rgba(59,130,246,0.3)" }}>🔑</div>
            <div>
              <h1 style={{ fontSize: "30px", fontWeight: "800", color: "#1e293b", margin: "0 0 4px" }}>Password Generator</h1>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>Generate strong, random and secure passwords instantly — free and private.</p>
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
              <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "20px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                <span style={{ fontFamily: "monospace", fontSize: "18px", color: password ? "#1e293b" : "#94a3b8", wordBreak: "break-all", flex: 1 }}>
                  {password || "Click Generate to create password"}
                </span>
                {password && (
                  <button onClick={copy} style={{ background: copied ? "#22c55e" : "rgba(124,58,237,0.1)", border: copied ? "none" : "1.5px solid #7c3aed", color: copied ? "white" : "#7c3aed", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" }}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                )}
              </div>

              {strength && (
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", color: "#64748b" }}>Password Strength</span>
                    <span style={{ fontSize: "13px", color: strength.color, fontWeight: "600" }}>{strength.label}</span>
                  </div>
                  <div style={{ background: "#e2e8f0", borderRadius: "4px", height: "6px" }}>
                    <div style={{ width: strength.width, height: "100%", background: strength.color, borderRadius: "4px", transition: "width 0.3s" }} />
                  </div>
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Password Length</label>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#7c3aed" }}>{length}</span>
                </div>
                <input type="range" min="6" max="50" value={length} onChange={(e) => setLength(Number(e.target.value))} style={{ width: "100%", accentColor: "#7c3aed" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}><span>6</span><span>50</span></div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "10px" }}>Character Types</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[{ label: "Uppercase (A-Z)", value: upper, set: setUpper }, { label: "Lowercase (a-z)", value: lower, set: setLower }, { label: "Numbers (0-9)", value: numbers, set: setNumbers }, { label: "Symbols (!@#$)", value: symbols, set: setSymbols }].map((opt) => (
                    <div key={opt.label} onClick={() => opt.set(!opt.value)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: opt.value ? "rgba(124,58,237,0.08)" : "#f8fafc", border: opt.value ? "1.5px solid #7c3aed" : "1.5px solid #e2e8f0", borderRadius: "10px", cursor: "pointer", fontSize: "13px", color: opt.value ? "#7c3aed" : "#64748b" }}>
                      <div style={{ width: "18px", height: "18px", borderRadius: "4px", background: opt.value ? "#7c3aed" : "transparent", border: opt.value ? "none" : "2px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {opt.value && <span style={{ fontSize: "12px", color: "white" }}>✓</span>}
                      </div>
                      {opt.label}
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={generate} style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
                Generate Password
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>About Password Generator</h2>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.8", margin: "0 0 10px" }}>Our Password Generator helps you create strong, random and secure passwords in seconds. A good password protects your accounts from hacking and brute force attacks.</p>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.8", margin: 0 }}>Customize the length and choose character types to create the perfect password for any account.</p>
              </div>
              <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>Why Use Our Password Generator?</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {["Creates strong and random passwords", "All generation happens in your browser", "No data stored on our servers", "Customizable length up to 50 chars", "Supports symbols, numbers, and more", "100% Free — no signup required"].map((b, i) => (
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

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>How to Use</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Choose the desired password length using the slider (6 to 50 characters).", "Select the character types you want to include: uppercase, lowercase, numbers, or symbols.", "Click the Generate Password button to instantly create a secure password.", "Copy your password and store it in a password manager for safety."].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.7", margin: 0, paddingTop: "3px" }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "16px", padding: "20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{ fontSize: "28px", flexShrink: 0 }}>🛡️</div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Privacy & Security</h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.7", margin: 0 }}>All passwords are generated locally in your browser using JavaScript. Your data never leaves your device. We do not store or track any information you enter on this page.</p>
              </div>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>Frequently Asked Questions (FAQ)</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ borderBottom: "1px solid #f1f5f9", paddingRight: i % 2 === 0 ? "16px" : "0", paddingLeft: i % 2 === 1 ? "16px" : "0", borderRight: i % 2 === 0 ? "1px solid #f1f5f9" : "none" }}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b", paddingRight: "8px" }}>{faq.q}</span>
                      <span style={{ color: "#7c3aed", fontSize: "16px", fontWeight: "700", flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                    </button>
                    {openFaq === i && <div style={{ padding: "0 0 14px", fontSize: "13px", color: "#64748b", lineHeight: "1.7" }}>{faq.a}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(159,103,255,0.08))", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px", padding: "24px", display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ fontSize: "44px", flexShrink: 0 }}>🔑</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>Generate Strong Passwords & Stay Secure</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 12px" }}>Also check if your password has been exposed in a data breach.</p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <a href="/tools/password-strength" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "600" }}>Check Strength →</a>
                  <a href="/tools/password-breach" style={{ display: "inline-block", background: "#f1f5f9", color: "#64748b", textDecoration: "none", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", border: "1.5px solid #e2e8f0" }}>Check Breaches →</a>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: mounted && isMobile ? "static" : "sticky", top: "90px" }}>
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>🔧 Related Tools</h3>
              {[{ name: "Password Strength Checker", href: "/tools/password-strength" }, { name: "Password Breach Checker", href: "/tools/password-breach" }, { name: "TOTP 2FA Generator", href: "/" }, { name: "Hash Generator", href: "/tools/hash-generator" }, { name: "UUID Generator", href: "/tools/uuid-generator" }].map((tool, i, arr) => (
                <a key={i} href={tool.href} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", padding: "10px 12px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: i < arr.length - 1 ? "1px solid #f8fafc" : "none" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.color = "#7c3aed"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
                  <span>→ {tool.name}</span><span style={{ opacity: 0.4 }}>›</span>
                </a>
              ))}
              <a href="/tools" style={{ display: "block", textAlign: "center", marginTop: "10px", padding: "8px", background: "#f1f5f9", color: "#7c3aed", textDecoration: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>View All Tools →</a>
            </div>
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>📝 Related Articles</h3>
              {["What is 2FA and Why You Need It", "How to Create Strong Passwords", "Best Password Managers in 2025"].map((article, i, arr) => (
                <a key={i} href="/blog" style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", padding: "10px 12px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: i < arr.length - 1 ? "1px solid #f8fafc" : "none" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.color = "#7c3aed"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
                  <span>→ {article}</span><span style={{ opacity: 0.4 }}>›</span>
                </a>
              ))}
              <a href="/blog" style={{ display: "block", textAlign: "center", marginTop: "10px", padding: "8px", background: "#f1f5f9", color: "#7c3aed", textDecoration: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>View All Articles →</a>
            </div>
            <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "16px", padding: "18px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#7c3aed", marginBottom: "10px" }}>⚡ Quick Info</h3>
              {[{ label: "Type", value: "Free Tool" }, { label: "Processing", value: "Browser-based" }, { label: "Account Required", value: "No" }, { label: "Data Stored", value: "None" }, { label: "Max Length", value: "50 chars" }].map((item, i) => (
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