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
  { q: "What is WHOIS?", a: "WHOIS is a public database protocol that stores information about domain name registrations. It includes details like the domain owner, registrar, registration date, expiry date, and name servers." },
  { q: "Why might WHOIS show Privacy Protected?", a: "Many registrars offer WHOIS privacy protection that hides the domain owner's personal information. Instead of showing real contact details, it displays the privacy service's information to prevent spam." },
  { q: "What does domain expiry mean?", a: "Domain expiry is when the domain registration ends. If not renewed, the domain becomes available for others to register. Domains expiring within 30 days are flagged with a warning in this tool." },
  { q: "What are name servers?", a: "Name servers are the DNS servers that control where a domain's traffic is directed. They translate domain names to IP addresses. Changing name servers is how you point a domain to a new hosting provider." },
  { q: "Can I find out who owns any domain?", a: "WHOIS data is publicly available, but many domain owners use privacy protection services that hide their personal information. You can see the registrar and registration dates, but the owner details may be masked." },
];

export default function WHOISLookup() {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 768 : true);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      setResult({
        domain: cleanDomain, registrar, registrant,
        created: created !== "N/A" ? new Date(created).toLocaleDateString() : "N/A",
        updated: updated !== "N/A" ? new Date(updated).toLocaleDateString() : "N/A",
        expires: expires !== "N/A" ? new Date(expires).toLocaleDateString() : "N/A",
        nameservers, status, tld: `.${tld}`,
      });
    } catch { setError("Could not fetch WHOIS data. Try again or check the domain name."); }
    setLoading(false);
  };

  const isExpiringSoon = (dateStr: string) => {
    if (!dateStr || dateStr === "N/A") return false;
    const diff = new Date(dateStr).getTime() - Date.now();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <DotsBackground />
      <Navbar />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px 60px", position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>
          <a href="/" style={{ color: "#7c3aed", textDecoration: "none" }}>Home</a><span>›</span>
          <a href="/tools" style={{ color: "#7c3aed", textDecoration: "none" }}>Tools</a><span>›</span>
          <span style={{ color: "#1e293b", fontWeight: "500" }}>WHOIS Lookup</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "36px" }}>
          <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", flexShrink: 0, boxShadow: "0 8px 24px rgba(139,92,246,0.3)" }}>🏢</div>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" }}>WHOIS Lookup</h1>
            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Check domain owner, registrar, registration date, expiry, and name servers — free and instant.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: "24px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(124,58,237,0.06)" }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
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

              {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444", marginBottom: "16px" }}>❌ {error}</div>}

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
                    <div style={{ fontSize: "22px", fontWeight: "800", color: "#7c3aed" }}>{result.domain}</div>
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

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>About WHOIS Lookup</h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: "0 0 10px" }}>Our WHOIS Lookup tool retrieves domain registration information including the registrar, registration date, expiry date, name servers, and domain status.</p>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: 0 }}>Use it to research domain ownership, check when a domain expires, verify registrar details, or investigate suspicious websites.</p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "20px" }}>How to Use</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {["Enter any domain name in the input field (e.g. google.com).", "Click Lookup to fetch the WHOIS registration data.", "View registrar, registrant, creation date, and expiry date.", "Check name servers and domain status.", "Domains expiring within 30 days are highlighted with a warning."].map((step, i) => (
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
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", margin: 0 }}>WHOIS data is fetched using the RDAP.org public API. The domain names you look up are sent to their servers. WHOIS data is publicly available information.</p>
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
              <div style={{ fontSize: "48px", flexShrink: 0 }}>🏢</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Investigate Any Domain with WHOIS</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px", lineHeight: "1.6" }}>Use our free WHOIS Lookup to check domain ownership, expiry dates, and registration details.</p>
                <a href="/tools/dns-lookup" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>Try DNS Lookup →</a>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: isMobile ? "static" : "sticky", top: "90px" }}>
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>🔧 Related Tools</h3>
              {[{ name: "DNS Lookup", href: "/tools/dns-lookup" }, { name: "IP Lookup", href: "/tools/ip-lookup" }, { name: "Link Checker", href: "/tools/link-checker" }, { name: "Password Generator", href: "/tools/password-generator" }, { name: "Hash Generator", href: "/tools/hash-generator" }].map((tool, i) => (
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
              {["What is 2FA and Why You Need It", "Domain Security Best Practices", "How to Spot Fake Websites"].map((article, i) => (
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
              {[{ label: "Type", value: "Free Tool" }, { label: "Processing", value: "Via RDAP.org" }, { label: "Account Required", value: "No" }, { label: "Data Stored", value: "None" }, { label: "Output", value: "Domain Info" }].map((item, i) => (
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