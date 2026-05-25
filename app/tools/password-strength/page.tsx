"use client";
import { useState, useEffect, useRef } from "react";
import { Navbar, Footer } from "../../shared";

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

function checkStrength(password: string) {
  const checks = {
    length8: password.length >= 8,
    length12: password.length >= 12,
    length16: password.length >= 16,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password),
    noCommon: !["password", "123456", "qwerty", "abc123"].includes(password.toLowerCase()),
  };
  const score = Object.values(checks).filter(Boolean).length;
  let label = "Very Weak", color = "#ef4444", width = "10%";
  if (score >= 7) { label = "Very Strong"; color = "#22c55e"; width = "100%"; }
  else if (score >= 5) { label = "Strong"; color = "#3b82f6"; width = "75%"; }
  else if (score >= 4) { label = "Good"; color = "#f59e0b"; width = "55%"; }
  else if (score >= 3) { label = "Fair"; color = "#f97316"; width = "35%"; }
  const timeToCrack = score >= 7 ? "Centuries" : score >= 5 ? "Years" : score >= 4 ? "Months" : score >= 3 ? "Days" : "Minutes";
  return { checks, score, label, color, width, timeToCrack };
}

const relatedTools = [
  { name: "Password Generator", href: "/tools/password-generator" },
  { name: "Password Breach Checker", href: "/tools/password-breach" },
  { name: "TOTP 2FA Generator", href: "/" },
  { name: "Hash Generator", href: "/tools/hash-generator" },
  { name: "UUID Generator", href: "/tools/uuid-generator" },
];

const relatedArticles = [
  "What is 2FA and Why You Need It",
  "How to Create Strong Passwords",
  "Password Security Tips",
];

const quickInfo = [
  { label: "Type", value: "Free Tool" },
  { label: "Processing", value: "Browser-based" },
  { label: "Account Required", value: "No" },
  { label: "Data Stored", value: "None" },
  { label: "Output", value: "Strength Score" },
];

const faqs = [
  { q: "What makes a password strong?", a: "A strong password is at least 12-16 characters long and includes uppercase letters, lowercase letters, numbers, and special symbols. Avoid common words, names, or predictable patterns." },
  { q: "Is my password safe to enter here?", a: "Yes! Your password never leaves your browser. All strength checks are performed locally using JavaScript. Nothing is sent to any server or stored anywhere." },
  { q: "What does time to crack mean?", a: "It estimates how long it would take a hacker using brute-force methods to guess your password. A Centuries rating means your password is practically uncrackable with current technology." },
  { q: "Why should I avoid common passwords?", a: "Hackers use dictionaries of millions of common passwords to attack accounts. Passwords like password123 or qwerty are cracked in seconds. Always use unique, random passwords." },
  { q: "How often should I update my passwords?", a: "Update passwords every 3-6 months, or immediately if you suspect a breach. Use a password manager like Bitwarden or 1Password to keep track of unique passwords for every account." },
];

