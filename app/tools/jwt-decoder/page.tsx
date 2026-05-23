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

function decodeJWT(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid JWT format");
    const decode = (str: string) => {
      const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");
      return JSON.parse(atob(padded));
    };
    const header = decode(parts[0]);
    const payload = decode(parts[1]);
    const signature = parts[2];
    const isExpired = payload.exp ? payload.exp * 1000 < Date.now() : null;
    return { header, payload, signature, isExpired, valid: true };
  } catch (e) {
    return { valid: false, error: "Invalid JWT token" };
  }
}

export default function JWTDecoder() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("payload");
  const [copied, setCopied] = useState("");

  const decode = () => {
    if (!token.trim()) return;
    setResult(decodeJWT(token.trim()));
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a1a", color: "#ffffff", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />

      {/* Navbar */}
      <nav style={{ padding: "22px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo.png" alt="2fa.ac" style={{ height: "30px" }} />
        </a>
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="/" style={{ color: "#a0a0b0", textDecoration: "none", fontSize: "14px" }}>Home</a>
          <a href="/tools" style={{ color: "#a0a0b0", textDecoration: "none", fontSize: "14px" }}>Tools</a>
        </div>
      </nav>

      <section style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px", position: "relative", zIndex: 1 }}>

        {/* Back Button */}
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#a0a0b0", textDecoration: "none", fontSize: "14px", marginBottom: "20px", padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}>
          ← Back to Homepage
        </a>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "40px", backdropFilter: "blur(20px)" }}>

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>JWT Decoder</h1>
            <p style={{ color: "#a0a0b0", fontSize: "14px" }}>Decode and inspect JWT tokens instantly</p>
          </div>

          {/* Input */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "14px", color: "#a0a0b0", display: "block", marginBottom: "8px" }}>Paste your JWT token</label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"
              rows={4}
              style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", color: "white", fontSize: "13px", boxSizing: "border-box", outline: "none", resize: "vertical", fontFamily: "monospace" }}
            />
          </div>

          <button onClick={decode} style={{ width: "100%", padding: "14px", background: "#7c3aed", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginBottom: "24px" }}>
            Decode JWT
          </button>

          {/* Result */}
          {result && !result.valid && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444", fontSize: "14px" }}>
              ❌ {result.error}
            </div>
          )}

          {result && result.valid && (
            <>
              {/* Status */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", color: "#22c55e" }}>
                  ✓ Valid JWT Structure
                </div>
                {result.isExpired !== null && (
                  <div style={{ background: result.isExpired ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", border: `1px solid ${result.isExpired ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, borderRadius: "8px", padding: "8px 14px", fontSize: "13px", color: result.isExpired ? "#ef4444" : "#22c55e" }}>
                    {result.isExpired ? "⚠️ Token Expired" : "✓ Token Valid"}
                  </div>
                )}
                {result.header?.alg && (
                  <div style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", color: "#7c3aed" }}>
                    Algorithm: {result.header.alg}
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                {["payload", "header", "signature"].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 16px", background: activeTab === tab ? "#7c3aed" : "rgba(255,255,255,0.05)", border: activeTab === tab ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: activeTab === tab ? "600" : "400", textTransform: "capitalize" }}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* Payload Tab */}
              {activeTab === "payload" && (
                <div>
                  {/* Key fields */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                    {result.payload.iss && (
                      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px" }}>
                        <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>ISSUER (iss)</div>
                        <div style={{ fontSize: "14px", fontWeight: "600" }}>{result.payload.iss}</div>
                      </div>
                    )}
                    {result.payload.sub && (
                      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px" }}>
                        <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>SUBJECT (sub)</div>
                        <div style={{ fontSize: "14px", fontWeight: "600" }}>{result.payload.sub}</div>
                      </div>
                    )}
                    {result.payload.exp && (
                      <div style={{ background: result.isExpired ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)", border: `1px solid ${result.isExpired ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`, borderRadius: "10px", padding: "12px" }}>
                        <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>EXPIRES (exp)</div>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: result.isExpired ? "#ef4444" : "#22c55e" }}>{formatDate(result.payload.exp)}</div>
                      </div>
                    )}
                    {result.payload.iat && (
                      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px" }}>
                        <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>ISSUED AT (iat)</div>
                        <div style={{ fontSize: "13px", fontWeight: "600" }}>{formatDate(result.payload.iat)}</div>
                      </div>
                    )}
                  </div>

                  {/* Full JSON */}
                  <div style={{ position: "relative" }}>
                    <pre style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "16px", fontSize: "13px", color: "#22c55e", overflow: "auto", margin: 0, fontFamily: "monospace" }}>
                      {JSON.stringify(result.payload, null, 2)}
                    </pre>
                    <button onClick={() => copy(JSON.stringify(result.payload, null, 2), "payload")} style={{ position: "absolute", top: "10px", right: "10px", background: copied === "payload" ? "#22c55e" : "rgba(255,255,255,0.1)", border: "none", color: "white", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" }}>
                      {copied === "payload" ? "✓" : "Copy"}
                    </button>
                  </div>
                </div>
              )}

              {/* Header Tab */}
              {activeTab === "header" && (
                <div style={{ position: "relative" }}>
                  <pre style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "16px", fontSize: "13px", color: "#7c3aed", overflow: "auto", margin: 0, fontFamily: "monospace" }}>
                    {JSON.stringify(result.header, null, 2)}
                  </pre>
                  <button onClick={() => copy(JSON.stringify(result.header, null, 2), "header")} style={{ position: "absolute", top: "10px", right: "10px", background: copied === "header" ? "#22c55e" : "rgba(255,255,255,0.1)", border: "none", color: "white", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" }}>
                    {copied === "header" ? "✓" : "Copy"}
                  </button>
                </div>
              )}

              {/* Signature Tab */}
              {activeTab === "signature" && (
                <div>
                  <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "16px", fontSize: "13px", color: "#f59e0b", wordBreak: "break-all", fontFamily: "monospace" }}>
                    {result.signature}
                  </div>
                  <div style={{ marginTop: "12px", background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: "8px", padding: "12px", fontSize: "12px", color: "#fbbf24" }}>
                    ⚠️ Signature verification requires the secret key. This tool only decodes the token structure.
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ marginTop: "20px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#a0a0b0", lineHeight: "1.6" }}>
          🔒 <strong style={{ color: "#fff" }}>Privacy:</strong> JWT tokens are decoded locally in your browser. Nothing is sent to any server.
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b0", fontSize: "14px", marginTop: "40px", position: "relative", zIndex: 1 }}>
        © 2025 2fa.ac — Free Cybersecurity Tools for Everyone
      </footer>
    </main>
  );
}