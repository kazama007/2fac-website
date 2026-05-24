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

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = "color:#16a34a;";
      if (/^"/.test(match)) { if (/:$/.test(match)) cls = "color:#7c3aed;"; }
      else if (/true|false/.test(match)) { cls = "color:#3b82f6;"; }
      else if (/null/.test(match)) { cls = "color:#94a3b8;"; }
      else { cls = "color:#f59e0b;"; }
      return `<span style="${cls}">${match}</span>`;
    });
}

const faqs = [
  { q: "What is JSON?", a: "JSON (JavaScript Object Notation) is a lightweight data interchange format. It is easy for humans to read and write, and easy for machines to parse and generate. It is widely used in APIs, configuration files, and data storage." },
  { q: "What does JSON formatting do?", a: "JSON formatting (also called pretty-printing) adds indentation and line breaks to make raw, minified JSON readable. It does not change the data, only its presentation." },
  { q: "What is JSON minification?", a: "JSON minification removes all unnecessary whitespace, newlines, and indentation from JSON data. This reduces file size and is useful for production APIs where bandwidth matters." },
  { q: "Why is my JSON invalid?", a: "Common JSON errors include: trailing commas after the last item, single quotes instead of double quotes, unquoted keys, and undefined or NaN values. JSON is strict about formatting." },
  { q: "Is my JSON data safe here?", a: "Yes! All JSON processing happens locally in your browser using JavaScript. Your data is never sent to any server or stored anywhere." },
];

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);
  const [stats, setStats] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const format = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted); setError("");
      const keys = JSON.stringify(parsed).match(/"[^"]+"\s*:/g)?.length || 0;
      const size = new Blob([formatted]).size;
      setStats({ keys, size: size > 1024 ? `${(size / 1024).toFixed(1)} KB` : `${size} B`, lines: formatted.split("\n").length, type: Array.isArray(parsed) ? "Array" : typeof parsed === "object" ? "Object" : typeof parsed });
    } catch (e: any) { setError(e.message); setOutput(""); setStats(null); }
  };

  const minify = () => {
    if (!input.trim()) return;
    try { const parsed = JSON.parse(input); setOutput(JSON.stringify(parsed)); setError(""); }
    catch (e: any) { setError(e.message); }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const clear = () => { setInput(""); setOutput(""); setError(""); setStats(null); };
  const loadSample = () => setInput(JSON.stringify({ name: "John Doe", age: 30, email: "john@example.com", address: { city: "New York", country: "USA" }, skills: ["JavaScript", "React", "Node.js"], active: true }));

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", color: "#1a1a2e", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />
      <Navbar />

      <section style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#7c3aed", textDecoration: "none", fontSize: "14px", marginBottom: "20px", padding: "8px 14px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "8px", fontWeight: "500" }}>
          ← Back to Homepage
        </a>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📋</div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", color: "#1e293b" }}>JSON Formatter</h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Format, validate and minify JSON data instantly</p>
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={format} style={{ padding: "10px 20px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "700", boxShadow: "0 4px 12px rgba(124,58,237,0.3)" }}>✨ Format</button>
          <button onClick={minify} style={{ padding: "10px 20px", background: "#f1f5f9", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>📦 Minify</button>
          <button onClick={loadSample} style={{ padding: "10px 20px", background: "#f1f5f9", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>📄 Sample</button>
          <button onClick={clear} style={{ padding: "10px 20px", background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>🗑 Clear</button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>Indent:</span>
            {[2, 4].map(n => (
              <button key={n} onClick={() => setIndent(n)} style={{ padding: "6px 12px", background: indent === n ? "#7c3aed" : "#f1f5f9", border: indent === n ? "none" : "1.5px solid #e2e8f0", borderRadius: "6px", color: indent === n ? "white" : "#64748b", cursor: "pointer", fontSize: "13px", fontWeight: indent === n ? "600" : "400" }}>{n}</button>
            ))}
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
            {[{ label: "Type", value: stats.type }, { label: "Keys", value: stats.keys }, { label: "Lines", value: stats.lines }, { label: "Size", value: stats.size }].map(s => (
              <div key={s.label} style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "8px", padding: "6px 14px", fontSize: "13px" }}>
                <span style={{ color: "#64748b" }}>{s.label}: </span>
                <span style={{ color: "#7c3aed", fontWeight: "600" }}>{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", color: "#ef4444", fontSize: "13px", marginBottom: "16px", fontFamily: "monospace" }}>
            ❌ {error}
          </div>
        )}

        {/* Editor */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>INPUT</span>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>{input.length} chars</span>
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={'Paste your JSON here...\n\n{"name": "John", "age": 30}'}
              style={{ width: "100%", height: "500px", padding: "16px", background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "13px", fontFamily: "monospace", boxSizing: "border-box", outline: "none", resize: "vertical", lineHeight: "1.6" }}
              onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
              onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>OUTPUT</span>
              {output && (
                <button onClick={copy} style={{ background: copied ? "#22c55e" : "rgba(124,58,237,0.1)", border: copied ? "none" : "1px solid rgba(124,58,237,0.3)", color: copied ? "white" : "#7c3aed", borderRadius: "6px", padding: "4px 12px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              )}
            </div>
            <div style={{ width: "100%", height: "500px", padding: "16px", background: "#ffffff", border: `1.5px solid ${error ? "rgba(239,68,68,0.4)" : output ? "rgba(34,197,94,0.4)" : "#e2e8f0"}`, borderRadius: "12px", fontSize: "13px", fontFamily: "monospace", boxSizing: "border-box", overflow: "auto", lineHeight: "1.6", whiteSpace: "pre" }}
              dangerouslySetInnerHTML={{ __html: output ? syntaxHighlight(output) : '<span style="color:#94a3b8">Formatted JSON will appear here...</span>' }}
            />
          </div>
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