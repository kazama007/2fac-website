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

const faqs = [
  { q: "What is Base64 encoding?", a: "Base64 is an encoding scheme that converts binary data into ASCII text using 64 printable characters. It is widely used to safely transmit data in text-based formats like JSON, HTML, and emails." },
  { q: "What is Base64 used for?", a: "Base64 is used to encode images in CSS/HTML (data URIs), encode binary data in JSON APIs, transmit email attachments, store binary data in databases, and embed cryptographic keys in text files." },
  { q: "Is Base64 a form of encryption?", a: "No! Base64 is encoding, not encryption. It does not provide any security. Anyone can decode a Base64 string instantly. Never use Base64 to hide sensitive information." },
  { q: "Why does Base64 end with == signs?", a: "Base64 encodes 3 bytes at a time into 4 characters. If the input length is not a multiple of 3, padding characters (=) are added to make the output length a multiple of 4." },
  { q: "Is this tool safe to use for sensitive data?", a: "All encoding and decoding happens locally in your browser — nothing is sent to any server. However, remember that Base64 is not encryption, so do not use it to secure sensitive information." },
];

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const process = () => {
    if (!input) return;
    setError("");
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError(mode === "decode" ? "Invalid Base64 string!" : "Encoding error!");
      setOutput("");
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const swap = () => {
    setInput(output); setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
    setError("");
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", color: "#1a1a2e", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />
      <Navbar />

      <section style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#7c3aed", textDecoration: "none", fontSize: "14px", marginBottom: "20px", padding: "8px 14px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "8px", fontWeight: "500" }}>
          ← Back to Homepage
        </a>

        <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "40px", boxShadow: "0 8px 40px rgba(124,58,237,0.08)" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📝</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", color: "#1e293b" }}>Base64 Encoder / Decoder</h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Encode or decode Base64 text instantly</p>
          </div>

          {/* Mode Toggle */}
          <div style={{ display: "flex", marginBottom: "24px", background: "#f1f5f9", borderRadius: "12px", padding: "4px" }}>
            <button onClick={() => { setMode("encode"); setInput(""); setOutput(""); setError(""); }}
              style={{ flex: 1, padding: "10px", background: mode === "encode" ? "#7c3aed" : "transparent", border: "none", borderRadius: "8px", color: mode === "encode" ? "white" : "#64748b", cursor: "pointer", fontSize: "14px", fontWeight: mode === "encode" ? "600" : "400", transition: "all 0.2s" }}>
              Encode
            </button>
            <button onClick={() => { setMode("decode"); setInput(""); setOutput(""); setError(""); }}
              style={{ flex: 1, padding: "10px", background: mode === "decode" ? "#7c3aed" : "transparent", border: "none", borderRadius: "8px", color: mode === "decode" ? "white" : "#64748b", cursor: "pointer", fontSize: "14px", fontWeight: mode === "decode" ? "600" : "400", transition: "all 0.2s" }}>
              Decode
            </button>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "14px", color: "#64748b", display: "block", marginBottom: "8px", fontWeight: "500" }}>
              {mode === "encode" ? "Plain Text" : "Base64 String"}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."}
              rows={5}
              style={{ width: "100%", padding: "14px 16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "14px", boxSizing: "border-box", outline: "none", resize: "vertical", fontFamily: "monospace" }}
              onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
              onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button onClick={process} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
              {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
            </button>
            {output && (
              <button onClick={swap} style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: "12px", fontSize: "14px", cursor: "pointer", fontWeight: "500" }} title="Swap input/output">
                ⇄ Swap
              </button>
            )}
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", color: "#ef4444", fontSize: "14px", marginBottom: "16px" }}>
              ❌ {error}
            </div>
          )}

          {output && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
                  {mode === "encode" ? "Base64 Output" : "Decoded Text"}
                </label>
                <button onClick={copy} style={{ background: copied ? "#22c55e" : "rgba(124,58,237,0.1)", border: copied ? "none" : "1px solid rgba(124,58,237,0.3)", color: copied ? "white" : "#7c3aed", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "16px", fontFamily: "monospace", fontSize: "13px", color: "#16a34a", wordBreak: "break-all", lineHeight: "1.6" }}>
                {output}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
          ℹ️ <strong style={{ color: "#7c3aed" }}>What is Base64?</strong> Base64 is an encoding scheme that converts binary data into ASCII text. It is commonly used to encode data in URLs, emails, and APIs.
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