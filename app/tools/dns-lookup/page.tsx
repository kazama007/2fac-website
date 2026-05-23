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

export default function DNSLookup() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeType, setActiveType] = useState("A");

  const recordTypes = ["A", "AAAA", "MX", "NS", "TXT", "CNAME", "SOA"];

  const lookup = async (type: string) => {
    if (!domain) return;
    setLoading(true);
    setError("");
    setActiveType(type);
    try {
      const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      const res = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=${type}`);
      const data = await res.json();
      setResults({ type, domain: cleanDomain, answers: data.Answer || [], status: data.Status });
    } catch {
      setError("Failed to fetch DNS records. Please try again.");
    }
    setLoading(false);
  };

  const lookupAll = async () => {
    if (!domain) return;
    setLoading(true);
    setError("");
    setActiveType("ALL");
    try {
      const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      const allResults: any = {};
      for (const type of ["A", "MX", "NS", "TXT"]) {
        const res = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=${type}`);
        const data = await res.json();
        if (data.Answer && data.Answer.length > 0) allResults[type] = data.Answer;
      }
      setResults({ type: "ALL", domain: cleanDomain, allResults });
    } catch {
      setError("Failed to fetch DNS records.");
    }
    setLoading(false);
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = { A: "#3b82f6", AAAA: "#8b5cf6", MX: "#f59e0b", NS: "#22c55e", TXT: "#ec4899", CNAME: "#06b6d4", SOA: "#f97316", ALL: "#7c3aed" };
    return colors[type] || "#7c3aed";
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

      <section style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#a0a0b0", textDecoration: "none", fontSize: "14px", marginBottom: "20px", padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}>
          ← Back to Homepage
        </a>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "40px", backdropFilter: "blur(20px)" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌐</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>DNS Lookup</h1>
            <p style={{ color: "#a0a0b0", fontSize: "14px" }}>Check DNS records for any domain instantly</p>
          </div>

          {/* Input */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup(activeType)}
              placeholder="Enter domain (e.g. google.com)"
              style={{ flex: 1, padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", color: "white", fontSize: "15px", outline: "none" }}
            />
            <button onClick={lookupAll} disabled={loading} style={{ padding: "14px 20px", background: "#7c3aed", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}>
              {loading ? "..." : "Lookup"}
            </button>
          </div>

          {/* Record Type Buttons */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
            {recordTypes.map(type => (
              <button key={type} onClick={() => lookup(type)} style={{ padding: "6px 14px", background: activeType === type ? getTypeColor(type) : "rgba(255,255,255,0.05)", border: activeType === type ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: activeType === type ? "600" : "400" }}>
                {type}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444", marginBottom: "16px" }}>
              ❌ {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "#a0a0b0" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
              Fetching DNS records...
            </div>
          )}

          {/* Results */}
          {results && !loading && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <span style={{ fontSize: "14px", color: "#a0a0b0" }}>Results for </span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#7c3aed" }}>{results.domain}</span>
                </div>
              </div>

              {/* Single type results */}
              {results.type !== "ALL" && (
                <div>
                  {results.answers.length === 0 ? (
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "24px", textAlign: "center", color: "#a0a0b0" }}>
                      No {results.type} records found
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {results.answers.map((record: any, i: number) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "14px 16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                            <div style={{ flex: 1 }}>
                              <span style={{ background: `rgba(${getTypeColor(results.type).replace("#", "")},0.2)`, color: getTypeColor(results.type), fontSize: "11px", padding: "2px 8px", borderRadius: "6px", fontWeight: "600", marginRight: "10px" }}>
                                {results.type}
                              </span>
                              <span style={{ fontFamily: "monospace", fontSize: "14px", color: "#e2e8f0", wordBreak: "break-all" }}>{record.data}</span>
                            </div>
                            <span style={{ fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap" }}>TTL: {record.TTL}s</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* All types results */}
              {results.type === "ALL" && results.allResults && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {Object.entries(results.allResults).map(([type, records]: [string, any]) => (
                    <div key={type}>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: getTypeColor(type), marginBottom: "8px" }}>{type} Records</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {records.map((record: any, i: number) => (
                          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#e2e8f0", wordBreak: "break-all", flex: 1 }}>{record.data}</span>
                            <span style={{ fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap" }}>TTL: {record.TTL}s</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(results.allResults).length === 0 && (
                    <div style={{ textAlign: "center", color: "#a0a0b0", padding: "24px" }}>No DNS records found</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: "20px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#a0a0b0", lineHeight: "1.6" }}>
          ℹ️ <strong style={{ color: "#fff" }}>How it works:</strong> DNS records are fetched using Google's public DNS API (dns.google). A — IP address, MX — Mail server, NS — Name server, TXT — Text records.
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b0", fontSize: "14px", marginTop: "40px", position: "relative", zIndex: 1 }}>
        © 2025 2fa.ac — Free Cybersecurity Tools for Everyone
      </footer>
    </main>
  );
}