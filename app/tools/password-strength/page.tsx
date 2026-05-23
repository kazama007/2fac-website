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

  let label = "Very Weak";
  let color = "#ef4444";
  let width = "10%";

  if (score >= 7) { label = "Very Strong"; color = "#22c55e"; width = "100%"; }
  else if (score >= 5) { label = "Strong"; color = "#3b82f6"; width = "75%"; }
  else if (score >= 4) { label = "Good"; color = "#f59e0b"; width = "55%"; }
  else if (score >= 3) { label = "Fair"; color = "#f97316"; width = "35%"; }

  const timeToCrack = score >= 7 ? "Centuries" : score >= 5 ? "Years" : score >= 4 ? "Months" : score >= 3 ? "Days" : "Minutes";

  return { checks, score, label, color, width, timeToCrack };
}

export default function PasswordStrength() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const result = password ? checkStrength(password) : null;

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

      <section style={{ maxWidth: "700px", margin: "40px auto", padding: "0 20px", position: "relative", zIndex: 1 }}>

        {/* Back Button */}
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#a0a0b0", textDecoration: "none", fontSize: "14px", marginBottom: "20px", padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}>
          ← Back to Homepage
        </a>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "40px", backdropFilter: "blur(20px)" }}>

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>💪</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>Password Strength Checker</h1>
            <p style={{ color: "#a0a0b0", fontSize: "14px" }}>Check how strong your password is</p>
          </div>

          {/* Input */}
          <div style={{ position: "relative", marginBottom: "24px" }}>
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password to check..."
              style={{ width: "100%", padding: "16px 50px 16px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", color: "white", fontSize: "16px", boxSizing: "border-box", outline: "none" }}
            />
            <button onClick={() => setShow(!show)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#a0a0b0", cursor: "pointer", fontSize: "18px" }}>
              {show ? "🙈" : "👁️"}
            </button>
          </div>

          {result && (
            <>
              {/* Strength Bar */}
              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", color: "#a0a0b0" }}>Strength</span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: result.color }}>{result.label}</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "6px", height: "10px" }}>
                  <div style={{ width: result.width, height: "100%", background: result.color, borderRadius: "6px", transition: "all 0.4s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                  <span style={{ fontSize: "12px", color: "#a0a0b0" }}>Time to crack: <strong style={{ color: result.color }}>{result.timeToCrack}</strong></span>
                  <span style={{ fontSize: "12px", color: "#a0a0b0" }}>Score: <strong style={{ color: "#fff" }}>{result.score}/8</strong></span>
                </div>
              </div>

              {/* Checks */}
              <div>
                <p style={{ fontSize: "14px", color: "#a0a0b0", marginBottom: "12px" }}>Password Requirements:</p>
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
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: item.check ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${item.check ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: "8px", fontSize: "12px", color: item.check ? "#22c55e" : "#6b7280" }}>
                      <span>{item.check ? "✓" : "✗"}</span>
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{ marginTop: "20px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#a0a0b0", lineHeight: "1.6" }}>
          🔒 <strong style={{ color: "#fff" }}>Privacy:</strong> Your password is never sent to any server. All checks happen locally in your browser.
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b0", fontSize: "14px", marginTop: "40px", position: "relative", zIndex: 1 }}>
        © 2025 2fa.ac — Free Cybersecurity Tools for Everyone
      </footer>
    </main>
  );
}