export default function PasswordStrength() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const result = password ? checkStrength(password) : null;

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />
      <Navbar />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 20px 80px", position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>
          <a href="/" style={{ color: "#7c3aed", textDecoration: "none" }}>Home</a><span>›</span>
          <a href="/tools" style={{ color: "#7c3aed", textDecoration: "none" }}>Tools</a><span>›</span>
          <span style={{ color: "#1e293b", fontWeight: "500" }}>Password Strength Checker</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "36px" }}>
          <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #3b82f6, #60a5fa)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", flexShrink: 0, boxShadow: "0 8px 24px rgba(59,130,246,0.3)" }}>💪</div>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" }}>Password Strength Checker</h1>
            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Test how strong your password is instantly. Get a score, crack time estimate, and improvement tips.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Tool */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(124,58,237,0.06)" }}>
              <div style={{ position: "relative", marginBottom: "20px" }}>
                <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password to check..."
                  style={{ width: "100%", padding: "16px 50px 16px 20px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "16px", boxSizing: "border-box", outline: "none" }}
                  onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
                  onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
                />
                <button onClick={() => setShow(!show)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px" }}>
                  {show ? "🙈" : "👁️"}
                </button>
              </div>

              {result && (
                <>
                  <div style={{ marginBottom: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>Strength</span>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: result.color }}>{result.label}</span>
                    </div>
                    <div style={{ background: "#e2e8f0", borderRadius: "6px", height: "10px" }}>
                      <div style={{ width: result.width, height: "100%", background: result.color, borderRadius: "6px", transition: "all 0.4s" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>Time to crack: <strong style={{ color: result.color }}>{result.timeToCrack}</strong></span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>Score: <strong style={{ color: "#1e293b" }}>{result.score}/8</strong></span>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px", fontWeight: "600" }}>Password Requirements:</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {[
                        { label: "At least 8 characters", check: result.checks.length8 },
                        { label: "At least 12 characters", check: result.checks.length12 },
                        { label: "At least 16 characters", check: result.checks.length16 },
                        { label: "Uppercase letters", check: result.checks.uppercase },
                        { label: "Lowercase letters", check: result.checks.lowercase },
                        { label: "Numbers", check: result.checks.numbers },
                        { label: "Special symbols", check: result.checks.symbols },
                        { label: "Not a common password", check: result.checks.noCommon },
                      ].map((item) => (
                        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: item.check ? "rgba(34,197,94,0.08)" : "#f8fafc", border: `1px solid ${item.check ? "rgba(34,197,94,0.3)" : "#e2e8f0"}`, borderRadius: "8px", fontSize: "12px", color: item.check ? "#16a34a" : "#94a3b8" }}>
                          <span style={{ fontWeight: "700" }}>{item.check ? "✓" : "✗"}</span>
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div style={{ marginTop: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#64748b" }}>
                🔒 <strong style={{ color: "#7c3aed" }}>Privacy:</strong> Your password is never sent to any server. All checks happen locally in your browser.
              </div>
            </div>

            {/* About */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>About Password Strength Checker</h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: "0 0 10px" }}>Our Password Strength Checker analyzes your password and gives you a detailed strength score instantly. Know if your password is weak, fair, good, or strong before using it.</p>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: 0 }}>The tool checks password length, character variety, common patterns, and known weak passwords to give you an accurate security rating with estimated crack time.</p>
            </div>

            {/* How to Use */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "20px" }}>How to Use</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  "Enter your password in the input field above.",
                  "The tool instantly analyzes your password strength.",
                  "View your strength score, crack time estimate, and detailed requirements.",
                  "Improve your password based on the suggestions shown.",
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", margin: 0, paddingTop: "4px" }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>Why Use Our Password Strength Checker?</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  "Instant password strength analysis",
                  "Shows estimated time to crack",
                  "Checks for 8 different security criteria",
                  "Works entirely in your browser — 100% private",
                  "No account required — completely free",
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "1.5px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "#16a34a", fontSize: "11px", fontWeight: "700" }}>✓</span>
                    </div>
                    <span style={{ fontSize: "14px", color: "#64748b" }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "16px", padding: "24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ fontSize: "32px", flexShrink: 0 }}>🛡️</div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Privacy & Security</h3>
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", margin: 0 }}>Your password is never sent to any server. All strength checks are performed locally in your browser using JavaScript. We do not store, log, or track any password you enter on this page.</p>
              </div>
            </div>

            {/* FAQ */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>Frequently Asked Questions (FAQ)</h2>
              {faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < faqs.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{faq.q}</span>
                    <span style={{ color: "#7c3aed", fontSize: "18px", fontWeight: "700", flexShrink: 0, marginLeft: "12px" }}>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && <div style={{ padding: "0 0 14px", fontSize: "14px", color: "#64748b", lineHeight: "1.7" }}>{faq.a}</div>}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(159,103,255,0.08))", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px", padding: "28px", display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ fontSize: "48px", flexShrink: 0 }}>💪</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Check Your Password Strength Now</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px", lineHeight: "1.6" }}>Use our free tool to test your password and get instant security feedback.</p>
                <a href="/tools/password-breach" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>Check for Breaches →</a>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "90px" }}>
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>🔧 Related Tools</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {relatedTools.map((tool, i) => (
                  <a key={i} href={tool.href} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", padding: "8px 12px", borderRadius: "8px", display: "block" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.color = "#7c3aed"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
                    → {tool.name}
                  </a>
                ))}
              </div>
              <a href="/tools" style={{ display: "block", textAlign: "center", marginTop: "12px", padding: "8px", background: "#f1f5f9", color: "#7c3aed", textDecoration: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>View All Tools →</a>
            </div>
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>📝 Related Articles</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {relatedArticles.map((article, i) => (
                  <a key={i} href="/blog" style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", padding: "8px 12px", borderRadius: "8px", display: "block" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.color = "#7c3aed"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
                    → {article}
                  </a>
                ))}
              </div>
              <a href="/blog" style={{ display: "block", textAlign: "center", marginTop: "12px", padding: "8px", background: "#f1f5f9", color: "#7c3aed", textDecoration: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>View All Articles →</a>
            </div>
            <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "16px", padding: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#7c3aed", marginBottom: "12px" }}>⚡ Quick Info</h3>
              {quickInfo.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < quickInfo.length - 1 ? "1px solid rgba(124,58,237,0.08)" : "none" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>{item.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#1e293b" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
