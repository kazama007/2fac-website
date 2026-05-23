"use client";
import { useState, useEffect, useRef } from "react";

function DotsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const mouse = { x: width / 2, y: height / 2 };
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; baseX: number; baseY: number }[] = [];
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({ x, y, baseX: x, baseY: y, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.5 + 0.2 });
    }
    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouseMove);
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        const dx = mouse.x - p.x; const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) { const force = (150 - dist) / 150; p.vx += (dx / dist) * force * 0.3; p.vy += (dy / dist) * force * 0.3; }
        p.vx += (p.baseX - p.x) * 0.003; p.vy += (p.baseY - p.y) * 0.003;
        p.vx *= 0.95; p.vy *= 0.95; p.x += p.vx; p.y += p.vy;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,58,237,${p.opacity})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) { ctx.beginPath(); ctx.strokeStyle = `rgba(124,58,237,${0.2 * (1 - dist / 100)})`; ctx.lineWidth = 0.5; ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); }
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
    const path = urlObj.pathname.toLowerCase();
    const fullUrl = url.toLowerCase();

    // Check URL length
    if (url.length > 100) { risks.push({ level: "medium", message: "URL is unusually long" }); score += 20; }

    // Check suspicious keywords
    const foundKeywords = suspiciousKeywords.filter(k => fullUrl.includes(k));
    if (foundKeywords.length > 0) { risks.push({ level: "medium", message: `Contains suspicious keywords: ${foundKeywords.slice(0, 3).join(", ")}` }); score += foundKeywords.length * 10; }

    // Check suspicious TLDs
    const suspTLD = suspiciousTLDs.find(tld => domain.endsWith(tld));
    if (suspTLD) { risks.push({ level: "high", message: `Suspicious domain extension: ${suspTLD}` }); score += 40; }

    // Check URL shorteners
    const isShortener = shorteners.some(s => domain.includes(s));
    if (isShortener) { risks.push({ level: "medium", message: "URL shortener detected — destination unknown" }); score += 25; }

    // Check IP address instead of domain
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) { risks.push({ level: "high", message: "IP address used instead of domain name" }); score += 50; }

    // Check multiple subdomains
    const subdomains = domain.split(".").length - 2;
    if (subdomains > 2) { risks.push({ level: "medium", message: "Too many subdomains — possible spoofing" }); score += 20; }

    // Check HTTPS
    if (!url.startsWith("https")) { risks.push({ level: "medium", message: "Not using HTTPS — connection may be insecure" }); score += 15; }

    // Check encoded characters
    if (url.includes("%") && url.match(/%[0-9a-fA-F]{2}/g)?.length! > 3) { risks.push({ level: "medium", message: "Multiple encoded characters detected" }); score += 20; }

    // Check double domain spoofing
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
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }
}

export default function LinkChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!url) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setResult(analyzeLink(url));
    setLoading(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a1a", color: "#ffffff", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />

      <nav style={{ padding: "22px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo.png" alt="2fa.ac" style={{ height: "30px" }} />
        </a>
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="/" style={{ color: "#a0a0b0", textDecoration: "none", fontSize: "14px" }}>Home</a>
          <a href="/tools" style={{ color: "#a0a0b0", textDecoration: "none", fontSize: "14px" }}>Tools</a>
        </div>
      </nav>

      <section style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#a0a0b0", textDecoration: "none", fontSize: "14px", marginBottom: "20px", padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}>
          ← Back to Homepage
        </a>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "40px", backdropFilter: "blur(20px)" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔗</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>Link Checker</h1>
            <p style={{ color: "#a0a0b0", fontSize: "14px" }}>Check any URL for scams, phishing, and suspicious patterns</p>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "14px", color: "#a0a0b0", display: "block", marginBottom: "8px" }}>Enter URL to check</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && check()}
              placeholder="https://example.com or paste any suspicious link..."
              style={{ width: "100%", padding: "16px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", color: "white", fontSize: "15px", boxSizing: "border-box", outline: "none" }}
            />
          </div>

          <button onClick={check} disabled={loading} style={{ width: "100%", padding: "14px", background: "#7c3aed", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginBottom: "24px", opacity: loading ? 0.7 : 1 }}>
            {loading ? "🔍 Analyzing..." : "Check Link Safety"}
          </button>

          {result && !result.valid && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444" }}>
              ❌ {result.error}
            </div>
          )}

          {result && result.valid && (
            <>
              {/* Verdict */}
              <div style={{ background: `rgba(${result.verdict === "safe" ? "34,197,94" : result.verdict === "suspicious" ? "245,158,11" : "239,68,68"},0.1)`, border: `1px solid rgba(${result.verdict === "safe" ? "34,197,94" : result.verdict === "suspicious" ? "245,158,11" : "239,68,68"},0.3)`, borderRadius: "16px", padding: "24px", textAlign: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>{result.verdictIcon}</div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: result.verdictColor, marginBottom: "4px", textTransform: "capitalize" }}>
                  {result.verdict === "safe" ? "Looks Safe" : result.verdict === "suspicious" ? "Suspicious" : "Dangerous!"}
                </div>
                <div style={{ fontSize: "14px", color: "#a0a0b0" }}>Domain: {result.domain}</div>

                {/* Score Bar */}
                <div style={{ marginTop: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#a0a0b0", marginBottom: "6px" }}>
                    <span>Risk Score</span>
                    <span style={{ color: result.verdictColor, fontWeight: "600" }}>{result.score}/100</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "4px", height: "8px" }}>
                    <div style={{ width: `${result.score}%`, height: "100%", background: result.verdictColor, borderRadius: "4px", transition: "width 0.5s" }} />
                  </div>
                </div>
              </div>

              {/* Risk Details */}
              {result.risks.length > 0 ? (
                <div>
                  <p style={{ fontSize: "14px", color: "#a0a0b0", marginBottom: "12px" }}>Risk Factors Found:</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {result.risks.map((risk: any, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 16px", background: risk.level === "high" ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)", border: `1px solid ${risk.level === "high" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)"}`, borderRadius: "10px" }}>
                        <span style={{ fontSize: "16px" }}>{risk.level === "high" ? "🔴" : "🟡"}</span>
                        <span style={{ fontSize: "13px", color: risk.level === "high" ? "#ef4444" : "#f59e0b" }}>{risk.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", padding: "16px", fontSize: "14px", color: "#22c55e", textAlign: "center" }}>
                  ✅ No suspicious patterns detected
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ marginTop: "20px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#a0a0b0", lineHeight: "1.6" }}>
          ⚠️ <strong style={{ color: "#fff" }}>Disclaimer:</strong> This tool analyzes URL patterns only. It cannot guarantee 100% accuracy. Always be careful with suspicious links.
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b0", fontSize: "14px", marginTop: "40px", position: "relative", zIndex: 1 }}>
        © 2025 2fa.ac — Free Cybersecurity Tools for Everyone
      </footer>
    </main>
  );
}