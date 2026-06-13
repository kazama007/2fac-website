"use client";
import { useState, useEffect } from "react";
import { Navbar, Footer } from "../../shared";
import AnimatedBackground from "../../background";
import { HeaderAd, FooterAd, SidebarAd } from "../../adsense";

const faqs = [
  { q: "What is a WebRTC leak?", a: "A WebRTC leak happens when your browser reveals your real IP address through the WebRTC protocol, even when you're using a VPN. WebRTC is used for video calls and peer-to-peer connections, but it can bypass VPN tunnels and expose your true IP to websites." },
  { q: "Does a WebRTC leak affect me if I don't use a VPN?", a: "If you don't use a VPN, a WebRTC leak doesn't expose anything extra — websites can already see your IP. However, it can reveal your local network IP (like 192.168.x.x), which some consider a minor privacy concern." },
  { q: "How do I fix a WebRTC leak?", a: "Fix a WebRTC leak by: (1) Using a VPN with built-in WebRTC leak protection like Mullvad or ProtonVPN, (2) Installing 'WebRTC Leak Prevent' browser extension, (3) Disabling WebRTC in Firefox via about:config → media.peerconnection.enabled → false, or (4) Using Brave Browser which has built-in WebRTC blocking." },
  { q: "Which browsers are affected by WebRTC leaks?", a: "Chrome, Firefox, Edge, Opera, and Brave all support WebRTC and can potentially leak IPs. Safari has stricter WebRTC controls and is less likely to leak. The leak depends on how well your VPN handles WebRTC traffic." },
  { q: "What is the difference between public IP and local IP?", a: "Your public IP is assigned by your ISP and visible to all websites. Your local IP (like 192.168.1.x) is assigned by your router and only visible within your home network. WebRTC can expose both." },
  { q: "Is this WebRTC leak test safe?", a: "Yes, completely. This tool runs 100% in your browser using the standard RTCPeerConnection API. We don't log, store, or send your IP addresses anywhere." },
];

const STUN_SERVERS = [
  { name: "Google 1",     url: "stun:stun.l.google.com:19302" },
  { name: "Google 2",     url: "stun:stun1.l.google.com:19302" },
  { name: "Google 3",     url: "stun:stun2.l.google.com:19302" },
  { name: "Google 4",     url: "stun:stun3.l.google.com:19302" },
  { name: "Cloudflare",   url: "stun:stun.cloudflare.com:3478" },
  { name: "Twilio",       url: "stun:global.stun.twilio.com:3478" },
  { name: "OpenRelay",    url: "stun:openrelay.metered.ca:80" },
  { name: "Nextcloud",    url: "stun:stun.nextcloud.com:443" },
  { name: "1und1",        url: "stun:stun.1und1.de:3478" },
  { name: "Framasoft",    url: "stun:stun.framasoft.org:3478" },
  { name: "XiaoMi",      url: "stun:stun.miwifi.com:3478" },
  { name: "freeSTUN",    url: "stun:freestun.net:3479" },
];

interface StunResult {
  name: string;
  localIp: string;
  publicIp: string;
  status: "testing" | "done" | "disabled";
}

function testStunServer(stunUrl: string, timeout = 4000): Promise<{ local: string; public: string }> {
  return new Promise((resolve) => {
    const localIps: string[] = [];
    const publicIps: string[] = [];
    let done = false;

    try {
      const pc = new (window.RTCPeerConnection as any)({ iceServers: [{ urls: stunUrl }] });
      pc.createDataChannel("");
      pc.createOffer().then((o: any) => pc.setLocalDescription(o)).catch(() => {});

      pc.onicecandidate = (e: any) => {
        if (done) return;
        if (!e || !e.candidate) {
          done = true;
          pc.close();
          resolve({ local: localIps[0] || "—", public: publicIps[0] || "Disabled" });
          return;
        }
        const cand = e.candidate.candidate;
        const ips = cand.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/g) || [];
        ips.forEach((ip: string) => {
          if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip)) {
            if (!localIps.includes(ip)) localIps.push(ip);
          } else if (!ip.startsWith("0.") && !ip.startsWith("127.")) {
            if (!publicIps.includes(ip)) publicIps.push(ip);
          }
        });
      };

      setTimeout(() => {
        if (!done) {
          done = true;
          try { pc.close(); } catch {}
          resolve({ local: localIps[0] || "—", public: publicIps[0] || "Disabled" });
        }
      }, timeout);
    } catch {
      resolve({ local: "—", public: "Disabled" });
    }
  });
}

