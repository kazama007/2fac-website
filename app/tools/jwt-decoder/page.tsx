"use client";
import { useState, useEffect, useRef } from "react";
import { Navbar, Footer } from "../../shared";

function DotsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let width = canvas.width = window.innerWidth, height = canvas.height = window.innerHeight;
    const DOT_SPACING = 28, DOT_RADIUS = 1.2, mouse = { x: -999, y: -999 };
    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouseMove);
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / DOT_SPACING) + 1, rows = Math.ceil(height / DOT_SPACING) + 1;
      for (let col = 0; col < cols; col++) for (let row = 0; row < rows; row++) {
        const x = col * DOT_SPACING, y = row * DOT_SPACING, dx = mouse.x - x, dy = mouse.y - y, dist = Math.sqrt(dx*dx+dy*dy);
        ctx.beginPath(); ctx.arc(x, y, dist < 100 ? DOT_RADIUS + (1-dist/100)*1.2 : DOT_RADIUS, 0, Math.PI*2);
        ctx.fillStyle = dist < 100 ? `rgba(124,58,237,${0.3+(1-dist/100)*0.5})` : "rgba(148,163,184,0.25)"; ctx.fill();
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

const relatedTools = [
  { name: "Hash Generator", href: "/tools/hash-generator" },
  { name: "Base64 Encoder/Decoder", href: "/tools/base64" },
  { name: "UUID Generator", href: "/tools/uuid-generator" },
  { name: "JSON Formatter", href: "/tools/json-formatter" },
  { name: "Password Generator", href: "/tools/password-generator" },
];

const relatedArticles = [
  "What is 2FA and Why You Need It",
  "How JWT Tokens Work",
  "API Authentication Best Practices",
];

const quickInfo = [
  { label: "Type", value: "Free Tool" },
  { label: "Processing", value: "Browser-based" },
  { label: "Account Required", value: "No" },
  { label: "Data Stored", value: "None" },
  { label: "Output", value: "Decoded JSON" },
];

const faqs = [
  { q: "What is a JWT token?", a: "JWT (JSON Web Token) is an open standard for securely transmitting information between parties as a JSON object. It is commonly used for authentication and authorization in web applications." },
  { q: "Is it safe to paste my JWT token here?", a: "Yes! JWT tokens are decoded entirely in your browser. Nothing is sent to any server. However, never share your JWT tokens publicly as they may contain sensitive session data." },
  { q: "What are the three parts of a JWT?", a: "A JWT has three parts separated by dots: Header (algorithm and token type), Payload (claims and data), and Signature (verification). This tool decodes all three parts instantly." },
  { q: "Can this tool verify the JWT signature?", a: "No. Signature verification requires the secret key used to sign the token. This tool only decodes and displays the token structure." },
  { q: "What does token expired mean?", a: "JWT tokens have an expiry time (exp claim). If the current time is past the expiry, the token is expired and should no longer be accepted. You will need to re-authenticate to get a new token." },
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
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />
      <Navbar />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 20px 80px", position: "relative", zIndex: 1 }}>

        {/* Breadcrumbs */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>
          <a href="/" style={{ color: "#7c3aed", textDecoration: "none" }}>Home</a><span>›</span>
          <a href="/tools" style={{ color: "#7c3aed", textDecoration: "none" }}>Tools</a><span>›</span>
          <span style={{ color: "#1e293b", fontWeight: "500" }}>JWT Decoder</span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "36px" }}>
          <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", flexShrink: 0, boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}>🔍</div>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" }}>JWT Decoder</h1>
            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Decode and inspect JWT tokens instantly — view header, payload, expiry and algorithm details.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Tool Card */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(124,58,237,0.06)" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "8px" }}>Paste your JWT token</label>
                <textarea value={token} onChange={(e) => setToken(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  rows={4}
                  style={{ width: "100%", padding: "14px 16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "13px", boxSizing: "border-box", outline: "none", resize: "vertical", fontFamily: "monospace" }}
                  onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
                  onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
                />
              </div>
              <button onClick={decode} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginBottom: "20px", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
                Decode JWT
              </button>

              {result && !result.valid && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444", fontSize: "14px" }}>
                  Invalid JWT token
                </div>
              )}

              {result && result.valid && (
                <>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
                    <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "8px", padding: "6px 14px", fontSize: "13px", color: "#16a34a" }}>Valid JWT Structure</div>
                    {result.isExpired !== null && (
                      <div style={{ background: result.isExpired ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)", border: `1px solid ${result.isExpired ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, borderRadius: "8px", padding: "6px 14px", fontSize: "13px", color: result.isExpired ? "#ef4444" : "#16a34a" }}>
                        {result.isExpired ? "Token Expired" : "Token Valid"}
                      </div>
                    )}
                    {result.header?.alg && (
                      <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "8px", padding: "6px 14px", fontSize: "13px", color: "#7c3aed" }}>
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
                          <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "12px" }}>
                            <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>ISSUER (iss)</div>
                            <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{result.payload.iss}</div>
                          </div>
                        )}
                        {result.payload.sub && (
                          <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "12px" }}>
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
                          <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "12px" }}>
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
                          {copied === "payload" ? "Copied!" : "Copy"}
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
                        {copied === "header" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  )}

                  {activeTab === "signature" && (
                    <div>
                      <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "16px", fontSize: "13px", color: "#f59e0b", wordBreak: "break-all", fontFamily: "monospace" }}>
                        {result.signature}
                      </div>
                      <div style={{ marginTop: "12px", background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.25)", borderRadius: "8px", padding: "12px", fontSize: "12px", color: "#d97706" }}>
                        Signature verification requires the secret key. This tool only decodes the token structure.
                      </div>
                    </div>
                  )}
                </>
              )}

              <div style={{ marginTop: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#64748b" }}>
                🔒 <strong style={{ color: "#7c3aed" }}>Privacy:</strong> JWT tokens are decoded locally in your browser. Nothing is sent to any server.
              </div>
            </div>

            {/* About */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>About JWT Decoder</h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: "0 0 10px" }}>Our JWT Decoder lets you decode any JSON Web Token instantly. Simply paste your JWT token and get a clear breakdown of the header, payload, and signature in a readable format.</p>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: 0 }}>Perfect for developers debugging authentication issues, verifying token contents, or checking token expiry without needing any server-side tools.</p>
            </div>

            {/* How to Use */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "20px" }}>How to Use</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {["Paste your JWT token in the text area above.", "Click Decode JWT to instantly decode the token.", "View the Header tab for algorithm and token type details.", "Check the Payload tab for claims like user ID, roles, and expiry time.", "The Signature tab shows the raw signature for reference."].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", margin: 0, paddingTop: "4px" }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>Why Use Our JWT Decoder?</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Instant JWT decoding — no server required", "Shows header, payload, and signature separately", "Displays expiry time in human-readable format", "Highlights expired tokens automatically", "Works entirely in your browser — 100% private"].map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "1.5px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "#16a34a", fontSize: "11px", fontWeight: "700" }}>✓</span>
                    </div>
                    <span style={{ fontSize: "14px", color: "#64748b" }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "16px", padding: "24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ fontSize: "32px", flexShrink: 0 }}>🛡️</div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Privacy & Security</h3>
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", margin: 0 }}>JWT tokens are decoded entirely in your browser using JavaScript. No tokens are sent to any server or stored anywhere. Your sensitive authentication data stays completely private.</p>
              </div>
            </div>

            {/* FAQ */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>Frequently Asked Questions (FAQ)</h2>
              {faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < faqs.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{faq.q}</span>
                    <span style={{ color: "#7c3aed", fontSize: "18px", fontWeight: "700", flexShrink: 0, marginLeft: "12px" }}>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && <div style={{ padding: "0 0 14px", fontSize: "14px", color: "#64748b", lineHeight: "1.7" }}>{faq.a}</div>}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(159,103,255,0.08))", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px", padding: "28px", display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ fontSize: "48px", flexShrink: 0 }}>🔍</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Debug JWT Tokens Instantly</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px", lineHeight: "1.6" }}>Use our free JWT Decoder to inspect tokens and debug authentication issues fast.</p>
                <a href="/tools/hash-generator" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>Try Hash Generator →</a>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "90px" }}>
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>🔧 Related Tools</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {relatedTools.map((tool, i) => (
                  <a key={i} href={tool.href} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", padding: "8px 12px", borderRadius: "8px", display: "block" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.color = "#7c3aed"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
                    → {tool.name}
                  </a>
                ))}
              </div>
              <a href="/tools" style={{ display: "block", textAlign: "center", marginTop: "12px", padding: "8px", background: "#f1f5f9", color: "#7c3aed", textDecoration: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>View All Tools →</a>
            </div>
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>📝 Related Articles</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {relatedArticles.map((article, i) => (
                  <a key={i} href="/blog" style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", padding: "8px 12px", borderRadius: "8px", display: "block" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.color = "#7c3aed"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
                    → {article}
                  </a>
                ))}
              </div>
              <a href="/blog" style={{ display: "block", textAlign: "center", marginTop: "12px", padding: "8px", background: "#f1f5f9", color: "#7c3aed", textDecoration: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>View All Articles →</a>
            </div>
            <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "16px", padding: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#7c3aed", marginBottom: "12px" }}>⚡ Quick Info</h3>
              {quickInfo.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < quickInfo.length - 1 ? "1px solid rgba(124,58,237,0.08)" : "none" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>{item.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#1e293b" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}