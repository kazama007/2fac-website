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

export default function QRGenerator() {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [type, setType] = useState("2fa");
  const [size, setSize] = useState(256);

  const generate = () => {
    if (!text) return;
    let content = text;
    if (type === "2fa") content = `otpauth://totp/2fa.ac?secret=${text}&issuer=2fa.ac`;
    if (type === "url") content = text.startsWith("http") ? text : `https://${text}`;
    const encoded = encodeURIComponent(content);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=0a0a1a&color=ffffff`);
  };

  const download = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "qrcode.png";
    link.click();
  };

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
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📱</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>QR Code Generator</h1>
            <p style={{ color: "#a0a0b0", fontSize: "14px" }}>Generate QR codes for 2FA, URLs, or any text</p>
          </div>

          {/* Type Selector */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "14px", color: "#a0a0b0", display: "block", marginBottom: "10px" }}>QR Code Type</label>
            <div style={{ display: "flex", gap: "10px" }}>
              {[
                { value: "2fa", label: "🔐 2FA Secret" },
                { value: "url", label: "🔗 URL" },
                { value: "text", label: "📝 Text" },
              ].map((t) => (
                <button key={t.value} onClick={() => { setType(t.value); setText(""); setQrUrl(""); }} style={{ flex: 1, padding: "10px", background: type === t.value ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.05)", border: type === t.value ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: type === t.value ? "600" : "400" }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "14px", color: "#a0a0b0", display: "block", marginBottom: "8px" }}>
              {type === "2fa" ? "Enter 2FA Secret Key" : type === "url" ? "Enter URL" : "Enter Text"}
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={type === "2fa" ? "JBSWY3DPEHPK3PXP" : type === "url" ? "https://example.com" : "Enter any text..."}
              style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
            />
          </div>

          {/* Size */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontSize: "14px", color: "#a0a0b0" }}>QR Size</label>
              <span style={{ fontSize: "14px", color: "#7c3aed", fontWeight: "600" }}>{size}x{size}px</span>
            </div>
            <input type="range" min="128" max="512" step="64" value={size} onChange={(e) => setSize(Number(e.target.value))} style={{ width: "100%", accentColor: "#7c3aed" }} />
          </div>

          {/* Generate Button */}
          <button onClick={generate} style={{ width: "100%", padding: "16px", background: "#7c3aed", color: "white", border: "none", borderRadius: "12px", fontSize: "17px", fontWeight: "600", cursor: "pointer", marginBottom: "24px" }}>
            Generate QR Code
          </button>

          {/* QR Display */}
          {qrUrl && (
            <div style={{ textAlign: "center" }}>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", marginBottom: "16px", display: "inline-block" }}>
                <img src={qrUrl} alt="QR Code" style={{ display: "block", borderRadius: "8px" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button onClick={download} style={{ padding: "10px 24px", background: "#22c55e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                  ⬇ Download PNG
                </button>
                <button onClick={() => navigator.clipboard.writeText(qrUrl)} style={{ padding: "10px 24px", background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
                  Copy URL
                </button>
              </div>
            </div>
          )}
        </div>

        {type === "2fa" && (
          <div style={{ marginTop: "20px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#a0a0b0", lineHeight: "1.6" }}>
            🔐 <strong style={{ color: "#fff" }}>How to use:</strong> Enter your 2FA secret key → Generate QR → Scan with Google Authenticator or Authy to set up 2FA instantly.
          </div>
        )}
      </section>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b0", fontSize: "14px", marginTop: "40px", position: "relative", zIndex: 1 }}>
        © 2025 2fa.ac — Free Cybersecurity Tools for Everyone
      </footer>
    </main>
  );
}