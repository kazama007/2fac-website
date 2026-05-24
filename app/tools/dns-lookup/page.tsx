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
  { q: "What is a DNS lookup?", a: "A DNS (Domain Name System) lookup queries DNS servers to find records associated with a domain name. It translates human-readable domain names into IP addresses and retrieves other domain configuration information." },
  { q: "What are the different DNS record types?", a: "A records map a domain to an IPv4 address. AAAA records map to IPv6. MX records define mail servers. NS records define name servers. TXT records store text data (like SPF, DKIM). CNAME records are aliases to other domains." },
  { q: "What does TTL mean in DNS?", a: "TTL (Time To Live) is the number of seconds a DNS record is cached by resolvers. A lower TTL means changes propagate faster but increase DNS query load. A higher TTL reduces load but takes longer to update." },
  { q: "How does this DNS lookup tool work?", a: "This tool uses Google's public DNS-over-HTTPS API (dns.google) to fetch DNS records. Your query goes directly to Google's DNS resolver, which returns the authoritative records for the domain." },
  { q: "Why do DNS records sometimes show old information?", a: "DNS records are cached by resolvers worldwide. After a record is changed, it can take up to the TTL duration for all resolvers to update. This is called DNS propagation and can take from minutes to 48 hours." },
];

const typeColors: { [key: string]: string } = { A: "#3b82f6", AAAA: "#8b5cf6", MX: "#f59e0b", NS: "#22c55e", TXT: "#ec4899", CNAME: "#06b6d4", SOA: "#f97316", ALL: "#7c3aed" };
const getTypeColor = (type: string) => typeColors[type] || "#7c3aed";

export default function DNSLookup() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeType, setActiveType] = useState("A");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const recordTypes = ["A", "AAAA", "MX", "NS", "TXT", "CNAME", "SOA"];

  const lookup = async (type: string) => {
    if (!domain) return;
    setLoading(true); setError(""); setActiveType(type);
    try {
      const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      const res = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=${type}`);
      const data = await res.json();
      setResults({ type, domain: cleanDomain, answers: data.Answer || [], status: data.Status });
    } catch { setError("Failed to fetch DNS records. Please try again."); }
    setLoading(false);
  };

  const lookupAll = async () => {
    if (!domain) return;
    setLoading(true); setError(""); setActiveType("ALL");
    try {
      const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      const allResults: any = {};
      for (const type of ["A", "MX", "NS", "TXT"]) {
        const res = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=${type}`);
        const data = await res.json();
        if (data.Answer && data.Answer.length > 0) allResults[type] = data.Answer;
      }
      setResults({ type: "ALL", domain: cleanDomain, allResults });
    } catch { setError("Failed to fetch DNS records."); }
    setLoading(false);
  };

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
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌐</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", color: "#1e293b" }}>DNS Lookup</h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Check DNS records for any domain instantly</p>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === "Enter" && lookupAll()}
              placeholder="Enter domain (e.g. google.com)"
              style={{ flex: 1, padding: "14px 16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "15px", outline: "none" }}
              onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
              onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
            />
            <button onClick={lookupAll} disabled={loading} style={{ padding: "14px 20px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
              {loading ? "..." : "Lookup"}
            </button>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
            {recordTypes.map(type => (
              <button key={type} onClick={() => lookup(type)} style={{ padding: "6px 14px", background: activeType === type ? getTypeColor(type) : "#f1f5f9", border: activeType === type ? "none" : "1.5px solid #e2e8f0", borderRadius: "8px", color: activeType === type ? "white" : "#64748b", cursor: "pointer", fontSize: "13px", fontWeight: activeType === type ? "600" : "400" }}>
                {type}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444", marginBottom: "16px" }}>❌ {error}</div>
          )}

          {loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
              Fetching DNS records...
            </div>
          )}

          {results && !loading && (
            <div>
              <div style={{ marginBottom: "16px" }}>
                <span style={{ fontSize: "14px", color: "#64748b" }}>Results for </span>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#7c3aed" }}>{results.domain}</span>
              </div>

              {results.type !== "ALL" && (
                results.answers.length === 0 ? (
                  <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "24px", textAlign: "center", color: "#94a3b8" }}>
                    No {results.type} records found
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {results.answers.map((record: any, i: number) => (
                      <div key={i} style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "14px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                          <div style={{ flex: 1 }}>
                            <span style={{ background: `${getTypeColor(results.type)}15`, color: getTypeColor(results.type), fontSize: "11px", padding: "2px 8px", borderRadius: "6px", fontWeight: "700", marginRight: "10px" }}>{results.type}</span>
                            <span style={{ fontFamily: "monospace", fontSize: "14px", color: "#1e293b", wordBreak: "break-all" }}>{record.data}</span>
                          </div>
                          <span style={{ fontSize: "12px", color: "#94a3b8", whiteSpace: "nowrap" }}>TTL: {record.TTL}s</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {results.type === "ALL" && results.allResults && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {Object.entries(results.allResults).map(([type, records]: [string, any]) => (
                    <div key={type}>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: getTypeColor(type), marginBottom: "8px" }}>{type} Records</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {records.map((record: any, i: number) => (
                          <div key={i} style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "8px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#1e293b", wordBreak: "break-all", flex: 1 }}>{record.data}</span>
                            <span style={{ fontSize: "11px", color: "#94a3b8", whiteSpace: "nowrap" }}>TTL: {record.TTL}s</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(results.allResults).length === 0 && (
                    <div style={{ textAlign: "center", color: "#94a3b8", padding: "24px" }}>No DNS records found</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
          ℹ️ <strong style={{ color: "#7c3aed" }}>How it works:</strong> DNS records are fetched using Google's public DNS API (dns.google). A — IP address, MX — Mail server, NS — Name server, TXT — Text records.
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