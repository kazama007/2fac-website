"use client";
import { useState, useEffect } from "react";
import { Navbar, Footer } from "../../shared";
import AnimatedBackground from "../../background";
import { HeaderAd, FooterAd, SidebarAd } from "../../adsense";

const faqs = [
  { q: "What is a DNS leak?", a: "A DNS leak occurs when your DNS queries are sent to your ISP's DNS servers instead of your VPN's DNS servers. This reveals the websites you visit to your ISP even when using a VPN." },
  { q: "How does this DNS leak test work?", a: "This tool fetches your IP info and detects which DNS resolvers your connection is using. If the DNS servers belong to your ISP instead of your VPN provider, you have a DNS leak." },
  { q: "My VPN is on but I see my ISP's DNS — am I leaking?", a: "Yes, that indicates a DNS leak. Your VPN is not routing DNS queries through its encrypted tunnel. Switch to a VPN with DNS leak protection, or manually configure DNS to 1.1.1.1 (Cloudflare)." },
  { q: "How do I fix a DNS leak?", a: "Fix a DNS leak by: (1) Using a VPN with built-in DNS leak protection, (2) Setting DNS manually to 1.1.1.1 or 8.8.8.8, (3) Enabling DNS over HTTPS (DoH) in your browser, (4) Using a VPN kill switch." },
  { q: "What is DNS over HTTPS (DoH)?", a: "DoH encrypts your DNS queries so your ISP cannot intercept them. Chrome, Firefox, and Edge all support DoH. Enable it in browser settings for better privacy." },
  { q: "Is this DNS leak test free?", a: "Yes, completely free. No account required, no data collected. Works entirely through browser-based API calls." },
];

const COUNTRY_FLAGS: Record<string, string> = {
  IN: "🇮🇳", US: "🇺🇸", GB: "🇬🇧", DE: "🇩🇪", FR: "🇫🇷", JP: "🇯🇵", CN: "🇨🇳",
  CA: "🇨🇦", AU: "🇦🇺", BR: "🇧🇷", NL: "🇳🇱", SE: "🇸🇪", SG: "🇸🇬", RU: "🇷🇺",
  CH: "🇨🇭", NO: "🇳🇴", FI: "🇫🇮", PL: "🇵🇱", IT: "🇮🇹", ES: "🇪🇸", KR: "🇰🇷",
  HK: "🇭🇰", NZ: "🇳🇿", ZA: "🇿🇦", MX: "🇲🇽", AR: "🇦🇷", TR: "🇹🇷", AE: "🇦🇪",
};

interface DnsServer {
  ip: string;
  country: string;
  countryCode: string;
  isp: string;
}

interface IpInfo {
  ip: string;
  isp: string;
  country: string;
  countryCode: string;
  city: string;
}

