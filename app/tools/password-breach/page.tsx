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

async function sha1(str: string): Promise<string> {
  const buffer = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export default function PasswordBreach() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const check = async () => {
    if (!password) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const hash = await sha1(password);
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);
      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
        headers: { "Add-Padding": "true" }
      });
      const text = await res.text();
      const lines = text.split("\n");
      const found = lines.find(line => line.startsWith(suffix));
      if (found) {
        const count = parseInt(found.split(":")[1].trim());
        setResult({ breached: true, count });
      } else {
        setResult({ breached: false });
      }
    } catch {
      setError("Failed to check. Please try again.");
    }
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

      <section style={{ maxWidth: "700px", margin: "40px auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#a0a0b0", textDecoration: "none", fontSize: "14px", marginBottom: "20px", padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}>
          ← Back to Homepage
        </a>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "40px", backdropFilter: "blur(20px)" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔓</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>Password Breach Checker</h1>
            <p style={{ color: "#a0a0b0", fontSize: "14px" }}>Check if your password was exposed in a data breach</p>
          </div>

          {/* Input */}
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setResult(null); }}
              onKeyDown={(e) => e.key === "Enter" && check()}
              placeholder="Enter password to check..."
              style={{ width: "100%", padding: "16px 50px 16px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", color: "white", fontSize: "16px", boxSizing: "border-box", outline: "none" }}
            />
            <button onClick={() => setShow(!show)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#a0a0b0", cursor: "pointer", fontSize: "20px" }}>
              {show ? "🙈" : "👁️"}
            </button>
          </div>

          <button onClick={check} disabled={loading || !password} style={{ width: "100%", padding: "14px", background: "#7c3aed", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginBottom: "24px", opacity: !password ? 0.6 : 1 }}>
            {loading ? "🔍 Checking..." : "Check Password"}
          </button>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444", marginBottom: "16px" }}>
              ❌ {error}
            </div>
          )}

          {result && (
            <div style={{
              background: result.breached ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
              border: `1px solid ${result.breached ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
              borderRadius: "16px",
              padding: "28px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "56px", marginBottom: "12px" }}>
                {result.breached ? "🚨" : "✅"}
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: result.breached ? "#ef4444" : "#22c55e", marginBottom: "8px" }}>
                {result.breached ? "Password Compromised!" : "Password Not Found"}
              </div>
              <div style={{ fontSize: "15px", color: "#a0a0b0", lineHeight: "1.6" }}>
                {result.breached ? (
                  <>
                    This password has been seen <strong style={{ color: "#ef4444" }}>{result.count.toLocaleString()} times</strong> in data breaches.
                    <br />You should change it immediately!
                  </>
                ) : (
                  <>This password was not found in any known data breach.<br />However, always use strong unique passwords.</>
                )}
              </div>

              {result.breached && (
                <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href="/tools/password-generator" style={{ padding: "10px 20px", background: "#7c3aed", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
                    🔑 Generate Strong Password
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* How it works */}
        <div style={{ marginTop: "20px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#a0a0b0", lineHeight: "1.6" }}>
          🔒 <strong style={{ color: "#fff" }}>How it works (k-anonymity):</strong> Your password is never sent anywhere. We hash it locally, send only the first 5 characters of the hash to HaveIBeenPwned API, and check the results. Your password stays 100% private.
        </div>

        <div style={{ marginTop: "12px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#a0a0b0", lineHeight: "1.6" }}>
          📊 <strong style={{ color: "#fff" }}>Data source:</strong> Powered by <strong style={{ color: "#7c3aed" }}>HaveIBeenPwned</strong> — the world's largest password breach database with 10+ billion compromised passwords.
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b0", fontSize: "14px", marginTop: "40px", position: "relative", zIndex: 1 }}>
        © 2025 2fa.ac — Free Cybersecurity Tools for Everyone
      </footer>
    </main>
  );
}