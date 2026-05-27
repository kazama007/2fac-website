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

function analyzeLink(url: string) {
  const suspiciousKeywords = ["login", "verify", "account", "update", "secure", "bank", "paypal", "amazon", "google", "microsoft", "apple", "password", "confirm", "signin", "wallet", "crypto", "free", "win", "prize", "click", "urgent"];
  const suspiciousTLDs = [".xyz", ".tk", ".ml", ".ga", ".cf", ".gq", ".top", ".click", ".download", ".loan"];
  const shorteners = ["bit.ly", "tinyurl", "t.co", "goo.gl", "ow.ly", "short.link", "tiny.cc", "is.gd", "buff.ly"];
  let risks: { level: "high" | "medium" | "low"; message: string }[] = [];
  let score = 0;
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    const domain = urlObj.hostname.toLowerCase();
    const fullUrl = url.toLowerCase();
    if (url.length > 100) { risks.push({ level: "medium", message: "URL is unusually long" }); score += 20; }
    const foundKeywords = suspiciousKeywords.filter(k => fullUrl.includes(k));
    if (foundKeywords.length > 0) { risks.push({ level: "medium", message: `Contains suspicious keywords: ${foundKeywords.slice(0, 3).join(", ")}` }); score += foundKeywords.length * 10; }
    const suspTLD = suspiciousTLDs.find(tld => domain.endsWith(tld));
    if (suspTLD) { risks.push({ level: "high", message: `Suspicious domain extension: ${suspTLD}` }); score += 40; }
    if (shorteners.some(s => domain.includes(s))) { risks.push({ level: "medium", message: "URL shortener detected — destination unknown" }); score += 25; }
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) { risks.push({ level: "high", message: "IP address used instead of domain name" }); score += 50; }
    if (domain.split(".").length - 2 > 2) { risks.push({ level: "medium", message: "Too many subdomains — possible spoofing" }); score += 20; }
    if (!url.startsWith("https")) { risks.push({ level: "medium", message: "Not using HTTPS — connection may be insecure" }); score += 15; }
    if (url.includes("%") && (url.match(/%[0-9a-fA-F]{2}/g) || []).length > 3) { risks.push({ level: "medium", message: "Multiple encoded characters detected" }); score += 20; }
    const knownBrands = ["paypal", "google", "amazon", "microsoft", "apple", "facebook", "netflix", "bank"];
    const spoofed = knownBrands.find(b => fullUrl.includes(b) && !domain.endsWith(`${b}.com`));
    if (spoofed) { risks.push({ level: "high", message: `Possible ${spoofed} spoofing detected` }); score += 60; }
    score = Math.min(score, 100);
    let verdict: "safe" | "suspicious" | "dangerous";
    let verdictColor: string;
    let verdictIcon: string;
    if (score >= 60) { verdict = "dangerous"; verdictColor = "#ef4444"; verdictIcon = "🚨"; }
    else if (score >= 25) { verdict = "suspicious"; verdictColor = "#f59e0b"; verdictIcon = "⚠️"; }
    else { verdict = "safe"; verdictColor = "#22c55e"; verdictIcon = "✅"; }
    return { domain, risks, score, verdict, verdictColor, verdictIcon, valid: true };
  } catch { return { valid: false, error: "Invalid URL format" }; }
}

const faqs = [
  { q: "How does this link checker work?", a: "This tool analyzes URL patterns locally in your browser. It checks for suspicious keywords, dangerous TLDs, URL shorteners, IP-based URLs, missing HTTPS, excessive subdomains, and known brand spoofing patterns." },
  { q: "Can this tool detect all phishing links?", a: "No tool can guarantee 100% detection. This tool checks for common phishing patterns but cannot verify the actual content of a website. Always use caution with unfamiliar links." },
  { q: "What makes a link suspicious?", a: "Suspicious links often have misspelled brand names, unusual domain extensions (.xyz, .tk), IP addresses instead of domains, URL shorteners hiding the destination, or missing HTTPS." },
  { q: "Is the URL I paste here stored anywhere?", a: "No! The analysis runs entirely in your browser. The URL you enter is never sent to any server or stored anywhere." },
  { q: "What should I do if a link is flagged as dangerous?", a: "Do not click or visit the link. Do not enter any personal information. If you received it via email, mark it as phishing/spam and report it." },
];

