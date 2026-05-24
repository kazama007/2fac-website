"use client";
import { useState, useEffect, useRef } from "react";
import { Navbar, Footer } from "../../shared";

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

const faqs = [
  { q: "What makes a password strong?", a: "A strong password is at least 12-16 characters long and includes a mix of uppercase letters, lowercase letters, numbers, and special symbols. Avoid using common words or personal information." },
  { q: "How often should I change my password?", a: "It's recommended to change passwords every 3-6 months, or immediately if you suspect a breach. Use unique passwords for every account to minimize risk." },
  { q: "Is it safe to use this password generator?", a: "Yes! All passwords are generated entirely in your browser using JavaScript. No passwords are sent to any server or stored anywhere." },
  { q: "Should I use a password manager?", a: "Absolutely! Password managers like Bitwarden or 1Password store and autofill your passwords securely, so you only need to remember one master password." },
  { q: "Why should I avoid reusing passwords?", a: "If one account is compromised, attackers try the same password on other sites (credential stuffing). Using unique passwords for each account keeps all your other accounts safe." },
];

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const generate = () => setPassword(generatePassword(length, upper, lower, numbers, symbols));
  const copy = () => { navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const strength = password ? getStrength(password) : null;

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
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔑</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", color: "#1e293b" }}>Password Generator</h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Generate strong, secure passwords instantly</p>
          </div>

          {/* Password Display */}
          <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "20px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "18px", color: password ? "#1e293b" : "#94a3b8", wordBreak: "break-all", flex: 1 }}>
              {password || "Click Generate to create password"}
            </span>
            {password && (
              <button onClick={copy} style={{ background: copied ? "#22c55e" : "rgba(124,58,237,0.1)", border: copied ? "none" : "1.5px solid #7c3aed", color: copied ? "white" : "#7c3aed", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" }}>
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            )}
          </div>

          {/* Strength */}
          {strength && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", color: "#64748b" }}>Password Strength</span>
                <span style={{ fontSize: "13px", color: strength.color, fontWeight: "600" }}>{strength.label}</span>
              </div>
              <div style={{ background: "#e2e8f0", borderRadius: "4px", height: "6px" }}>
                <div style={{ width: strength.width, height: "100%", background: strength.color, borderRadius: "4px", transition: "width 0.3s" }} />
              </div>
            </div>
          )}

          {/* Length */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>Password Length</label>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#7c3aed" }}>{length}</span>
            </div>
            <input type="range" min="6" max="50" value={length} onChange={(e) => setLength(Number(e.target.value))} style={{ width: "100%", accentColor: "#7c3aed" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
              <span>6</span><span>50</span>
            </div>
          </div>

          {/* Options */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{ fontSize: "14px", color: "#64748b", display: "block", marginBottom: "12px", fontWeight: "500" }}>Character Types</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[
                { label: "Uppercase (A-Z)", value: upper, set: setUpper },
                { label: "Lowercase (a-z)", value: lower, set: setLower },
                { label: "Numbers (0-9)", value: numbers, set: setNumbers },
                { label: "Symbols (!@#$)", value: symbols, set: setSymbols },
              ].map((opt) => (
                <div key={opt.label} onClick={() => opt.set(!opt.value)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: opt.value ? "rgba(124,58,237,0.08)" : "#f8fafc", border: opt.value ? "1.5px solid #7c3aed" : "1.5px solid #e2e8f0", borderRadius: "10px", cursor: "pointer", fontSize: "13px", color: opt.value ? "#7c3aed" : "#64748b" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "4px", background: opt.value ? "#7c3aed" : "transparent", border: opt.value ? "none" : "2px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {opt.value && <span style={{ fontSize: "12px", color: "white" }}>✓</span>}
                  </div>
                  {opt.label}
                </div>
              ))}
            </div>
          </div>

          <button onClick={generate} style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "17px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
            Generate Password
          </button>
        </div>

        <div style={{ marginTop: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
          🔒 <strong style={{ color: "#7c3aed" }}>Privacy:</strong> All passwords are generated locally in your browser. Nothing is sent to any server.
        </div>

        {/* FAQ Section */}
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