"use client";
import { useState, useEffect, useRef } from "react";

function generatePassword(length: number, upper: boolean, lower: boolean, numbers: boolean, symbols: boolean): string {
  let chars = "";
  if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
  if (numbers) chars += "0123456789";
  if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { label: "Weak", color: "#ef4444", width: "25%" };
  if (score <= 4) return { label: "Fair", color: "#f59e0b", width: "50%" };
  if (score <= 5) return { label: "Good", color: "#3b82f6", width: "75%" };
  return { label: "Strong", color: "#22c55e", width: "100%" };
}

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
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
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

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = () => setPassword(generatePassword(length, upper, lower, numbers, symbols));
  const copy = () => { navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const strength = password ? getStrength(password) : null;

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a1a", color: "#ffffff", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />

      {/* Navbar */}
      <nav style={{ padding: "22px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo.png" alt="2fa.ac" style={{ height: "30px" }} />
        </a>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <a href="/" style={{ color: "#a0a0b0", textDecoration: "none", fontSize: "14px" }}>Home</a>
          <a href="/tools" style={{ color: "#a0a0b0", textDecoration: "none", fontSize: "14px" }}>Tools</a>
        </div>
      </nav>

      <section style={{ maxWidth: "700px", margin: "40px auto", padding: "0 20px", position: "relative", zIndex: 1 }}>

        {/* Back Button */}
        <a href="/" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          color: "#a0a0b0", textDecoration: "none", fontSize: "14px",
          marginBottom: "20px", padding: "8px 14px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "8px",
        }}>
          ← Back to Homepage
        </a>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "40px", backdropFilter: "blur(20px)" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔑</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>Password Generator</h1>
            <p style={{ color: "#a0a0b0", fontSize: "14px" }}>Generate strong, secure passwords instantly</p>
          </div>

          {/* Password Display */}
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "20px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "18px", color: password ? "#fff" : "#a0a0b0", wordBreak: "break-all", flex: 1 }}>
              {password || "Click Generate to create password"}
            </span>
            {password && (
              <button onClick={copy} style={{ background: copied ? "#22c55e" : "rgba(124,58,237,0.3)", border: "none", color: "white", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" }}>
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            )}
          </div>

          {/* Strength */}
          {strength && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", color: "#a0a0b0" }}>Password Strength</span>
                <span style={{ fontSize: "13px", color: strength.color, fontWeight: "600" }}>{strength.label}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "4px", height: "6px" }}>
                <div style={{ width: strength.width, height: "100%", background: strength.color, borderRadius: "4px", transition: "width 0.3s" }} />
              </div>
            </div>
          )}

          {/* Length */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", color: "#a0a0b0" }}>Password Length</label>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#7c3aed" }}>{length}</span>
            </div>
            <input type="range" min="6" max="50" value={length} onChange={(e) => setLength(Number(e.target.value))} style={{ width: "100%", accentColor: "#7c3aed" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6b7280" }}>
              <span>6</span><span>50</span>
            </div>
          </div>

          {/* Options */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{ fontSize: "14px", color: "#a0a0b0", display: "block", marginBottom: "12px" }}>Character Types</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[
                { label: "Uppercase (A-Z)", value: upper, set: setUpper },
                { label: "Lowercase (a-z)", value: lower, set: setLower },
                { label: "Numbers (0-9)", value: numbers, set: setNumbers },
                { label: "Symbols (!@#$)", value: symbols, set: setSymbols },
              ].map((opt) => (
                <div key={opt.label} onClick={() => opt.set(!opt.value)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: opt.value ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)", border: opt.value ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", cursor: "pointer", fontSize: "13px" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "4px", background: opt.value ? "#7c3aed" : "transparent", border: opt.value ? "none" : "2px solid #6b7280", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {opt.value && <span style={{ fontSize: "12px" }}>✓</span>}
                  </div>
                  {opt.label}
                </div>
              ))}
            </div>
          </div>

          <button onClick={generate} style={{ width: "100%", padding: "16px", background: "#7c3aed", color: "white", border: "none", borderRadius: "12px", fontSize: "17px", fontWeight: "600", cursor: "pointer" }}>
            Generate Password
          </button>
        </div>

        <div style={{ marginTop: "20px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#a0a0b0", lineHeight: "1.6" }}>
          🔒 <strong style={{ color: "#fff" }}>Privacy:</strong> All passwords are generated locally in your browser. Nothing is sent to any server.
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b0", fontSize: "14px", marginTop: "40px", position: "relative", zIndex: 1 }}>
        © 2025 2fa.ac — Free Cybersecurity Tools for Everyone
      </footer>
    </main>
  );
}