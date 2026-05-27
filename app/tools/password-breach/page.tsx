"use client";
import { useState, useEffect, useRef } from "react";
import { Navbar, Footer } from "../../shared";
import AnimatedBackground from "../../background";
import { HeaderAd, FooterAd, SidebarAd, InArticleAd } from "../../adsense";



async function sha1(str: string): Promise<string> {
  const buffer = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

const faqs = [
  { q: "Is my password sent to any server?", a: "No! Your password never leaves your browser. We use k-anonymity: only the first 5 characters of a SHA-1 hash are sent to the HaveIBeenPwned API. Your actual password stays 100% private." },
  { q: "What is HaveIBeenPwned?", a: "HaveIBeenPwned (HIBP) is the world's largest password breach database, maintained by security researcher Troy Hunt. It contains over 10 billion compromised passwords from real data breaches." },
  { q: "My password was found in a breach — what should I do?", a: "Change that password immediately on all accounts where you use it. Use our Password Generator to create a strong unique password, and consider enabling 2FA on your accounts." },
  { q: "My password was not found — does that mean it is safe?", a: "Not necessarily. It means it has not appeared in known public data breaches. You should still use a strong, unique password for every account and enable 2FA wherever possible." },
  { q: "What is k-anonymity?", a: "K-anonymity is a privacy technique where only a partial hash (first 5 characters) is shared with the API. The server returns all hashes starting with those 5 chars, and we check locally. This ensures your full password hash is never exposed." },
];

export default function PasswordBreach() {
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
  const [show, setShow] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) inputRef.current.value = "";
      setPassword("");
    }, 100);
  }, []);

  const check = async () => {
    if (!password) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const hash = await sha1(password);
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);
      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, { headers: { "Add-Padding": "true" } });
      const text = await res.text();
      const found = text.split("\n").find(line => line.startsWith(suffix));
      if (found) setResult({ breached: true, count: parseInt(found.split(":")[1].trim()) });
      else setResult({ breached: false });
    } catch { setError("Failed to check. Please try again."); }
    setLoading(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <AnimatedBackground />
      <Navbar />
      <HeaderAd />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px 60px", position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>
          <a href="/" style={{ color: "#7c3aed", textDecoration: "none" }}>Home</a><span>›</span>
          <a href="/tools" style={{ color: "#7c3aed", textDecoration: "none" }}>Tools</a><span>›</span>
          <span style={{ color: "#1e293b", fontWeight: "500" }}>Password Breach Checker</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "36px" }}>
          <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #ef4444, #f87171)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", flexShrink: 0, boxShadow: "0 8px 24px rgba(239,68,68,0.3)" }}>🔓</div>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" }}>Password Breach Checker</h1>
            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Check if your password appeared in a data breach using k-anonymity — 100% private and free.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mounted && isMobile ? "1fr" : "1fr 320px", gap: "24px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(124,58,237,0.06)" }}>
              {/* Hidden dummy fields to prevent autofill */}
              <div style={{ display: "none" }}>
                <input type="text" name="username" />
                <input type="password" name="fake-password" />
              </div>

              <div style={{ position: "relative", marginBottom: "16px" }}>
                <input
                  ref={inputRef}
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setResult(null); }}
                  onKeyDown={(e) => e.key === "Enter" && check()}
                  placeholder="Enter password to check..."
                  autoComplete="off"
                  name="breach-check-field"
                  style={{ width: "100%", padding: "16px 50px 16px 20px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "16px", boxSizing: "border-box", outline: "none" }}
                  onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
                  onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
                />
                <button onClick={() => setShow(!show)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "20px" }}>
                  {show ? "🙈" : "👁️"}
                </button>
              </div>

              <button onClick={check} disabled={loading || !password} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginBottom: "20px", opacity: !password ? 0.6 : 1, boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
                {loading ? "🔍 Checking..." : "Check Password"}
              </button>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444", marginBottom: "16px" }}>❌ {error}</div>
              )}

              {result && (
                <div style={{ background: result.breached ? "rgba(239,68,68,0.06)" : "rgba(34,197,94,0.06)", border: `1px solid ${result.breached ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`, borderRadius: "16px", padding: "28px", textAlign: "center" }}>
                  <div style={{ fontSize: "56px", marginBottom: "12px" }}>{result.breached ? "🚨" : "✅"}</div>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: result.breached ? "#ef4444" : "#16a34a", marginBottom: "8px" }}>
                    {result.breached ? "Password Compromised!" : "Password Not Found"}
                  </div>
                  <div style={{ fontSize: "15px", color: "#64748b", lineHeight: "1.6" }}>
                    {result.breached ? (
                      <>This password has been seen <strong style={{ color: "#ef4444" }}>{result.count.toLocaleString()} times</strong> in data breaches.<br />You should change it immediately!</>
                    ) : (
                      <>This password was not found in any known data breach.<br />However, always use strong unique passwords.</>
                    )}
                  </div>
                  {result.breached && (
                    <div style={{ marginTop: "20px" }}>
                      <a href="/tools/password-generator" style={{ padding: "10px 20px", background: "#7c3aed", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
                        🔑 Generate Strong Password
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: "16px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#64748b" }}>
                🔒 <strong style={{ color: "#16a34a" }}>How it works (k-anonymity):</strong> Your password is never sent anywhere. We hash it locally, send only the first 5 characters of the hash to HaveIBeenPwned API, and check the results locally.
              </div>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>About Password Breach Checker</h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: "0 0 10px" }}>Our Password Breach Checker uses the HaveIBeenPwned API with k-anonymity to safely check if your password has appeared in any known data breach — without ever sending your actual password.</p>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: 0 }}>If your password has been found in a breach, change it immediately on all accounts where you use it, and enable 2FA for extra protection.</p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "20px" }}>How to Use</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {["Enter your password in the input field above.", "Click Check Password to analyze it against the breach database.", "If your password was found, see how many times it appeared in breaches.", "If found, change that password immediately on all accounts.", "Consider using our Password Generator to create a stronger replacement."].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", margin: 0, paddingTop: "4px" }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "16px", padding: "24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ fontSize: "32px", flexShrink: 0 }}>🛡️</div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Privacy & Security</h3>
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", margin: 0 }}>Your password never leaves your browser. We hash it locally using SHA-1, then send only the first 5 characters of the hash to HaveIBeenPwned API. The server returns all matching hashes and we check locally. Your actual password is never exposed.</p>
              </div>
            </div>

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

            <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(159,103,255,0.08))", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px", padding: "28px", display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ fontSize: "48px", flexShrink: 0 }}>🔓</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Protect Your Accounts from Breaches</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px", lineHeight: "1.6" }}>Check your passwords, generate stronger ones, and enable 2FA to stay secure online.</p>
                <a href="/tools/password-generator" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>Generate Strong Password →</a>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: mounted && isMobile ? "static" : "sticky", top: "90px" }}>
            <SidebarAd />
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>🔧 Related Tools</h3>
              {[{ name: "Password Generator", href: "/tools/password-generator" }, { name: "Password Strength Checker", href: "/tools/password-strength" }, { name: "TOTP 2FA Generator", href: "/" }, { name: "QR Code Generator", href: "/tools/qr-generator" }, { name: "Link Checker", href: "/tools/link-checker" }].map((tool, i) => (
                <a key={i} href={tool.href} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", padding: "8px 12px", borderRadius: "8px", display: "block" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.color = "#7c3aed"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
                  → {tool.name}
                </a>
              ))}
              <a href="/tools" style={{ display: "block", textAlign: "center", marginTop: "12px", padding: "8px", background: "#f1f5f9", color: "#7c3aed", textDecoration: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>View All Tools →</a>
            </div>
            <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "16px", padding: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#7c3aed", marginBottom: "12px" }}>⚡ Quick Info</h3>
              {[{ label: "Type", value: "Free Tool" }, { label: "Processing", value: "k-anonymity" }, { label: "Account Required", value: "No" }, { label: "Data Stored", value: "None" }, { label: "Database", value: "10B+ passwords" }].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 4 ? "1px solid rgba(124,58,237,0.08)" : "none" }}>
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