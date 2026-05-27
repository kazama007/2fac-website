"use client";
import { useState, useEffect, useRef } from "react";
import { Navbar, Footer } from "../../shared";

function DotsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let width = canvas.width = window.innerWidth, height = canvas.height = window.innerHeight;
    const DOT_SPACING = 28, DOT_RADIUS = 1.2, mouse = { x: -999, y: -999 };
    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouseMove);
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / DOT_SPACING) + 1, rows = Math.ceil(height / DOT_SPACING) + 1;
      for (let col = 0; col < cols; col++) for (let row = 0; row < rows; row++) {
        const x = col * DOT_SPACING, y = row * DOT_SPACING, dx = mouse.x - x, dy = mouse.y - y, dist = Math.sqrt(dx*dx+dy*dy);
        ctx.beginPath(); ctx.arc(x, y, dist < 100 ? DOT_RADIUS + (1-dist/100)*1.2 : DOT_RADIUS, 0, Math.PI*2);
        ctx.fillStyle = dist < 100 ? `rgba(124,58,237,${0.3+(1-dist/100)*0.5})` : "rgba(148,163,184,0.25)"; ctx.fill();
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
  { q: "Can someone track my exact location from my IP?", a: "No. An IP address only reveals an approximate location (usually city or region level) and your ISP. Your exact street address cannot be determined from an IP address alone without legal processes." },
];

export default function IPLookup() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    setMounted(true);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />
      <Navbar />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px 60px", position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>
          <a href="/" style={{ color: "#7c3aed", textDecoration: "none" }}>Home</a><span>›</span>
          <a href="/tools" style={{ color: "#7c3aed", textDecoration: "none" }}>Tools</a><span>›</span>
          <span style={{ color: "#1e293b", fontWeight: "500" }}>IP Lookup</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "36px" }}>
          <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #f59e0b, #fbbf24)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", flexShrink: 0, boxShadow: "0 8px 24px rgba(245,158,11,0.3)" }}>📍</div>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" }}>IP Lookup</h1>
            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Find geolocation, ISP, ASN, timezone, and network details for any IP address instantly.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mounted && isMobile ? "1fr" : "1fr 320px", gap: "24px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(124,58,237,0.06)" }}>
              {myIp && (
                <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", color: "#64748b" }}>Your IP: <strong style={{ color: "#7c3aed", fontFamily: "monospace" }}>{myIp}</strong></span>
                  <button onClick={lookupMyIp} style={{ background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                    Lookup My IP
                  </button>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
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

              {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444", marginBottom: "16px" }}>❌ {error}</div>}

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

              <div style={{ marginTop: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#64748b" }}>
                ℹ️ <strong style={{ color: "#7c3aed" }}>Privacy Note:</strong> IP lookup uses public APIs. IP location is approximate and may not be 100% accurate.
              </div>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>About IP Lookup</h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: "0 0 10px" }}>Our IP Lookup tool provides detailed geolocation and network information for any IP address. Find the country, city, ISP, ASN, timezone, and more in seconds.</p>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: 0 }}>Use it to look up your own IP address or investigate any IP for security research, network troubleshooting, or general curiosity.</p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "20px" }}>How to Use</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {["Your current IP address is automatically detected and shown at the top.", "Click Lookup My IP to instantly look up your own IP details.", "Or enter any IP address in the input field and click Lookup.", "View location details including country, city, region, and timezone.", "See network details like ISP, ASN, and network range."].map((step, i) => (
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
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", margin: 0 }}>IP lookup uses the ipapi.co public API. The IP addresses you look up are sent to their servers for geolocation. IP location data is approximate and may not reflect exact physical location.</p>
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
              <div style={{ fontSize: "48px", flexShrink: 0 }}>📍</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Look Up Any IP Address Instantly</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px", lineHeight: "1.6" }}>Use our free IP Lookup tool to find geolocation and network details for any IP address.</p>
                <a href="/tools/dns-lookup" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>Try DNS Lookup →</a>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: mounted && isMobile ? "static" : "sticky", top: "90px" }}>
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>🔧 Related Tools</h3>
              {[{ name: "DNS Lookup", href: "/tools/dns-lookup" }, { name: "WHOIS Lookup", href: "/tools/whois-lookup" }, { name: "Link Checker", href: "/tools/link-checker" }, { name: "Password Generator", href: "/tools/password-generator" }, { name: "Hash Generator", href: "/tools/hash-generator" }].map((tool, i) => (
                <a key={i} href={tool.href} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", padding: "8px 12px", borderRadius: "8px", display: "block" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.color = "#7c3aed"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
                  → {tool.name}
                </a>
              ))}
              <a href="/tools" style={{ display: "block", textAlign: "center", marginTop: "12px", padding: "8px", background: "#f1f5f9", color: "#7c3aed", textDecoration: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>View All Tools →</a>
            </div>
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>📝 Related Articles</h3>
              {["What is 2FA and Why You Need It", "Understanding IP Addresses", "Network Security Basics"].map((article, i) => (
                <a key={i} href="/blog" style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", padding: "8px 12px", borderRadius: "8px", display: "block" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.color = "#7c3aed"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
                  → {article}
                </a>
              ))}
              <a href="/blog" style={{ display: "block", textAlign: "center", marginTop: "12px", padding: "8px", background: "#f1f5f9", color: "#7c3aed", textDecoration: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>View All Articles →</a>
            </div>
            <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "16px", padding: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#7c3aed", marginBottom: "12px" }}>⚡ Quick Info</h3>
              {[{ label: "Type", value: "Free Tool" }, { label: "Processing", value: "Via ipapi.co" }, { label: "Account Required", value: "No" }, { label: "Data Stored", value: "None" }, { label: "Output", value: "Location & Network" }].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 4 ? "1px solid rgba(124,58,237,0.08)" : "none" }}>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>{item.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#1e293b" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}