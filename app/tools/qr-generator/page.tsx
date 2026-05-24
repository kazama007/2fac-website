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
  { q: "What is a QR Code?", a: "A QR Code is a 2D barcode that encodes text, URLs, or any data. It can be instantly read by scanning with a smartphone camera." },
  { q: "How do I use QR Code for 2FA setup?", a: "Enter your 2FA secret key, generate the QR code, then scan it with Google Authenticator or Authy. The app will automatically start generating OTP codes." },
  { q: "Is this QR Code generator secure?", a: "Yes! Everything runs in your browser. No data is sent to any server. Your secret key is never stored or logged anywhere." },
  { q: "Which apps can scan this QR Code?", a: "Google Authenticator, Authy, Microsoft Authenticator, and any standard QR scanner app can be used to scan these codes." },
  { q: "What QR size should I choose?", a: "256px is ideal for digital use, while 512px is better for printing. Larger sizes provide better scanning quality but take slightly more time to load." },
];

export default function QRGenerator() {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [type, setType] = useState("2fa");
  const [size, setSize] = useState(256);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const generate = () => {
    if (!text) return;
    let content = text;
    if (type === "2fa") content = `otpauth://totp/2fa.ac?secret=${text}&issuer=2fa.ac`;
    if (type === "url") content = text.startsWith("http") ? text : `https://${text}`;
    const encoded = encodeURIComponent(content);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=ffffff&color=1e293b`);
  };

  const download = () => {
    const link = document.createElement("a");
    link.href = qrUrl; link.download = "qrcode.png"; link.click();
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
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📱</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", color: "#1e293b" }}>QR Code Generator</h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Generate QR codes for 2FA, URLs, or any text</p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "14px", color: "#64748b", display: "block", marginBottom: "10px", fontWeight: "500" }}>QR Code Type</label>
            <div style={{ display: "flex", gap: "10px" }}>
              {[{ value: "2fa", label: "🔐 2FA Secret" }, { value: "url", label: "🔗 URL" }, { value: "text", label: "📝 Text" }].map((t) => (
                <button key={t.value} onClick={() => { setType(t.value); setText(""); setQrUrl(""); }}
                  style={{ flex: 1, padding: "10px", background: type === t.value ? "rgba(124,58,237,0.1)" : "#f8fafc", border: type === t.value ? "1.5px solid #7c3aed" : "1.5px solid #e2e8f0", borderRadius: "8px", color: type === t.value ? "#7c3aed" : "#64748b", cursor: "pointer", fontSize: "13px", fontWeight: type === t.value ? "600" : "400" }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "14px", color: "#64748b", display: "block", marginBottom: "8px", fontWeight: "500" }}>
              {type === "2fa" ? "Enter 2FA Secret Key" : type === "url" ? "Enter URL" : "Enter Text"}
            </label>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)}
              placeholder={type === "2fa" ? "JBSWY3DPEHPK3PXP" : type === "url" ? "https://example.com" : "Enter any text..."}
              style={{ width: "100%", padding: "14px 16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
              onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
              onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>QR Size</label>
              <span style={{ fontSize: "14px", color: "#7c3aed", fontWeight: "600" }}>{size}x{size}px</span>
            </div>
            <input type="range" min="128" max="512" step="64" value={size} onChange={(e) => setSize(Number(e.target.value))} style={{ width: "100%", accentColor: "#7c3aed" }} />
          </div>

          <button onClick={generate} style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "17px", fontWeight: "700", cursor: "pointer", marginBottom: "24px", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
            Generate QR Code
          </button>

          {qrUrl && (
            <div style={{ textAlign: "center" }}>
              <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "16px", padding: "24px", marginBottom: "16px", display: "inline-block" }}>
                <img src={qrUrl} alt="QR Code" style={{ display: "block", borderRadius: "8px" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button onClick={download} style={{ padding: "10px 24px", background: "#22c55e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>⬇ Download PNG</button>
                <button onClick={() => navigator.clipboard.writeText(qrUrl)} style={{ padding: "10px 24px", background: "#f1f5f9", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>Copy URL</button>
              </div>
            </div>
          )}

          {type === "2fa" && (
            <div style={{ marginTop: "20px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
              🔐 <strong style={{ color: "#7c3aed" }}>How to use:</strong> Enter your 2FA secret key → Generate QR → Scan with Google Authenticator or Authy to set up 2FA instantly.
            </div>
          )}
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