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

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const faqs = [
  { q: "What is a UUID?", a: "UUID (Universally Unique Identifier) is a 128-bit label used in software to uniquely identify information without requiring a central authority. It is formatted as 32 hexadecimal digits separated by hyphens." },
  { q: "What is UUID v4?", a: "UUID v4 is generated using random or pseudo-random numbers. It is the most commonly used UUID version for general-purpose unique identifiers in applications, databases, and APIs." },
  { q: "How unique are UUIDs?", a: "UUID v4 has 122 random bits, meaning there are 5.3 x 10^36 possible values. The probability of generating two identical UUIDs is astronomically low — practically impossible in real-world use." },
  { q: "Where are UUIDs used?", a: "UUIDs are used as primary keys in databases, session identifiers, transaction IDs, file names, API request tracking, distributed systems, and anywhere a unique identifier is needed without coordination." },
  { q: "Are these UUIDs cryptographically secure?", a: "These UUIDs are generated using Math.random() which is not cryptographically secure. For security-sensitive use cases (like session tokens), use crypto.randomUUID() or a server-side UUID library." },
];

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const generate = () => setUuids(Array.from({ length: count }, () => generateUUID()));
  const copy = (uuid: string) => { navigator.clipboard.writeText(uuid); setCopied(uuid); setTimeout(() => setCopied(""), 2000); };
  const copyAll = () => { navigator.clipboard.writeText(uuids.join("\n")); setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000); };

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
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🆔</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", color: "#1e293b" }}>UUID Generator</h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Generate unique identifiers (UUID v4) instantly</p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>Number of UUIDs</label>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#7c3aed" }}>{count}</span>
            </div>
            <input type="range" min="1" max="20" value={count} onChange={(e) => setCount(Number(e.target.value))} style={{ width: "100%", accentColor: "#7c3aed" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
              <span>1</span><span>20</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            {[1, 5, 10, 20].map(n => (
              <button key={n} onClick={() => setCount(n)} style={{ flex: 1, padding: "8px", background: count === n ? "rgba(124,58,237,0.1)" : "#f8fafc", border: count === n ? "1.5px solid #7c3aed" : "1.5px solid #e2e8f0", borderRadius: "8px", color: count === n ? "#7c3aed" : "#64748b", cursor: "pointer", fontSize: "13px", fontWeight: count === n ? "600" : "400" }}>
                {n}
              </button>
            ))}
          </div>

          <button onClick={generate} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginBottom: "24px", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
            Generate {count} UUID{count > 1 ? "s" : ""}
          </button>

          {uuids.length > 0 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>{uuids.length} UUID{uuids.length > 1 ? "s" : ""} generated</span>
                <button onClick={copyAll} style={{ background: copiedAll ? "#22c55e" : "rgba(124,58,237,0.1)", border: copiedAll ? "none" : "1px solid rgba(124,58,237,0.3)", color: copiedAll ? "white" : "#7c3aed", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                  {copiedAll ? "✓ All Copied!" : "Copy All"}
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {uuids.map((uuid, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "12px 16px", gap: "12px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "14px", color: "#1e293b", flex: 1 }}>{uuid}</span>
                    <button onClick={() => copy(uuid)} style={{ background: copied === uuid ? "#22c55e" : "rgba(124,58,237,0.1)", border: copied === uuid ? "none" : "1px solid rgba(124,58,237,0.3)", color: copied === uuid ? "white" : "#7c3aed", borderRadius: "6px", padding: "4px 12px", cursor: "pointer", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>
                      {copied === uuid ? "✓" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ marginTop: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
          ℹ️ <strong style={{ color: "#7c3aed" }}>What is UUID?</strong> A Universally Unique Identifier is a 128-bit label used in software development to uniquely identify information. UUID v4 uses random numbers.
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