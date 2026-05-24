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
  } catch {
    return { valid: false, error: "Invalid JWT token" };
  }
}

const faqs = [
  { q: "What is a JWT token?", a: "JWT (JSON Web Token) is an open standard for securely transmitting information between parties as a JSON object. It is commonly used for authentication and authorization in web applications." },
  { q: "Is it safe to paste my JWT token here?", a: "Yes! JWT tokens are decoded entirely in your browser using JavaScript. Nothing is sent to any server. However, never share your JWT tokens publicly as they may contain sensitive session data." },
  { q: "What are the three parts of a JWT?", a: "A JWT has three parts separated by dots: Header (algorithm and token type), Payload (claims/data), and Signature (verification). This tool decodes all three parts instantly." },
  { q: "Can this tool verify the JWT signature?", a: "No. Signature verification requires the secret key used to sign the token. This tool only decodes and displays the token structure. Always verify JWT signatures on your server." },
  { q: "What does 'token expired' mean?", a: "JWT tokens have an expiry time (exp claim). If the current time is past the expiry, the token is expired and should no longer be accepted. You will need to refresh or re-authenticate to get a new token." },
];

export default function JWTDecoder() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("payload");
  const [copied, setCopied] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const decode = () => {
    if (!token.trim()) return;
    setResult(decodeJWT(token.trim()));
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const formatDate = (timestamp: number) => new Date(timestamp * 1000).toLocaleString();

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", color: "#1a1a2e", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />
      <Navbar />

      <section style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#7c3aed", textDecoration: "none", fontSize: "14px", marginBottom: "20px", padding: "8px 14px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "8px", fontWeight: "500" }}>
          ← Back to Homepage
        </a>

        <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "40px", boxShadow: "0 8px 40px rgba(124,58,237,0.08)" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", color: "#1e293b" }}>JWT Decoder</h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Decode and inspect JWT tokens instantly</p>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "14px", color: "#64748b", display: "block", marginBottom: "8px", fontWeight: "500" }}>Paste your JWT token</label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"
              rows={4}
              style={{ width: "100%", padding: "14px 16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "13px", boxSizing: "border-box", outline: "none", resize: "vertical", fontFamily: "monospace" }}
              onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
              onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
            />
          </div>

          <button onClick={decode} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginBottom: "24px", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
            Decode JWT
          </button>

          {result && !result.valid && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444", fontSize: "14px" }}>
              ❌ {result.error}
            </div>
          )}

          {result && result.valid && (
            <>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", color: "#16a34a" }}>✓ Valid JWT Structure</div>
                {result.isExpired !== null && (
                  <div style={{ background: result.isExpired ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)", border: `1px solid ${result.isExpired ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, borderRadius: "8px", padding: "8px 14px", fontSize: "13px", color: result.isExpired ? "#ef4444" : "#16a34a" }}>
                    {result.isExpired ? "⚠️ Token Expired" : "✓ Token Valid"}
                  </div>
                )}
                {result.header?.alg && (
                  <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", color: "#7c3aed" }}>
                    Algorithm: {result.header.alg}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                {["payload", "header", "signature"].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 16px", background: activeTab === tab ? "#7c3aed" : "#f1f5f9", border: activeTab === tab ? "none" : "1.5px solid #e2e8f0", borderRadius: "8px", color: activeTab === tab ? "white" : "#64748b", cursor: "pointer", fontSize: "13px", fontWeight: activeTab === tab ? "600" : "400", textTransform: "capitalize" }}>
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "payload" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                    {result.payload.iss && (
                      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px" }}>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>ISSUER (iss)</div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{result.payload.iss}</div>
                      </div>
                    )}
                    {result.payload.sub && (
                      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px" }}>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>SUBJECT (sub)</div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{result.payload.sub}</div>
                      </div>
                    )}
                    {result.payload.exp && (
                      <div style={{ background: result.isExpired ? "rgba(239,68,68,0.06)" : "rgba(34,197,94,0.06)", border: `1px solid ${result.isExpired ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`, borderRadius: "10px", padding: "12px" }}>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>EXPIRES (exp)</div>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: result.isExpired ? "#ef4444" : "#16a34a" }}>{formatDate(result.payload.exp)}</div>
                      </div>
                    )}
                    {result.payload.iat && (
                      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px" }}>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>ISSUED AT (iat)</div>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>{formatDate(result.payload.iat)}</div>
                      </div>
                    )}
                  </div>
                  <div style={{ position: "relative" }}>
                    <pre style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "16px", fontSize: "13px", color: "#16a34a", overflow: "auto", margin: 0, fontFamily: "monospace" }}>
                      {JSON.stringify(result.payload, null, 2)}
                    </pre>
                    <button onClick={() => copy(JSON.stringify(result.payload, null, 2), "payload")} style={{ position: "absolute", top: "10px", right: "10px", background: copied === "payload" ? "#22c55e" : "#e2e8f0", border: "none", color: copied === "payload" ? "white" : "#64748b", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" }}>
                      {copied === "payload" ? "✓" : "Copy"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "header" && (
                <div style={{ position: "relative" }}>
                  <pre style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "16px", fontSize: "13px", color: "#7c3aed", overflow: "auto", margin: 0, fontFamily: "monospace" }}>
                    {JSON.stringify(result.header, null, 2)}
                  </pre>
                  <button onClick={() => copy(JSON.stringify(result.header, null, 2), "header")} style={{ position: "absolute", top: "10px", right: "10px", background: copied === "header" ? "#22c55e" : "#e2e8f0", border: "none", color: copied === "header" ? "white" : "#64748b", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" }}>
                    {copied === "header" ? "✓" : "Copy"}
                  </button>
                </div>
              )}

              {activeTab === "signature" && (
                <div>
                  <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "16px", fontSize: "13px", color: "#f59e0b", wordBreak: "break-all", fontFamily: "monospace" }}>
                    {result.signature}
                  </div>
                  <div style={{ marginTop: "12px", background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.25)", borderRadius: "8px", padding: "12px", fontSize: "12px", color: "#d97706" }}>
                    ⚠️ Signature verification requires the secret key. This tool only decodes the token structure.
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ marginTop: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
          🔒 <strong style={{ color: "#7c3aed" }}>Privacy:</strong> JWT tokens are decoded locally in your browser. Nothing is sent to any server.
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