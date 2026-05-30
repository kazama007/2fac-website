"use client";
import { useState, useEffect } from "react";
import { Navbar, Footer } from "../../shared";
import AnimatedBackground from "../../background";
import { HeaderAd, FooterAd, SidebarAd } from "../../adsense";



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
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    setMounted(true);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <AnimatedBackground />
      <Navbar />
      <HeaderAd />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 16px 60px", position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>
          <a href="/" style={{ color: "#7c3aed", textDecoration: "none" }}>Home</a><span>›</span>
          <a href="/tools" style={{ color: "#7c3aed", textDecoration: "none" }}>Tools</a><span>›</span>
          <span style={{ color: "#1e293b", fontWeight: "500" }}>JSON Formatter</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "36px" }}>
          <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #22c55e, #4ade80)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", flexShrink: 0, boxShadow: "0 8px 24px rgba(34,197,94,0.3)" }}>📋</div>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" }}>JSON Formatter</h1>
            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Format, validate, and minify JSON data with syntax highlighting — free and instant.</p>
          </div>
        </div>

        {/* Tool Card - Full Width */}
        <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(124,58,237,0.06)", marginBottom: "24px" }}>

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
                style={{ width: "100%", height: "400px", padding: "16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "13px", fontFamily: "monospace", boxSizing: "border-box", outline: "none", resize: "vertical", lineHeight: "1.6" }}
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
              <div style={{ width: "100%", height: "400px", padding: "16px", background: "#f8fafc", border: `1.5px solid ${error ? "rgba(239,68,68,0.4)" : output ? "rgba(34,197,94,0.4)" : "#e2e8f0"}`, borderRadius: "12px", fontSize: "13px", fontFamily: "monospace", boxSizing: "border-box", overflow: "auto", lineHeight: "1.6", whiteSpace: "pre" }}
                dangerouslySetInnerHTML={{ __html: output ? syntaxHighlight(output) : '<span style="color:#94a3b8">Formatted JSON will appear here...</span>' }}
              />
            </div>
          </div>
        </div>

        {/* Bottom sections with sidebar */}
        <div style={{ display: "grid", gridTemplateColumns: mounted && isMobile ? "1fr" : "1fr 320px", gap: "24px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>About JSON Formatter</h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: "0 0 10px" }}>Our JSON Formatter instantly formats messy JSON into clean, readable code with syntax highlighting. It also validates JSON for errors and minifies it for production use.</p>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: 0 }}>Perfect for developers working with APIs, configuration files, or any JSON data that needs to be readable or compact.</p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "20px" }}>How to Use</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {["Paste your raw or minified JSON in the left input panel.", "Click Format to pretty-print with indentation and syntax highlighting.", "Or click Minify to remove all whitespace for production use.", "Use the Sample button to try the tool with example data.", "Copy the formatted output using the Copy button."].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", margin: 0, paddingTop: "4px" }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "16px", padding: "24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ fontSize: "32px", flexShrink: 0 }}>🛡️</div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Privacy & Security</h3>
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", margin: 0 }}>All JSON processing happens locally in your browser using JavaScript. Your JSON data is never sent to any server or stored anywhere on our end.</p>
              </div>
            </div>

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

            <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(159,103,255,0.08))", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px", padding: "28px", display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ fontSize: "48px", flexShrink: 0 }}>📋</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Format and Validate JSON Instantly</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px", lineHeight: "1.6" }}>Use our free JSON Formatter to clean up messy JSON and debug API responses fast.</p>
                <a href="/tools/base64" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>Try Base64 Encoder →</a>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: mounted && isMobile ? "static" : "sticky", top: "90px" }}>
            <SidebarAd />
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>🔧 Related Tools</h3>
              {[{ name: "JWT Decoder", href: "/tools/jwt-decoder" }, { name: "Base64 Encoder/Decoder", href: "/tools/base64" }, { name: "Hash Generator", href: "/tools/hash-generator" }, { name: "UUID Generator", href: "/tools/uuid-generator" }, { name: "Password Generator", href: "/tools/password-generator" }].map((tool, i) => (
                <a key={i} href={tool.href} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", padding: "8px 12px", borderRadius: "8px", display: "block" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.color = "#7c3aed"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
                  → {tool.name}
                </a>
              ))}
              <a href="/tools" style={{ display: "block", textAlign: "center", marginTop: "12px", padding: "8px", background: "#f1f5f9", color: "#7c3aed", textDecoration: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>View All Tools →</a>
            </div>
            <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "16px", padding: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#7c3aed", marginBottom: "12px" }}>⚡ Quick Info</h3>
              {[{ label: "Type", value: "Free Tool" }, { label: "Processing", value: "Browser-based" }, { label: "Account Required", value: "No" }, { label: "Data Stored", value: "None" }, { label: "Features", value: "Format, Minify, Validate" }].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 4 ? "1px solid rgba(124,58,237,0.08)" : "none" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>{item.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#1e293b" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <FooterAd />
      <Footer />
    </main>
  );
}