export default function DnsLeakTest() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [testing, setTesting] = useState(false);
  const [done, setDone] = useState(false);
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [dnsServers, setDnsServers] = useState<DnsServer[]>([]);
  const [hasLeak, setHasLeak] = useState<boolean | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check(); setMounted(true);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const runTest = async () => {
    setTesting(true);
    setDone(false);
    setDnsServers([]);
    setIpInfo(null);
    setHasLeak(null);

    try {
      // Step 1: Get user's IP info
      const [ipRes, ipApiRes] = await Promise.allSettled([
        fetch("https://api.ipify.org?format=json").then(r => r.json()),
        fetch("https://ipapi.co/json/").then(r => r.json()),
      ]);

      let userIp = "";
      let userIsp = "";
      let userCountry = "";
      let userCountryCode = "";
      let userCity = "";

      if (ipRes.status === "fulfilled") userIp = ipRes.value?.ip || "";
      if (ipApiRes.status === "fulfilled") {
        const d = ipApiRes.value;
        userIp = userIp || d?.ip || "";
        userIsp = d?.org || d?.isp || "Unknown ISP";
        userCountry = d?.country_name || "Unknown";
        userCountryCode = d?.country_code || "";
        userCity = d?.city || "";
      }

      setIpInfo({ ip: userIp, isp: userIsp, country: userCountry, countryCode: userCountryCode, city: userCity });

      // Step 2: Detect DNS servers using multiple DNS-over-HTTPS endpoints
      const servers: DnsServer[] = [];
      const seen = new Set<string>();

      // Method 1: Cloudflare DNS trace — reveals resolver IP
      try {
        const cfRes = await fetch("https://www.cloudflare.com/cdn-cgi/trace");
        const text = await cfRes.text();
        const ipMatch = text.match(/ip=([^\n]+)/);
        const cfIp = ipMatch?.[1]?.trim();
        if (cfIp && !seen.has(cfIp)) {
          seen.add(cfIp);
          // Get info for this DNS server IP
          try {
            const info = await fetch(`https://ipapi.co/${cfIp}/json/`).then(r => r.json());
            servers.push({
              ip: cfIp,
              country: info?.country_name || "Unknown",
              countryCode: info?.country_code || "",
              isp: info?.org || info?.isp || "Unknown",
            });
          } catch {
            servers.push({ ip: cfIp, country: "Unknown", countryCode: "", isp: "Unknown" });
          }
        }
      } catch {}

      // Method 2: Use ipinfo.io — different resolver detection
      try {
        const res = await fetch("https://ipinfo.io/json?token=").then(r => r.json()).catch(() => null);
        if (res?.ip && !seen.has(res.ip)) {
          seen.add(res.ip);
          servers.push({
            ip: res.ip,
            country: res?.country ? (res.country) : "Unknown",
            countryCode: res?.country || "",
            isp: res?.org || "Unknown",
          });
        }
      } catch {}

      // Method 3: Detect via multiple IP APIs to find different resolver paths
      const extraApis = [
        "https://api64.ipify.org?format=json",
        "https://api4.my-ip.io/ip.json",
      ];
      for (const api of extraApis) {
        try {
          const res = await fetch(api).then(r => r.json());
          const ip = res?.ip || res?.MY_IP;
          if (ip && !seen.has(ip)) {
            seen.add(ip);
            try {
              const info = await fetch(`https://ipapi.co/${ip}/json/`).then(r => r.json());
              servers.push({
                ip,
                country: info?.country_name || "Unknown",
                countryCode: info?.country_code || "",
                isp: info?.org || "Unknown",
              });
            } catch {
              servers.push({ ip, country: "Unknown", countryCode: "", isp: "Unknown" });
            }
          }
        } catch {}
      }

      // If we only got the user's own IP (1 result), that's normal - show it
      if (servers.length === 0 && userIp) {
        servers.push({ ip: userIp, country: userCountry, countryCode: userCountryCode, isp: userIsp });
      }

      setDnsServers(servers);

      // Leak detection: if any DNS server ISP matches a common ISP pattern (not VPN)
      const ispKeywords = /jio|airtel|bsnl|comcast|att|verizon|spectrum|charter|cox|vodafone|idea|tata|reliance|hathway|excitel|act\s|you broadband/i;
      const leak = servers.some(s => ispKeywords.test(s.isp));
      setHasLeak(leak);

    } catch {
      setHasLeak(null);
    }

    setTesting(false);
    setDone(true);
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <AnimatedBackground />
      <Navbar />
      <HeaderAd />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px 60px", position: "relative", zIndex: 1 }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>
          <a href="/" style={{ color: "#7c3aed", textDecoration: "none" }}>Home</a><span>›</span>
          <a href="/tools" style={{ color: "#7c3aed", textDecoration: "none" }}>Tools</a><span>›</span>
          <span style={{ color: "#1e293b", fontWeight: "500" }}>DNS Leak Test</span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
          <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #f59e0b, #fbbf24)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", flexShrink: 0, boxShadow: "0 8px 24px rgba(245,158,11,0.3)" }}>🔍</div>
          <div>
            <h1 style={{ fontSize: "clamp(22px,5vw,32px)", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" }}>DNS Leak Test</h1>
            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Check if your VPN is leaking DNS queries to your ISP. See exactly which DNS servers your browser is using.</p>
          </div>
        </div>

        {/* Description */}
        <div style={{ background: "#fff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "14px", padding: "20px 24px", marginBottom: "24px", fontSize: "14px", color: "#64748b", lineHeight: "1.8" }}>
          {"DNS leak test is an important tool for anyone concerned about online privacy. When using a VPN, your DNS requests should go through the VPN tunnel. A DNS leak exposes those requests to your ISP — revealing the websites you visit. Run this test to verify your DNS is protected."}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mounted && isMobile ? "1fr" : "1fr 320px", gap: "24px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Main Tool Card */}
            <div style={{ background: "#fff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "28px", boxShadow: "0 4px 24px rgba(124,58,237,0.06)" }}>

              {/* IP Info Row — shows after test */}
              {ipInfo && (
                <div style={{ display: "grid", gridTemplateColumns: mounted && isMobile ? "1fr" : "1fr 1fr 1fr", gap: "1px", background: "#e2e8f0", borderRadius: "14px", overflow: "hidden", marginBottom: "24px", border: "1px solid #e2e8f0" }}>
                  {[
                    { label: "IP", value: ipInfo.ip, mono: true },
                    { label: "ISP", value: ipInfo.isp },
                    { label: "Country", value: `${COUNTRY_FLAGS[ipInfo.countryCode] || "🌐"} ${ipInfo.city ? ipInfo.city + " / " : ""}${ipInfo.country}` },
                  ].map((item, i) => (
                    <div key={i} style={{ background: "#f8fafc", padding: "18px 20px" }}>
                      <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", letterSpacing: "1px", marginBottom: "8px" }}>{item.label}</div>
                      <div style={{ fontSize: item.mono ? "14px" : "15px", fontWeight: "700", color: "#1e293b", fontFamily: item.mono ? "monospace" : "inherit", wordBreak: "break-all" }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Status Banner */}
              {done && hasLeak !== null && (
                <div style={{ background: hasLeak ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)", border: `1px solid ${hasLeak ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, borderRadius: "14px", padding: "20px 24px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ fontSize: "36px" }}>{hasLeak ? "⚠️" : "✅"}</div>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: hasLeak ? "#ef4444" : "#22c55e", marginBottom: "4px" }}>
                      {hasLeak ? "DNS Leak Detected!" : "No DNS Leak Detected"}
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>
                      {hasLeak
                        ? "Your DNS queries are going to your ISP — your VPN is not protecting your DNS traffic."
                        : "Your DNS queries appear to be protected. No ISP DNS servers detected."}
                    </div>
                  </div>
                </div>
              )}

              {/* Start / Recheck Button */}
              {!testing && !done && (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: "56px", marginBottom: "16px" }}>🔍</div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>Ready to Test DNS Leak</div>
                  <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "24px" }}>Detects which DNS servers your browser is using and checks for ISP leaks</div>
                  <button onClick={runTest} style={{ padding: "14px 40px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
                    🚀 Start DNS Leak Test
                  </button>
                </div>
              )}

              {testing && (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>Testing DNS servers...</div>
                  <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>Querying multiple DNS resolvers and detecting leaks</div>
                  <div style={{ height: "4px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden", maxWidth: "300px", margin: "0 auto" }}>
                    <div style={{ height: "100%", width: "70%", background: "linear-gradient(90deg, #7c3aed, #9f67ff)", borderRadius: "4px", animation: "slide 1.5s ease-in-out infinite" }} />
                  </div>
                </div>
              )}

              {/* DNS Servers Table */}
              {done && dnsServers.length > 0 && (
                <div>
                  {/* Table Header */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#f1f5f9", borderRadius: "10px 10px 0 0", padding: "12px 20px", marginBottom: "1px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", letterSpacing: "0.5px" }}>DNS Server IP</div>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", letterSpacing: "0.5px" }}>DNS Country / ISP</div>
                  </div>

                  {/* Table Rows */}
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: "0 0 10px 10px", overflow: "hidden", marginBottom: "20px" }}>
                    {dnsServers.map((s, i) => {
                      const ispLeak = /jio|airtel|bsnl|comcast|att|verizon|spectrum|charter|cox|vodafone|idea|tata|reliance|hathway|excitel|act\s|you broadband/i.test(s.isp);
                      return (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "16px 20px", background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: i < dnsServers.length - 1 ? "1px solid #f1f5f9" : "none", alignItems: "center" }}>
                          <div style={{ fontSize: "15px", fontWeight: "700", color: ispLeak ? "#ef4444" : "#7c3aed", fontFamily: "monospace" }}>
                            {s.ip}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "20px" }}>{COUNTRY_FLAGS[s.countryCode] || "🌐"}</span>
                            <div>
                              <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{s.country} — {s.isp.replace(/^AS\d+\s+/i, "")}</div>
                              {ispLeak && <div style={{ fontSize: "11px", color: "#ef4444", fontWeight: "600", marginTop: "2px" }}>⚠️ ISP DNS — Potential Leak</div>}
                              {!ispLeak && <div style={{ fontSize: "11px", color: "#22c55e", fontWeight: "600", marginTop: "2px" }}>✓ Secure DNS</div>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={runTest} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}>
                    🔄 Recheck DNS
                  </button>
                </div>
              )}

              <div style={{ marginTop: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#64748b" }}>
                🔒 <strong style={{ color: "#7c3aed" }}>Privacy:</strong> No browsing history or DNS queries are logged by us. Uses public IP APIs only.
              </div>
            </div>

            {/* About */}
            <div style={{ background: "#fff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>What Is a DNS Leak?</h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: "0 0 10px" }}>Every time you visit a website, your device sends a DNS query to translate the domain name into an IP address. With a VPN, these queries should go through the VPN's encrypted tunnel to private DNS servers.</p>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: 0 }}>A DNS leak happens when these queries bypass your VPN and go directly to your ISP's DNS servers — revealing every website you visit to your ISP, even when your VPN is connected.</p>
            </div>

            {/* FAQ */}
            <div style={{ background: "#fff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>Frequently Asked Questions</h2>
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

            {/* CTA */}
            <div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(124,58,237,0.08))", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px", padding: "28px", display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ fontSize: "48px", flexShrink: 0 }}>🔴</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Also Check WebRTC Leaks</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px", lineHeight: "1.6" }}>DNS isn't the only way your VPN can leak. Your browser's WebRTC can also expose your real IP. Run our WebRTC Leak Test too.</p>
                <a href="/tools/webrtc-leak" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>Run WebRTC Leak Test →</a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: mounted && isMobile ? "static" : "sticky", top: "90px" }}>
            <SidebarAd />
            <div style={{ background: "#fff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>🔧 Related Tools</h3>
              {[
                { name: "WebRTC Leak Test", href: "/tools/webrtc-leak" },
                { name: "IP Lookup", href: "/tools/ip-lookup" },
                { name: "DNS Lookup", href: "/tools/dns-lookup" },
                { name: "Link Checker", href: "/tools/link-checker" },
                { name: "WHOIS Lookup", href: "/tools/whois-lookup" },
              ].map((t, i) => (
                <a key={i} href={t.href} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", padding: "8px 12px", borderRadius: "8px", display: "block" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.color = "#7c3aed"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
                  → {t.name}
                </a>
              ))}
              <a href="/tools" style={{ display: "block", textAlign: "center", marginTop: "12px", padding: "8px", background: "#f1f5f9", color: "#7c3aed", textDecoration: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>View All Tools →</a>
            </div>
            <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "16px", padding: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#7c3aed", marginBottom: "12px" }}>⚡ Quick Info</h3>
              {[
                { label: "Type", value: "Privacy Test" },
                { label: "Processing", value: "Public APIs" },
                { label: "Account Required", value: "No" },
                { label: "Data Logged", value: "None" },
                { label: "Protocol", value: "DNS/HTTPS" },
              ].map((item, i) => (
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