export default function WebRTCLeakTest() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [results, setResults] = useState<StunResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [done, setDone] = useState(false);
  const [myIp, setMyIp] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check(); setMounted(true);
    window.addEventListener("resize", check);
    fetch("https://api.ipify.org?format=json").then(r => r.json()).then(d => setMyIp(d.ip)).catch(() => {});
    return () => window.removeEventListener("resize", check);
  }, []);

  const runTest = async () => {
    setTesting(true);
    setDone(false);
    // Init all as "testing"
    const initial: StunResult[] = STUN_SERVERS.map(s => ({ name: s.name, localIp: "—", publicIp: "Testing...", status: "testing" as const }));
    setResults(initial);

    // Test each server concurrently
    await Promise.all(
      STUN_SERVERS.map(async (server, i) => {
        const res = await testStunServer(server.url);
        setResults(prev => {
          const updated = [...prev];
          updated[i] = { name: server.name, localIp: res.local, publicIp: res.public, status: res.public === "Disabled" ? "disabled" : "done" };
          return updated;
        });
      })
    );

    setTesting(false);
    setDone(true);
  };

  // Overall leak check
  const leakedIps = results.filter(r => r.publicIp !== "—" && r.publicIp !== "Disabled" && r.publicIp !== "Testing..." && myIp && r.publicIp !== myIp);
  const hasLeak = done && leakedIps.length > 0;
  const allDisabled = done && results.every(r => r.publicIp === "Disabled" || r.publicIp === "—");

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
          <span style={{ color: "#1e293b", fontWeight: "500" }}>WebRTC Leak Test</span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
          <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #ef4444, #f87171)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", flexShrink: 0, boxShadow: "0 8px 24px rgba(239,68,68,0.3)" }}>🔴</div>
          <div>
            <h1 style={{ fontSize: "clamp(22px,5vw,32px)", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" }}>WebRTC Leak Test</h1>
            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Check if your browser is leaking your real IP address through WebRTC — tested against {STUN_SERVERS.length} STUN servers.</p>
          </div>
        </div>

        {/* Trust Badges */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px" }}>
          {["🆓 100% Free", "🔒 No Data Logged", `🌐 ${STUN_SERVERS.length} STUN Servers`, "⚡ Browser-Based"].map(b => (
            <span key={b} style={{ fontSize: "12px", fontWeight: "600", color: "#7c3aed", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "20px", padding: "5px 12px" }}>{b}</span>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mounted && isMobile ? "1fr" : "1fr 320px", gap: "24px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Main Card */}
            <div style={{ background: "#fff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "28px", boxShadow: "0 4px 24px rgba(124,58,237,0.06)" }}>

              {/* Your IP row */}
              {myIp && (
                <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "12px 18px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <span style={{ fontSize: "14px", color: "#64748b" }}>Your IP (HTTP): <strong style={{ color: "#7c3aed", fontFamily: "monospace", fontSize: "15px" }}>{myIp}</strong></span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>WebRTC IPs should match this if no leak</span>
                </div>
              )}

              {/* Status Banner */}
              {done && (
                <div style={{ background: hasLeak ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)", border: `1px solid ${hasLeak ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, borderRadius: "14px", padding: "20px 24px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ fontSize: "36px" }}>{hasLeak ? "⚠️" : "✅"}</div>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: hasLeak ? "#ef4444" : "#22c55e", marginBottom: "4px" }}>
                      {hasLeak ? "WebRTC Leak Detected!" : allDisabled ? "WebRTC Disabled — Safe!" : "No WebRTC Leak Detected"}
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>
                      {hasLeak
                        ? `Your real IP is being exposed by ${leakedIps.length} STUN server(s) even with VPN.`
                        : allDisabled
                        ? "WebRTC is blocked in your browser. No IP addresses were leaked."
                        : "All detected WebRTC IPs match your connection IP. You are protected."}
                    </div>
                  </div>
                </div>
              )}

              {/* Start Button */}
              {!testing && !done && (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: "56px", marginBottom: "16px" }}>🔍</div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>Ready to Test</div>
                  <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "24px" }}>Tests your browser against {STUN_SERVERS.length} major STUN servers simultaneously</div>
                  <button onClick={runTest} style={{ padding: "14px 40px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
                    🚀 Start WebRTC Leak Test
                  </button>
                </div>
              )}

              {/* STUN Server Results Grid */}
              {(testing || done) && results.length > 0 && (
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b", marginBottom: "14px", letterSpacing: "0.5px" }}>
                    STUN SERVER RESULTS {testing && <span style={{ color: "#7c3aed", fontWeight: "400" }}>— Testing...</span>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: mounted && isMobile ? "1fr" : "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                    {results.map((r, i) => {
                      const isLeak = myIp && r.publicIp !== "—" && r.publicIp !== "Disabled" && r.publicIp !== "Testing..." && r.publicIp !== myIp;
                      const isTesting = r.publicIp === "Testing...";
                      return (
                        <div key={i} style={{ background: isLeak ? "rgba(239,68,68,0.05)" : "#f8fafc", border: `1.5px solid ${isLeak ? "rgba(239,68,68,0.3)" : "#e2e8f0"}`, borderRadius: "12px", padding: "16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>{r.name}</span>
                            {isTesting
                              ? <span style={{ fontSize: "10px", color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: "8px" }}>Testing...</span>
                              : isLeak
                              ? <span style={{ fontSize: "10px", fontWeight: "700", color: "#ef4444", background: "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: "8px" }}>⚠️ LEAK</span>
                              : r.publicIp === "Disabled"
                              ? <span style={{ fontSize: "10px", color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: "8px" }}>Disabled</span>
                              : <span style={{ fontSize: "10px", fontWeight: "700", color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: "8px" }}>✓ Safe</span>
                            }
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            <div>
                              <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "3px", fontWeight: "600" }}>LOCAL IP</div>
                              <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", fontFamily: "monospace" }}>{isTesting ? "..." : r.localIp}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "3px", fontWeight: "600" }}>PUBLIC IP</div>
                              <div style={{ fontSize: "12px", fontWeight: "700", color: isLeak ? "#ef4444" : "#1e293b", fontFamily: "monospace" }}>{isTesting ? "..." : r.publicIp}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {done && (
                    <button onClick={runTest} style={{ width: "100%", padding: "12px", background: "#f8fafc", color: "#7c3aed", border: "1.5px solid rgba(124,58,237,0.25)", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                      🔄 Run Test Again
                    </button>
                  )}
                </div>
              )}

              <div style={{ marginTop: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#64748b" }}>
                🔒 <strong style={{ color: "#7c3aed" }}>Privacy:</strong> Runs entirely in your browser. No IPs are sent to our servers or logged.
              </div>
            </div>

            {/* About */}
            <div style={{ background: "#fff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>What Is a WebRTC Leak?</h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: "0 0 10px" }}>WebRTC (Web Real-Time Communication) is a browser technology for video calls and peer-to-peer connections. It requires your real IP to establish connections — and can bypass your VPN tunnel, exposing your true IP to any website.</p>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8", margin: 0 }}>This tool tests your browser against {STUN_SERVERS.length} major STUN servers simultaneously — the same servers used by real services like Google Meet, Cloudflare, and Twilio — to give you the most comprehensive leak test available.</p>
            </div>

            {/* How to Fix */}
            <div style={{ background: "#fff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "20px" }}>How to Fix a WebRTC Leak</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { title: "Use a VPN with WebRTC protection", desc: "Mullvad, ProtonVPN, and NordVPN block WebRTC leaks at the browser level automatically." },
                  { title: "Install WebRTC Leak Prevent extension", desc: "Available for Chrome and Firefox — forces WebRTC traffic through your VPN tunnel." },
                  { title: "Disable WebRTC in Firefox", desc: "Go to about:config → search media.peerconnection.enabled → set to false." },
                  { title: "Use Brave Browser", desc: "Brave has built-in WebRTC blocking. Go to Settings → Privacy → Block WebRTC IP leakage." },
                  { title: "Use Tor Browser", desc: "Tor Browser completely disables WebRTC — the most secure option." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", marginBottom: "3px" }}>{item.title}</div>
                      <div style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
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
            <div style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(124,58,237,0.08))", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px", padding: "28px", display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ fontSize: "48px", flexShrink: 0 }}>🔍</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Also Check for DNS Leaks</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px", lineHeight: "1.6" }}>WebRTC isn't the only way your VPN can leak. Check if your DNS queries are also exposed with our free DNS Leak Test.</p>
                <a href="/tools/dns-leak-test" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>Run DNS Leak Test →</a>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: mounted && isMobile ? "static" : "sticky", top: "90px" }}>
            <SidebarAd />
            <div style={{ background: "#fff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>🔧 Related Tools</h3>
              {[{ name: "DNS Leak Test", href: "/tools/dns-leak-test" }, { name: "IP Lookup", href: "/tools/ip-lookup" }, { name: "DNS Lookup", href: "/tools/dns-lookup" }, { name: "Link Checker", href: "/tools/link-checker" }, { name: "WHOIS Lookup", href: "/tools/whois-lookup" }].map((t, i) => (
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
              {[{ label: "STUN Servers", value: `${STUN_SERVERS.length} servers` }, { label: "Processing", value: "100% Browser" }, { label: "Account Required", value: "No" }, { label: "Data Logged", value: "None" }, { label: "Protocol", value: "WebRTC/STUN" }].map((item, i) => (
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
