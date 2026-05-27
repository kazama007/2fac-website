"use client";
import { useState, useEffect, useRef } from "react";
import { Navbar, Footer } from "../../shared";
import AnimatedBackground from "../../background";
import { HeaderAd, FooterAd, SidebarAd, InArticleAd } from "../../adsense";



const typeColors: { [key: string]: string } = { A: "#3b82f6", AAAA: "#8b5cf6", MX: "#f59e0b", NS: "#22c55e", TXT: "#ec4899", CNAME: "#06b6d4", SOA: "#f97316" };

const faqs = [
  { q: "What is a DNS lookup?", a: "A DNS (Domain Name System) lookup queries DNS servers to find records associated with a domain name. It translates human-readable domain names into IP addresses and retrieves other domain configuration information." },
  { q: "What are the different DNS record types?", a: "A records map a domain to an IPv4 address. AAAA records map to IPv6. MX records define mail servers. NS records define name servers. TXT records store text data like SPF and DKIM. CNAME records are aliases to other domains." },
  { q: "What does TTL mean in DNS?", a: "TTL (Time To Live) is the number of seconds a DNS record is cached by resolvers. A lower TTL means changes propagate faster but increase DNS query load. A higher TTL reduces load but takes longer to update." },
  { q: "How does this DNS lookup tool work?", a: "This tool uses Google's public DNS-over-HTTPS API (dns.google) to fetch DNS records. Your query goes directly to Google's DNS resolver, which returns the authoritative records for the domain." },
  { q: "Why do DNS records sometimes show old information?", a: "DNS records are cached by resolvers worldwide. After a record is changed, it can take up to the TTL duration for all resolvers to update. This is called DNS propagation and can take from minutes to 48 hours." },
];

export default function DNSLookup() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    setMounted(true);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      setResults({ type, domain: cleanDomain, answers: data.Answer || [] });
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
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <AnimatedBackground />
      <Navbar />
      <HeaderAd />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px 60px", position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>
          <a href="/" style={{ color: "#7c3aed", textDecoration: "none" }}>Home</a><span>›</span>
          <a href="/tools" style={{ color: "#7c3aed", textDecoration: "none" }}>Tools</a><span>›</span>
          <span style={{ color: "#1e293b", fontWeight: "500" }}>DNS Lookup</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "36px" }}>
          <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #3b82f6, #60a5fa)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", flexShrink: 0, boxShadow: "0 8px 24px rgba(59,130,246,0.3)" }}>🌐</div>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" }}>DNS Lookup</h1>
            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Query A, AAAA, MX, NS, TXT, CNAME, and SOA records for any domain instantly.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mounted && isMobile ? "1fr" : "1fr 320px", gap: "24px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(124,58,237,0.06)" }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === "Enter" && lookupAll()}
                  placeholder="Enter domain (e.g. google.com)"
                  style={{ flex: 1, padding: "14px 16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "15px", outline: "none" }}
                  onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
                  onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
                />
                <button onClick={lookupAll} disabled={loading} style={{ padding: "14px 20px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
                  {loading ? "..." : "Lookup"}
                </button>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                {recordTypes.map(type => (
                  <button key={type} onClick={() => lookup(type)} style={{ padding: "6px 14px", background: activeType === type ? (typeColors[type] || "#7c3aed") : "#f1f5f9", border: activeType === type ? "none" : "1.5px solid #e2e8f0", borderRadius: "8px", color: activeType === type ? "white" : "#64748b", cursor: "pointer", fontSize: "13px", fontWeight: activeType === type ? "600" : "400" }}>
                    {type}
                  </button>
                ))}
              </div>

              {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#ef4444", marginBottom: "16px" }}>❌ {error}</div>}

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
                                <span style={{ background: `${typeColors[results.type] || "#7c3aed"}15`, color: typeColors[results.type] || "#7c3aed", fontSize: "11px", padding: "2px 8px", borderRadius: "6px", fontWeight: "700", marginRight: "10px" }}>{results.type}</span>
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
                          <div style={{ fontSize: "13px", fontWeight: "700", color: typeColors[type] || "#7c3aed", marginBottom: "8px" }}>{type} Records</div>
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

              <div style={{ marginTop: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#64748b" }}>
                ℹ️ <strong style={{ color: "#7c3aed" }}>How it works:</strong> DNS records are fetched using Google's public DNS API (dns.google). A — IP address, MX — Mail server, NS — Name server, TXT — Text records.
              </div>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>About DNS Lookup</h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: "0 0 10px" }}>Our DNS Lookup tool lets you query all DNS record types for any domain using Google's public DNS API. Get instant results for A, MX, NS, TXT, CNAME, AAAA, and SOA records.</p>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: 0 }}>Perfect for developers troubleshooting DNS issues, verifying domain configurations, or checking email server setups.</p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "20px" }}>How to Use</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {["Enter the domain name in the input field (e.g. google.com).", "Click Lookup to query all common DNS record types at once.", "Or click a specific record type button (A, MX, NS, TXT, etc.) to query just that type.", "View the results with record data and TTL values."].map((step, i) => (
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
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", margin: 0 }}>DNS queries are made through Google's public DNS API (dns.google). The domain names you look up are sent to Google's DNS resolver as part of the lookup process.</p>
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
              <div style={{ fontSize: "48px", flexShrink: 0 }}>🌐</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Diagnose DNS Issues Instantly</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px", lineHeight: "1.6" }}>Use our free DNS Lookup tool to troubleshoot domain configurations and email server setups.</p>
                <a href="/tools/whois-lookup" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>Try WHOIS Lookup →</a>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: mounted && isMobile ? "static" : "sticky", top: "90px" }}>
            <SidebarAd />
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>🔧 Related Tools</h3>
              {[{ name: "WHOIS Lookup", href: "/tools/whois-lookup" }, { name: "IP Lookup", href: "/tools/ip-lookup" }, { name: "Link Checker", href: "/tools/link-checker" }, { name: "Password Generator", href: "/tools/password-generator" }, { name: "Hash Generator", href: "/tools/hash-generator" }].map((tool, i) => (
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
              {[{ label: "Type", value: "Free Tool" }, { label: "Processing", value: "Via Google DNS" }, { label: "Account Required", value: "No" }, { label: "Data Stored", value: "None" }, { label: "Records", value: "7 types" }].map((item, i) => (
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