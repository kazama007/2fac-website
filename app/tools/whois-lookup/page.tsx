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
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear autofill after mount
  useEffect(() => {
    setMounted(true);
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
      if (found) {
        setResult({ breached: true, count: parseInt(found.split(":")[1].trim()) });
      } else {
        setResult({ breached: false });
      }
    } catch {
      setError("Failed to check. Please try again.");
    }
    setLoading(false);
  };

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
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔓</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", color: "#1e293b" }}>Password Breach Checker</h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Check if your password was exposed in a data breach</p>
          </div>

          {/* Hidden dummy fields to trick browser autofill */}
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
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              name="breach-check-field"
              style={{ width: "100%", padding: "16px 50px 16px 20px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "16px", boxSizing: "border-box", outline: "none" }}
              onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
              onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
            />
            <button onClick={() => setShow(!show)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "20px" }}>
              {show ? "🙈" : "👁️"}
            </button>
          </div>

          <button onClick={check} disabled={loading || !password} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginBottom: "24px", opacity: !password ? 0.6 : 1, boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
            {loading ? "🔍 Checking..." : "Check Password"}
          </button>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444", marginBottom: "16px" }}>
              ❌ {error}
            </div>
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
        </div>

        <div style={{ marginTop: "16px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
          🔒 <strong style={{ color: "#16a34a" }}>How it works (k-anonymity):</strong> Your password is never sent anywhere. We hash it locally, send only the first 5 characters of the hash to HaveIBeenPwned API, and check the results. Your password stays 100% private.
        </div>

        <div style={{ marginTop: "12px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
          📊 <strong style={{ color: "#7c3aed" }}>Data source:</strong> Powered by <strong style={{ color: "#7c3aed" }}>HaveIBeenPwned</strong> — the world's largest password breach database with 10+ billion compromised passwords.
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