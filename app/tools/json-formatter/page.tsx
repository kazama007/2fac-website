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

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = "color:#ce9178;"; // string
      if (/^"/.test(match)) {
        if (/:$/.test(match)) cls = "color:#9cdcfe;"; // key
      } else if (/true|false/.test(match)) {
        cls = "color:#569cd6;"; // boolean
      } else if (/null/.test(match)) {
        cls = "color:#569cd6;"; // null
      } else {
        cls = "color:#b5cea8;"; // number
      }
      return `<span style="${cls}">${match}</span>`;
    });
}

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);
  const [stats, setStats] = useState<any>(null);

  const format = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setError("");

      // Stats
      const keys = JSON.stringify(parsed).match(/"[^"]+"\s*:/g)?.length || 0;
      const size = new Blob([formatted]).size;
      setStats({
        keys,
        size: size > 1024 ? `${(size / 1024).toFixed(1)} KB` : `${size} B`,
        lines: formatted.split("\n").length,
        type: Array.isArray(parsed) ? "Array" : typeof parsed === "object" ? "Object" : typeof parsed,
      });
    } catch (e: any) {
      setError(e.message);
      setOutput("");
      setStats(null);
    }
  };

  const minify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
    setStats(null);
  };

  const loadSample = () => {
    setInput(JSON.stringify({
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: { city: "New York", country: "USA" },
      skills: ["JavaScript", "React", "Node.js"],
      active: true,
    }));
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a1a", color: "#ffffff", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />

      <nav style={{ padding: "22px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo.png" alt="2fa.ac" style={{ height: "30px" }} />
        </a>
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="/" style={{ color: "#a0a0b0", textDecoration: "none", fontSize: "14px" }}>Home</a>
          <a href="/tools" style={{ color: "#a0a0b0", textDecoration: "none", fontSize: "14px" }}>Tools</a>
        </div>
      </nav>

      <section style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#a0a0b0", textDecoration: "none", fontSize: "14px", marginBottom: "20px", padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}>
          ← Back to Homepage
        </a>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📋</div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>JSON Formatter</h1>
          <p style={{ color: "#a0a0b0", fontSize: "14px" }}>Format, validate and minify JSON data instantly</p>
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={format} style={{ padding: "10px 20px", background: "#7c3aed", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
            ✨ Format
          </button>
          <button onClick={minify} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            📦 Minify
          </button>
          <button onClick={loadSample} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            📄 Sample
          </button>
          <button onClick={clear} style={{ padding: "10px 20px", background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            🗑 Clear
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
            <span style={{ fontSize: "13px", color: "#a0a0b0" }}>Indent:</span>
            {[2, 4].map(n => (
              <button key={n} onClick={() => setIndent(n)} style={{ padding: "6px 12px", background: indent === n ? "#7c3aed" : "rgba(255,255,255,0.06)", border: "none", borderRadius: "6px", color: "white", cursor: "pointer", fontSize: "13px" }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
            {[
              { label: "Type", value: stats.type },
              { label: "Keys", value: stats.keys },
              { label: "Lines", value: stats.lines },
              { label: "Size", value: stats.size },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "8px", padding: "6px 14px", fontSize: "13px" }}>
                <span style={{ color: "#a0a0b0" }}>{s.label}: </span>
                <span style={{ color: "#7c3aed", fontWeight: "600" }}>{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", color: "#ef4444", fontSize: "13px", marginBottom: "16px", fontFamily: "monospace" }}>
            ❌ {error}
          </div>
        )}

        {/* Editor */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {/* Input */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#a0a0b0", fontWeight: "600" }}>INPUT</span>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>{input.length} chars</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste your JSON here...\n\n{"name": "John", "age": 30}'
              style={{ width: "100%", height: "500px", padding: "16px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#d4d4d4", fontSize: "13px", fontFamily: "monospace", boxSizing: "border-box", outline: "none", resize: "vertical", lineHeight: "1.6" }}
            />
          </div>

          {/* Output */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#a0a0b0", fontWeight: "600" }}>OUTPUT</span>
              {output && (
                <button onClick={copy} style={{ background: copied ? "#22c55e" : "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "white", borderRadius: "6px", padding: "4px 12px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              )}
            </div>
            <div
              style={{ width: "100%", height: "500px", padding: "16px", background: "rgba(0,0,0,0.4)", border: `1px solid ${error ? "rgba(239,68,68,0.3)" : output ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: "12px", fontSize: "13px", fontFamily: "monospace", boxSizing: "border-box", overflow: "auto", lineHeight: "1.6", whiteSpace: "pre" }}
              dangerouslySetInnerHTML={{ __html: output ? syntaxHighlight(output) : '<span style="color:#6b7280">Formatted JSON will appear here...</span>' }}
            />
          </div>
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b0", fontSize: "14px", marginTop: "40px", position: "relative", zIndex: 1 }}>
        © 2025 2fa.ac — Free Cybersecurity Tools for Everyone
      </footer>
    </main>
  );
}