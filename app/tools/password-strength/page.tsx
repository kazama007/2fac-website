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

const faqs = [
  { q: "What makes a password strong?", a: "A strong password is at least 12-16 characters long and includes uppercase letters, lowercase letters, numbers, and special symbols. Avoid common words, names, or predictable patterns." },
  { q: "Is my password safe to enter here?", a: "Yes! Your password never leaves your browser. All strength checks are performed locally using JavaScript. Nothing is sent to any server or stored anywhere." },
  { q: "What does 'time to crack' mean?", a: "It estimates how long it would take a hacker using brute-force methods to guess your password. A 'Centuries' rating means your password is practically uncrackable with current technology." },
  { q: "Why should I avoid common passwords?", a: "Hackers use dictionaries of millions of common passwords to attack accounts. Passwords like 'password123' or 'qwerty' are cracked in seconds. Always use unique, random passwords." },
  { q: "How often should I update my passwords?", a: "Update passwords every 3-6 months, or immediately if you suspect a breach. Use a password manager like Bitwarden or 1Password to keep track of unique passwords for every account." },
];

export default function PasswordStrength() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const result = password ? checkStrength(password) : null;

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", color: "#1a1a2e", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />
      <Navbar />

      <section style={{ maxWidth: "700px", margin: "40px auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#7c3aed", textDecoration: "none", fontSize: "14px", marginBottom: "20px", padding: "8px 14px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "8px", fontWeight: "500" }}>
          ← Back to Homepage
        </a>

        <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "40px", boxShadow: "0 8px 40px rgba(124,58,237,0.08)" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>💪</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", color: "#1e293b" }}>Password Strength Checker</h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Check how strong your password is</p>
          </div>

          {/* Input */}
          <div style={{ position: "relative", marginBottom: "24px" }}>
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {/* Strength Bar */}
              <div style={{ marginBottom: "28px" }}>
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

              {/* Checks */}
              <div>
                <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "12px", fontWeight: "500" }}>Password Requirements:</p>
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
        </div>

        <div style={{ marginTop: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
          🔒 <strong style={{ color: "#7c3aed" }}>Privacy:</strong> Your password is never sent to any server. All checks happen locally in your browser.
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