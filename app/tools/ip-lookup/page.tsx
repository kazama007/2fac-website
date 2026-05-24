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
  { q: "What is an IP address?", a: "An IP (Internet Protocol) address is a unique numerical label assigned to every device connected to a network. It serves two main purposes: identifying the host and providing the location of the host in the network." },
  { q: "How accurate is IP geolocation?", a: "IP geolocation is approximate. It can typically identify the country with 95%+ accuracy, but city-level accuracy is only around 50-80%. ISPs and VPNs can cause the location to appear in a different city or region." },
  { q: "What is an ISP?", a: "ISP stands for Internet Service Provider — the company that provides your internet connection. Examples include Comcast, AT&T, Jio, and Airtel. Your ISP is always visible via your IP address." },
  { q: "What is an ASN?", a: "ASN (Autonomous System Number) is a unique identifier for a network operated by an ISP or large organization. It helps route internet traffic between different networks." },
  { q: "Can someone track my exact location from my IP?", a: "No. An IP address only reveals an approximate location (usually city/region level) and your ISP. Your exact street address cannot be determined from an IP address alone without legal processes." },
];

export default function IPLookup() {
  const [ip, setIp] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [myIp, setMyIp] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then(r => r.json()).then(d => setMyIp(d.ip)).catch(() => {});
  }, []);

  const lookup = async (ipToLookup?: string) => {
    const target = ipToLookup || ip;
    if (!target) return;
    setLoading(true); setError("");
    try {
      const res = await fetch(`https://ipapi.co/${target}/json/`);
      const data = await res.json();
      if (data.error) throw new Error(data.reason);
      setResult(data);
    } catch { setError("Failed to lookup IP. Please check the IP address and try again."); }
    setLoading(false);
  };

  const lookupMyIp = () => { if (myIp) { setIp(myIp); lookup(myIp); } };

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
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📍</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", color: "#1e293b" }}>IP Lookup</h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Find location and details of any IP address</p>
          </div>

          {myIp && (
            <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", color: "#64748b" }}>Your IP: <strong style={{ color: "#7c3aed", fontFamily: "monospace" }}>{myIp}</strong></span>
              <button onClick={lookupMyIp} style={{ background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                Lookup My IP
              </button>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="Enter IP address (e.g. 8.8.8.8)"
              style={{ flex: 1, padding: "14px 16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "15px", outline: "none", fontFamily: "monospace" }}
              onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
              onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
            />
            <button onClick={() => lookup()} disabled={loading} style={{ padding: "14px 20px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
              {loading ? "..." : "Lookup"}
            </button>
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444", marginBottom: "16px" }}>❌ {error}</div>
          )}

          {loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
              Looking up IP address...
            </div>
          )}

          {result && !loading && (
            <div>
              <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px", padding: "20px", marginBottom: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🌍</div>
                <div style={{ fontSize: "22px", fontWeight: "800", marginBottom: "4px", color: "#1e293b", fontFamily: "monospace" }}>{result.ip}</div>
                <div style={{ fontSize: "14px", color: "#64748b" }}>{result.city}, {result.region}, {result.country_name}</div>
              </div>

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
                  <div key={item.label} style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "12px 14px" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>{item.label}</div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b", wordBreak: "break-all" }}>{item.value}</div>
                  </div>
                ) : null)}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
          ℹ️ <strong style={{ color: "#7c3aed" }}>Privacy Note:</strong> IP lookup uses public APIs. IP location is approximate and may not be 100% accurate.
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