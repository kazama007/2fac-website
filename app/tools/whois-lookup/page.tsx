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

export default function WHOISLookup() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async () => {
    if (!domain) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
      const res = await fetch(`https://api.whoisjsonapi.com/v1/${cleanDomain}`, {
        headers: { "Authorization": "Bearer free" }
      });

      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setResult({ domain: cleanDomain, raw: data });
    } catch {
      // Fallback — use rdap
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
          domain: cleanDomain,
          registrar,
          registrant,
          created: created !== "N/A" ? new Date(created).toLocaleDateString() : "N/A",
          updated: updated !== "N/A" ? new Date(updated).toLocaleDateString() : "N/A",
          expires: expires !== "N/A" ? new Date(expires).toLocaleDateString() : "N/A",
          nameservers,
          status,
          tld: `.${tld}`,
        });
      } catch {
        setError("Could not fetch WHOIS data. Try again or check the domain name.");
      }
    }
    setLoading(false);
  };

  const isExpiringSoon = (dateStr: string) => {
    if (!dateStr || dateStr === "N/A") return false;
    const diff = new Date(dateStr).getTime() - Date.now();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
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
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏢</div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>WHOIS Lookup</h1>
            <p style={{ color: "#a0a0b0", fontSize: "14px" }}>Check domain owner, registration and expiry info</p>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="Enter domain (e.g. google.com)"
              style={{ flex: 1, padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", color: "white", fontSize: "15px", outline: "none" }}
            />
            <button onClick={lookup} disabled={loading} style={{ padding: "14px 24px", background: "#7c3aed", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
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
              Fetching WHOIS data...
            </div>
          )}

          {result && !loading && (
            <div>
              {/* Domain Header */}
              <div style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "16px", padding: "20px", textAlign: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🌐</div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#7c3aed" }}>{result.domain}</div>
                {result.tld && <div style={{ fontSize: "13px", color: "#a0a0b0", marginTop: "4px" }}>TLD: {result.tld}</div>}
              </div>

              {/* Info Grid */}
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
                  <div key={item.label} style={{ background: item.warn ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${item.warn ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: "10px", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "18px" }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px", fontWeight: "600", letterSpacing: "0.5px" }}>{item.label.toUpperCase()}</div>
                      <div style={{ fontSize: "14px", color: item.warn ? "#f59e0b" : "#e2e8f0", wordBreak: "break-all" }}>
                        {item.value}
                        {item.warn && <span style={{ marginLeft: "8px", fontSize: "12px", background: "rgba(245,158,11,0.2)", color: "#f59e0b", padding: "2px 8px", borderRadius: "6px" }}>⚠️ Expiring Soon</span>}
                      </div>
                    </div>
                  </div>
                ) : null)}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: "20px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#a0a0b0", lineHeight: "1.6" }}>
          ℹ️ <strong style={{ color: "#fff" }}>What is WHOIS?</strong> WHOIS is a protocol that provides information about domain name registrations including owner, registrar, creation date, and expiry date.
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b0", fontSize: "14px", marginTop: "40px", position: "relative", zIndex: 1 }}>
        © 2025 2fa.ac — Free Cybersecurity Tools for Everyone
      </footer>
    </main>
  );
}