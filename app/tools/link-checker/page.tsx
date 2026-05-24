"use client";
import { useState, useEffect, useRef } from "react";
import { Navbar, Footer } from "../../shared";

function DotsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const DOT_SPACING = 28, DOT_RADIUS = 1.2;
    const mouse = { x: -999, y: -999 };
    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouseMove);
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / DOT_SPACING) + 1;
      const rows = Math.ceil(height / DOT_SPACING) + 1;
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const x = col * DOT_SPACING, y = row * DOT_SPACING;
          const dx = mouse.x - x, dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const intensity = 1 - dist / 100;
            ctx.beginPath(); ctx.arc(x, y, DOT_RADIUS + intensity * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124,58,237,${0.3 + intensity * 0.5})`; ctx.fill();
          } else {
            ctx.beginPath(); ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(148,163,184,0.25)"; ctx.fill();
          }
        }
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
    if (url.includes("%") && url.match(/%[0-9a-fA-F]{2}/g)?.length! > 3) { risks.push({ level: "medium", message: "Multiple encoded characters detected" }); score += 20; }
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
  { q: "Can this tool detect all phishing links?", a: "No tool can guarantee 100% detection. This tool checks for common phishing patterns but cannot verify the actual content of a website. Always use caution with unfamiliar links, even if they pass this check." },
  { q: "What makes a link suspicious?", a: "Suspicious links often have: misspelled brand names, unusual domain extensions (.xyz, .tk), IP addresses instead of domains, URL shorteners hiding the destination, excessive subdomains, or missing HTTPS." },
  { q: "Is the URL I paste here stored anywhere?", a: "No! The analysis runs entirely in your browser. The URL you enter is never sent to any server or stored anywhere. Your privacy is completely protected." },
  { q: "What should I do if a link is flagged as dangerous?", a: "Do not click or visit the link. Do not enter any personal information. If you received it via email, mark it as phishing/spam. You can report it to Google Safe Browsing or your email provider." },
];

export default function LinkChecker() {
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
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", color: "#1a1a2e", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />
      <Navbar />

      <section style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#7c3aed", textDecoration: "none", fontSize: "14px", marginBottom: "20px", padding: "8px 14px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "8px", fontWeight: "500" }}>
          ← Back to Homepage
        </a>

        <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "40px", boxShadow: "0 8px 40px rgba(124,58,237,0.08)" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔗</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", color: "#1e293b" }}>Link Checker</h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Check any URL for scams, phishing, and suspicious patterns</p>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "14px", color: "#64748b", display: "block", marginBottom: "8px", fontWeight: "500" }}>Enter URL to check</label>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()}
              placeholder="https://example.com or paste any suspicious link..."
              style={{ width: "100%", padding: "16px 20px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "15px", boxSizing: "border-box", outline: "none" }}
              onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
              onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
            />
          </div>

          <button onClick={check} disabled={loading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginBottom: "24px", opacity: loading ? 0.7 : 1, boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
            {loading ? "🔍 Analyzing..." : "Check Link Safety"}
          </button>

          {result && !result.valid && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444" }}>❌ {result.error}</div>
          )}

          {result && result.valid && (
            <>
              <div style={{
                background: result.verdict === "safe" ? "rgba(34,197,94,0.06)" : result.verdict === "suspicious" ? "rgba(245,158,11,0.06)" : "rgba(239,68,68,0.06)",
                border: `1px solid ${result.verdict === "safe" ? "rgba(34,197,94,0.25)" : result.verdict === "suspicious" ? "rgba(245,158,11,0.25)" : "rgba(239,68,68,0.25)"}`,
                borderRadius: "16px", padding: "24px", textAlign: "center", marginBottom: "20px"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>{result.verdictIcon}</div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: result.verdictColor, marginBottom: "4px", textTransform: "capitalize" }}>
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
                  <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "12px", fontWeight: "500" }}>Risk Factors Found:</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {result.risks.map((risk: any, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 16px", background: risk.level === "high" ? "rgba(239,68,68,0.06)" : "rgba(245,158,11,0.06)", border: `1px solid ${risk.level === "high" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)"}`, borderRadius: "10px" }}>
                        <span style={{ fontSize: "16px" }}>{risk.level === "high" ? "🔴" : "🟡"}</span>
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

        <div style={{ marginTop: "16px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
          ⚠️ <strong style={{ color: "#ef4444" }}>Disclaimer:</strong> This tool analyzes URL patterns only. It cannot guarantee 100% accuracy. Always be careful with suspicious links.
        </div>

        {/* FAQ */}
        <div style={{ marginTop: "40px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>❓ Frequently Asked Questions</h2>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "12px", marginBottom: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{faq.q}</span>
                <span style={{ color: "#7c3aed", fontSize: "18px", fontWeight: "700", flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 20px 16px", fontSize: "14px", color: "#64748b", lineHeight: "1.7" }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}