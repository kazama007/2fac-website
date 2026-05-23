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

export default function IPLookup() {
  const [ip, setIp] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [myIp, setMyIp] = useState("");

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then(r => r.json())
      .then(d => setMyIp(d.ip))
      .catch(() => {});
  }, []);

  const lookup = async (ipToLookup?: string) => {
    const target = ipToLookup || ip;
    if (!target) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://ipapi.co/${target}/json/`);
      const data = await res.json();
      if (data.error) throw new Error(data.reason);
      setResult(data);
    } catch {
      setError("Failed to lookup IP. Please check the IP address and try again.");
    }
    setLoading(false);
  };

  const lookupMyIp = () => {
    if (myIp) { setIp(myIp); lookup(myIp); }
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

      <section style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#a0a0b0", textDecoration: "none", fontSize: "14px", marginBottom: "20px", padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}>
          ← Back to Homepage
        </a>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "40px", backdropFilter: "blur(20px)" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📍</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>IP Lookup</h1>
            <p style={{ color: "#a0a0b0", fontSize: "14px" }}>Find location and details of any IP address</p>
          </div>

          {/* My IP Button */}
          {myIp && (
            <div style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", color: "#a0a0b0" }}>Your IP: <strong style={{ color: "#fff", fontFamily: "monospace" }}>{myIp}</strong></span>
              <button onClick={lookupMyIp} style={{ background: "#7c3aed", color: "white", border: "none", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                Lookup My IP
              </button>
            </div>
          )}

          {/* Input */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="Enter IP address (e.g. 8.8.8.8)"
              style={{ flex: 1, padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", color: "white", fontSize: "15px", outline: "none", fontFamily: "monospace" }}
            />
            <button onClick={() => lookup()} disabled={loading} style={{ padding: "14px 20px", background: "#7c3aed", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
              {loading ? "..." : "Lookup"}
            </button>
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444", marginBottom: "16px" }}>
              ❌ {error}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "#a0a0b0" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
              Looking up IP address...
            </div>
          )}

          {result && !loading && (
            <div>
              {/* Header */}
              <div style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "16px", padding: "20px", marginBottom: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                  {result.country_code ? `${result.country_code}` : "🌍"}
                </div>
                <div style={{ fontSize: "22px", fontWeight: "800", marginBottom: "4px" }}>{result.ip}</div>
                <div style={{ fontSize: "14px", color: "#a0a0b0" }}>{result.city}, {result.region}, {result.country_name}</div>
              </div>

              {/* Details Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { label: "🌍 Country", value: result.country_name },
                  { label: "🏙️ City", value: result.city },
                  { label: "📍 Region", value: result.region },
                  { label: "📮 Postal Code", value: result.postal },
                  { label: "🕐 Timezone", value: result.timezone },
                  { label: "🌐 ISP", value: result.org },
                  { label: "📡 ASN", value: result.asn },
                  { label: "💻 Network", value: result.network },
                  { label: "📌 Latitude", value: result.latitude },
                  { label: "📌 Longitude", value: result.longitude },
                ].map((item) => item.value ? (
                  <div key={item.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px 14px" }}>
                    <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>{item.label}</div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#e2e8f0", wordBreak: "break-all" }}>{item.value}</div>
                  </div>
                ) : null)}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: "20px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#a0a0b0", lineHeight: "1.6" }}>
          ℹ️ <strong style={{ color: "#fff" }}>Privacy Note:</strong> IP lookup uses public APIs. IP location is approximate and may not be 100% accurate.
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b0", fontSize: "14px", marginTop: "40px", position: "relative", zIndex: 1 }}>
        © 2025 2fa.ac — Free Cybersecurity Tools for Everyone
      </footer>
    </main>
  );
}