export default function LinkChecker() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    setMounted(true);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const check = async () => {
    if (!url) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setResult(analyzeLink(url));
    setLoading(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />
      <Navbar />
      <HeaderAd />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px 60px", position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>
          <a href="/" style={{ color: "#7c3aed", textDecoration: "none" }}>Home</a><span>›</span>
          <a href="/tools" style={{ color: "#7c3aed", textDecoration: "none" }}>Tools</a><span>›</span>
          <span style={{ color: "#1e293b", fontWeight: "500" }}>Link Checker</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "36px" }}>
          <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #ef4444, #f87171)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", flexShrink: 0, boxShadow: "0 8px 24px rgba(239,68,68,0.3)" }}>🔗</div>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" }}>Link Checker</h1>
            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Detect phishing links and suspicious URLs before you click — free and instant.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mounted && isMobile ? "1fr" : "1fr 320px", gap: "24px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(124,58,237,0.06)" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "8px" }}>Enter URL to check</label>
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()}
                  placeholder="https://example.com or paste any suspicious link..."
                  style={{ width: "100%", padding: "16px 20px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "15px", boxSizing: "border-box", outline: "none" }}
                  onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
                  onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
                />
              </div>
              <button onClick={check} disabled={loading || !url} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginBottom: "16px", opacity: !url ? 0.6 : 1, boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
                {loading ? "🔍 Analyzing..." : "Check Link Safety"}
              </button>

              {result && !result.valid && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444" }}>❌ {result.error}</div>
              )}

              {result && result.valid && (
                <>
                  <div style={{ background: result.verdict === "safe" ? "rgba(34,197,94,0.06)" : result.verdict === "suspicious" ? "rgba(245,158,11,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${result.verdict === "safe" ? "rgba(34,197,94,0.25)" : result.verdict === "suspicious" ? "rgba(245,158,11,0.25)" : "rgba(239,68,68,0.25)"}`, borderRadius: "16px", padding: "24px", textAlign: "center", marginBottom: "16px" }}>
                    <div style={{ fontSize: "48px", marginBottom: "8px" }}>{result.verdictIcon}</div>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: result.verdictColor, marginBottom: "4px", textTransform: "capitalize" }}>
                      {result.verdict === "safe" ? "Looks Safe" : result.verdict === "suspicious" ? "Suspicious" : "Dangerous!"}
                    </div>
                    <div style={{ fontSize: "14px", color: "#64748b" }}>Domain: {result.domain}</div>
                    <div style={{ marginTop: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
                        <span>Risk Score</span>
                        <span style={{ color: result.verdictColor, fontWeight: "600" }}>{result.score}/100</span>
                      </div>
                      <div style={{ background: "#e2e8f0", borderRadius: "4px", height: "8px" }}>
                        <div style={{ width: `${result.score}%`, height: "100%", background: result.verdictColor, borderRadius: "4px", transition: "width 0.5s" }} />
                      </div>
                    </div>
                  </div>

                  {result.risks.length > 0 ? (
                    <div>
                      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px", fontWeight: "600" }}>Risk Factors Found:</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {result.risks.map((risk: any, i: number) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 16px", background: risk.level === "high" ? "rgba(239,68,68,0.06)" : "rgba(245,158,11,0.06)", border: `1px solid ${risk.level === "high" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)"}`, borderRadius: "10px" }}>
                            <span>{risk.level === "high" ? "🔴" : "🟡"}</span>
                            <span style={{ fontSize: "13px", color: risk.level === "high" ? "#ef4444" : "#d97706" }}>{risk.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", padding: "16px", fontSize: "14px", color: "#16a34a", textAlign: "center" }}>
                      ✅ No suspicious patterns detected
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>About Link Checker</h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: "0 0 10px" }}>Our Link Checker analyzes any URL for phishing patterns, suspicious domains, URL shorteners, and known scam indicators — without ever visiting the actual link.</p>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: 0 }}>Stay safe online by checking suspicious links you receive via email, messages, or social media before clicking on them.</p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "20px" }}>How to Use</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {["Paste the suspicious URL or link in the input field.", "Click Check Link Safety to analyze the URL.", "Review the risk score and any detected risk factors.", "If the link is flagged as dangerous, do not visit it.", "For safe links, you can proceed with confidence."].map((step, i) => (
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
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", margin: 0 }}>All link analysis happens locally in your browser using pattern matching. The URLs you enter are never sent to any external server for analysis.</p>
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
              <div style={{ fontSize: "48px", flexShrink: 0 }}>🔗</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Stay Safe from Phishing Attacks</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px", lineHeight: "1.6" }}>Always check suspicious links before clicking. Use our free Link Checker to protect yourself online.</p>
                <a href="/tools/password-breach" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>Check Password Breaches →</a>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: mounted && isMobile ? "static" : "sticky", top: "90px" }}>
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>🔧 Related Tools</h3>
              {[{ name: "Password Breach Checker", href: "/tools/password-breach" }, { name: "DNS Lookup", href: "/tools/dns-lookup" }, { name: "IP Lookup", href: "/tools/ip-lookup" }, { name: "WHOIS Lookup", href: "/tools/whois-lookup" }, { name: "Password Generator", href: "/tools/password-generator" }].map((tool, i) => (
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
              {[{ label: "Type", value: "Free Tool" }, { label: "Processing", value: "Browser-based" }, { label: "Account Required", value: "No" }, { label: "Data Stored", value: "None" }, { label: "Output", value: "Risk Score" }].map((item, i) => (
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