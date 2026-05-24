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
  { q: "What is WHOIS?", a: "WHOIS is a public database protocol that stores information about domain name registrations. It includes details like the domain owner, registrar, registration date, expiry date, and name servers." },
  { q: "Why might WHOIS show 'Privacy Protected'?", a: "Many registrars offer WHOIS privacy protection that hides the domain owner's personal information. Instead of showing real contact details, it displays the privacy service's information to prevent spam and protect privacy." },
  { q: "What does domain expiry mean?", a: "Domain expiry is when the domain registration ends. If not renewed, the domain becomes available for others to register. Domains expiring within 30 days are flagged as 'Expiring Soon' in this tool." },
  { q: "What are name servers?", a: "Name servers are the DNS servers that control where a domain's traffic is directed. They translate domain names to IP addresses. Changing name servers is how you point a domain to a new hosting provider." },
  { q: "Can I find out who owns any domain?", a: "WHOIS data is publicly available, but many domain owners use privacy protection services that hide their personal information. You can see the registrar and registration dates, but the owner details may be masked." },
];

export default function WHOISLookup() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const lookup = async () => {
    if (!domain) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
      const tld = cleanDomain.split(".").pop();
      const res = await fetch(`https://rdap.org/domain/${cleanDomain}`);
      const data = await res.json();
      const registrar = data.entities?.find((e: any) => e.roles?.includes("registrar"))?.vcardArray?.[1]?.find((v: any) => v[0] === "fn")?.[3] || "N/A";
      const registrant = data.entities?.find((e: any) => e.roles?.includes("registrant"))?.vcardArray?.[1]?.find((v: any) => v[0] === "fn")?.[3] || "Privacy Protected";
      const created = data.events?.find((e: any) => e.eventAction === "registration")?.eventDate || "N/A";
      const updated = data.events?.find((e: any) => e.eventAction === "last changed")?.eventDate || "N/A";
      const expires = data.events?.find((e: any) => e.eventAction === "expiration")?.eventDate || "N/A";
      const nameservers = data.nameservers?.map((ns: any) => ns.ldhName).join(", ") || "N/A";
      const status = data.status?.join(", ") || "N/A";
      setResult({ domain: cleanDomain, registrar, registrant, created: created !== "N/A" ? new Date(created).toLocaleDateString() : "N/A", updated: updated !== "N/A" ? new Date(updated).toLocaleDateString() : "N/A", expires: expires !== "N/A" ? new Date(expires).toLocaleDateString() : "N/A", nameservers, status, tld: `.${tld}` });
    } catch { setError("Could not fetch WHOIS data. Try again or check the domain name."); }
    setLoading(false);
  };

  const isExpiringSoon = (dateStr: string) => {
    if (!dateStr || dateStr === "N/A") return false;
    const diff = new Date(dateStr).getTime() - Date.now();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  };

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
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏢</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", color: "#1e293b" }}>WHOIS Lookup</h1>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Check domain owner, registration and expiry info</p>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="Enter domain (e.g. google.com)"
              style={{ flex: 1, padding: "14px 16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "15px", outline: "none" }}
              onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
              onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
            />
            <button onClick={lookup} disabled={loading} style={{ padding: "14px 24px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
              {loading ? "..." : "Lookup"}
            </button>
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444", marginBottom: "16px" }}>❌ {error}</div>
          )}

          {loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
              Fetching WHOIS data...
            </div>
          )}

          {result && !loading && (
            <div>
              <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px", padding: "20px", textAlign: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🌐</div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#7c3aed" }}>{result.domain}</div>
                {result.tld && <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>TLD: {result.tld}</div>}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { icon: "🏢", label: "Registrar", value: result.registrar },
                  { icon: "👤", label: "Registrant", value: result.registrant },
                  { icon: "📅", label: "Created", value: result.created },
                  { icon: "🔄", label: "Last Updated", value: result.updated },
                  { icon: "⏰", label: "Expires", value: result.expires, warn: isExpiringSoon(result.expires) },
                  { icon: "🌐", label: "Name Servers", value: result.nameservers },
                  { icon: "📋", label: "Status", value: result.status },
                ].map(item => item.value && item.value !== "N/A" ? (
                  <div key={item.label} style={{ background: item.warn ? "rgba(245,158,11,0.06)" : "#f8fafc", border: `1.5px solid ${item.warn ? "rgba(245,158,11,0.3)" : "#e2e8f0"}`, borderRadius: "10px", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "18px" }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px", fontWeight: "600", letterSpacing: "0.5px" }}>{item.label.toUpperCase()}</div>
                      <div style={{ fontSize: "14px", color: item.warn ? "#d97706" : "#1e293b", wordBreak: "break-all" }}>
                        {item.value}
                        {item.warn && <span style={{ marginLeft: "8px", fontSize: "12px", background: "rgba(245,158,11,0.1)", color: "#d97706", padding: "2px 8px", borderRadius: "6px" }}>⚠️ Expiring Soon</span>}
                      </div>
                    </div>
                  </div>
                ) : null)}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
          ℹ️ <strong style={{ color: "#7c3aed" }}>What is WHOIS?</strong> WHOIS is a protocol that provides information about domain name registrations including owner, registrar, creation date, and expiry date.
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