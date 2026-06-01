"use client";
import { useState, useEffect } from "react";
import { Navbar, Footer } from "../../shared";
import AnimatedBackground from "../../background";
import { HeaderAd, FooterAd, SidebarAd } from "../../adsense";



const faqs = [
  { q: "What is Base64 encoding?", a: "Base64 is an encoding scheme that converts binary data into ASCII text using 64 printable characters. It is widely used to safely transmit data in text-based formats like JSON, HTML, and emails." },
  { q: "What is Base64 used for?", a: "Base64 is used to encode images in CSS and HTML as data URIs, encode binary data in JSON APIs, transmit email attachments, store binary data in databases, and embed cryptographic keys in text files." },
  { q: "Is Base64 a form of encryption?", a: "No! Base64 is encoding, not encryption. It does not provide any security. Anyone can decode a Base64 string instantly. Never use Base64 to hide sensitive information." },
  { q: "Why does Base64 end with == signs?", a: "Base64 encodes 3 bytes at a time into 4 characters. If the input length is not a multiple of 3, padding characters (=) are added to make the output length a multiple of 4." },
  { q: "Is this tool safe for sensitive data?", a: "All encoding and decoding happens locally in your browser. Nothing is sent to any server. However, Base64 is not encryption, so do not use it to secure sensitive information." },
];

export default function Base64Tool() {
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
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const process = () => {
    if (!input) return;
    setError("");
    try {
      if (mode === "encode") {
        const bytes = new TextEncoder().encode(input);
        let bin = "";
        for (const b of bytes) bin += String.fromCharCode(b);
        setOutput(btoa(bin));
      } else {
        const bytes = Uint8Array.from(atob(input), c => c.charCodeAt(0));
        setOutput(new TextDecoder().decode(bytes));
      }
    } catch {
      setError(mode === "decode" ? "Invalid Base64 string!" : "Encoding error!");
      setOutput("");
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const swap = () => { setInput(output); setOutput(""); setMode(mode === "encode" ? "decode" : "encode"); setError(""); };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <AnimatedBackground />
      <Navbar />
      <HeaderAd />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px 60px", position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>
          <a href="/" style={{ color: "#7c3aed", textDecoration: "none" }}>Home</a><span>›</span>
          <a href="/tools" style={{ color: "#7c3aed", textDecoration: "none" }}>Tools</a><span>›</span>
          <span style={{ color: "#1e293b", fontWeight: "500" }}>Base64 Encoder / Decoder</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "36px" }}>
          <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #f59e0b, #fbbf24)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", flexShrink: 0, boxShadow: "0 8px 24px rgba(245,158,11,0.3)" }}>📝</div>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" }}>Base64 Encoder / Decoder</h1>
            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Encode or decode Base64 text instantly with swap mode for quick back-and-forth conversion.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mounted && isMobile ? "1fr" : "1fr 320px", gap: "24px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(124,58,237,0.06)" }}>
              <div style={{ display: "flex", marginBottom: "20px", background: "#f1f5f9", borderRadius: "12px", padding: "4px" }}>
                <button onClick={() => { setMode("encode"); setInput(""); setOutput(""); setError(""); }} style={{ flex: 1, padding: "10px", background: mode === "encode" ? "#7c3aed" : "transparent", border: "none", borderRadius: "8px", color: mode === "encode" ? "white" : "#64748b", cursor: "pointer", fontSize: "14px", fontWeight: mode === "encode" ? "600" : "400" }}>Encode</button>
                <button onClick={() => { setMode("decode"); setInput(""); setOutput(""); setError(""); }} style={{ flex: 1, padding: "10px", background: mode === "decode" ? "#7c3aed" : "transparent", border: "none", borderRadius: "8px", color: mode === "decode" ? "white" : "#64748b", cursor: "pointer", fontSize: "14px", fontWeight: mode === "decode" ? "600" : "400" }}>Decode</button>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "8px" }}>{mode === "encode" ? "Plain Text" : "Base64 String"}</label>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."} rows={5}
                  style={{ width: "100%", padding: "14px 16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "14px", boxSizing: "border-box", outline: "none", resize: "vertical", fontFamily: "monospace" }}
                  onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
                  onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <button onClick={process} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
                  {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
                </button>
                {output && <button onClick={swap} style={{ padding: "14px 20px", background: "#f1f5f9", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: "12px", fontSize: "14px", cursor: "pointer" }}>⇄ Swap</button>}
              </div>
              {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", color: "#ef4444", fontSize: "14px", marginBottom: "16px" }}>❌ {error}</div>}
              {output && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>{mode === "encode" ? "Base64 Output" : "Decoded Text"}</label>
                    <button onClick={copy} style={{ background: copied ? "#22c55e" : "rgba(124,58,237,0.1)", border: copied ? "none" : "1px solid rgba(124,58,237,0.3)", color: copied ? "white" : "#7c3aed", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "16px", fontFamily: "monospace", fontSize: "13px", color: "#16a34a", wordBreak: "break-all", lineHeight: "1.6" }}>{output}</div>
                </div>
              )}
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>About Base64 Encoder / Decoder</h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: "0 0 10px" }}>Our Base64 Encoder and Decoder converts text to Base64 format and back instantly. Simply enter your text or Base64 string and get the result in one click.</p>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: 0 }}>Base64 encoding is widely used in web development, APIs, email attachments, and data storage to safely transmit binary data as text.</p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "20px" }}>How to Use</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {["Select the mode: Encode to convert text to Base64, or Decode to convert Base64 back to text.", "Enter your text or Base64 string in the input field.", "Click the Encode or Decode button to convert instantly.", "Copy the result or use the Swap button to switch input and output."].map((step, i) => (
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
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", margin: 0 }}>All Base64 encoding and decoding happens locally in your browser using JavaScript. Your text data is never sent to any server or stored anywhere.</p>
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
              <div style={{ fontSize: "48px", flexShrink: 0 }}>📝</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Encode and Decode Base64 Instantly</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px", lineHeight: "1.6" }}>Use our free Base64 tool for quick encoding and decoding in your web development workflow.</p>
                <a href="/tools/json-formatter" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>Try JSON Formatter →</a>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: mounted && isMobile ? "static" : "sticky", top: "90px" }}>
            <SidebarAd />
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>🔧 Related Tools</h3>
              {[{ name: "JSON Formatter", href: "/tools/json-formatter" }, { name: "JWT Decoder", href: "/tools/jwt-decoder" }, { name: "Hash Generator", href: "/tools/hash-generator" }, { name: "UUID Generator", href: "/tools/uuid-generator" }, { name: "Password Generator", href: "/tools/password-generator" }].map((tool, i) => (
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
              {[{ label: "Type", value: "Free Tool" }, { label: "Processing", value: "Browser-based" }, { label: "Account Required", value: "No" }, { label: "Data Stored", value: "None" }, { label: "Modes", value: "Encode & Decode" }].map((item, i) => (
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