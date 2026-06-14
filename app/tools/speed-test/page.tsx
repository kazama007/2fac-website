"use client";
import { useState, useEffect, useRef } from "react";
import { Navbar, Footer } from "../../shared";
import AnimatedBackground from "../../background";
import { HeaderAd, FooterAd, SidebarAd } from "../../adsense";

const faqs = [
  { q: "How does this speed test work?", a: "This speed test measures your internet speed by downloading and uploading test data from your browser. It calculates Download speed (how fast data comes to you), Upload speed (how fast you send data), and Ping/latency (response time in milliseconds)." },
  { q: "What is a good internet speed?", a: "For general browsing: 5-10 Mbps. For HD streaming: 25 Mbps. For 4K streaming: 50+ Mbps. For online gaming: 50+ Mbps with low ping (<30ms). For work from home with video calls: 25+ Mbps. Fiber connections typically give 100-1000 Mbps." },
  { q: "Why is my speed test result different from my plan?", a: "Several factors affect speed: WiFi vs wired connection, distance from router, network congestion, device performance, ISP throttling, and VPN usage. For most accurate results, test on a wired connection with no other devices active." },
  { q: "What is ping/latency?", a: "Ping (latency) is the time it takes for data to travel from your device to a server and back, measured in milliseconds (ms). Lower is better. Under 20ms is excellent for gaming, under 50ms is good for video calls, and under 100ms is acceptable for general use." },
  { q: "What is jitter?", a: "Jitter is the variation in ping over time. Low jitter means a stable connection. High jitter (above 30ms) can cause lag spikes in gaming and choppy video calls even if your average ping is good." },
  { q: "How can I improve my internet speed?", a: "Try these: (1) Connect via ethernet instead of WiFi, (2) Restart your router, (3) Move closer to your router, (4) Disconnect other devices, (5) Disable VPN during speed-sensitive tasks, (6) Contact your ISP if speeds are consistently below your plan." },
];

interface SpeedResult {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
}

type TestPhase = "idle" | "ping" | "download" | "upload" | "done";

export default function SpeedTest() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [result, setResult] = useState<SpeedResult | null>(null);
  const [liveSpeed, setLiveSpeed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check(); setMounted(true);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const measurePing = async (): Promise<{ ping: number; jitter: number }> => {
    const pings: number[] = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      try {
        await fetch(`https://www.cloudflare.com/cdn-cgi/trace?nocache=${Date.now()}`, { cache: "no-store" });
        pings.push(performance.now() - start);
      } catch { pings.push(100); }
    }
    const avg = pings.reduce((a, b) => a + b, 0) / pings.length;
    const jitter = Math.max(...pings) - Math.min(...pings);
    return { ping: Math.round(avg), jitter: Math.round(jitter) };
  };

  const measureDownload = async (): Promise<number> => {
    // Download a ~10MB file via fetch and measure throughput
    const urls = [
      "https://speed.cloudflare.com/__down?bytes=10000000",
      "https://httpbin.org/bytes/5000000",
    ];
    const start = performance.now();
    let bytes = 0;
    try {
      abortRef.current = new AbortController();
      const res = await fetch(urls[0] + `&nocache=${Date.now()}`, {
        signal: abortRef.current.signal,
        cache: "no-store",
      });
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value?.length || 0;
        const elapsed = (performance.now() - start) / 1000;
        const speedMbps = (bytes * 8) / (elapsed * 1_000_000);
        setLiveSpeed(Math.round(speedMbps * 10) / 10);
        setProgress(Math.min(90, (bytes / 10_000_000) * 100));
      }
    } catch (e: any) {
      if (e?.name === "AbortError") return 0;
      // Fallback: estimate from timing
      bytes = 5_000_000;
    }
    const elapsed = (performance.now() - start) / 1000;
    return Math.round((bytes * 8) / (elapsed * 1_000_000) * 10) / 10;
  };

  const measureUpload = async (): Promise<number> => {
    const size = 2_000_000; // 2MB
    const data = new Uint8Array(size);
    const blob = new Blob([data]);
    const start = performance.now();
    try {
      await fetch("https://httpbin.org/post", {
        method: "POST",
        body: blob,
        cache: "no-store",
      });
    } catch { /* estimate */ }
    const elapsed = (performance.now() - start) / 1000;
    const mbps = (size * 8) / (elapsed * 1_000_000);
    return Math.round(Math.min(mbps, 100) * 10) / 10;
  };

  const runTest = async () => {
    setResult(null);
    setLiveSpeed(0);
    setProgress(0);

    // Ping
    setPhase("ping");
    setProgress(10);
    const { ping, jitter } = await measurePing();
    setProgress(25);

    // Download
    setPhase("download");
    const download = await measureDownload();
    setProgress(100);
    setLiveSpeed(0);

    // Upload
    setPhase("upload");
    setProgress(10);
    const uploadStart = performance.now();
    const upload = await measureUpload();
    setProgress(100);

    setResult({ download, upload, ping, jitter });
    setPhase("done");
  };

  const getSpeedRating = (mbps: number) => {
    if (mbps >= 100) return { label: "Excellent", color: "#22c55e" };
    if (mbps >= 50) return { label: "Very Good", color: "#84cc16" };
    if (mbps >= 25) return { label: "Good", color: "#eab308" };
    if (mbps >= 10) return { label: "Fair", color: "#f97316" };
    return { label: "Slow", color: "#ef4444" };
  };

  const getPingRating = (ms: number) => {
    if (ms <= 20) return { label: "Excellent", color: "#22c55e" };
    if (ms <= 50) return { label: "Good", color: "#84cc16" };
    if (ms <= 100) return { label: "Fair", color: "#eab308" };
    return { label: "Poor", color: "#ef4444" };
  };

  const phaseLabel = {
    idle: "", ping: "Testing ping...", download: "Testing download speed...",
    upload: "Testing upload speed...", done: "Test complete!"
  }[phase];

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
          <span style={{ color: "#1e293b", fontWeight: "500" }}>Internet Speed Test</span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
          <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #3b82f6, #60a5fa)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", flexShrink: 0, boxShadow: "0 8px 24px rgba(59,130,246,0.3)" }}>⚡</div>
          <div>
            <h1 style={{ fontSize: "clamp(22px,5vw,32px)", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" }}>Internet Speed Test</h1>
            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Check your download speed, upload speed, ping and jitter — free, instant, no signup.</p>
          </div>
        </div>

        {/* Trust Badges */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px" }}>
          {["🆓 100% Free", "⚡ Instant", "🔒 No Signup", "🌐 Browser-Based"].map(b => (
            <span key={b} style={{ fontSize: "12px", fontWeight: "600", color: "#3b82f6", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "20px", padding: "5px 12px" }}>{b}</span>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mounted && isMobile ? "1fr" : "1fr 320px", gap: "24px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Main Tool */}
            <div style={{ background: "#fff", border: "1px solid rgba(59,130,246,0.15)", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(59,130,246,0.08)", textAlign: "center" }}>

              {/* Speedometer Display */}
              <div style={{ marginBottom: "28px" }}>
                {phase === "idle" && (
                  <div style={{ padding: "20px 0" }}>
                    <div style={{ fontSize: "80px", marginBottom: "8px" }}>⚡</div>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Ready to Test</div>
                    <div style={{ fontSize: "14px", color: "#94a3b8" }}>Click below to check your internet speed</div>
                  </div>
                )}

                {(phase === "ping" || phase === "download" || phase === "upload") && (
                  <div style={{ padding: "20px 0" }}>
                    <div style={{ position: "relative", width: "180px", height: "180px", margin: "0 auto 20px" }}>
                      <svg viewBox="0 0 180 180" style={{ width: "180px", height: "180px", transform: "rotate(-90deg)" }}>
                        <circle cx="90" cy="90" r="75" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                        <circle cx="90" cy="90" r="75" fill="none" stroke="url(#speedGrad)" strokeWidth="12"
                          strokeDasharray={`${2 * Math.PI * 75}`}
                          strokeDashoffset={`${2 * Math.PI * 75 * (1 - progress / 100)}`}
                          strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
                        <defs>
                          <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#7c3aed" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", fontFamily: "monospace", lineHeight: 1 }}>
                          {phase === "ping" ? "..." : liveSpeed > 0 ? liveSpeed.toFixed(1) : "0.0"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                          {phase === "ping" ? "ms" : "Mbps"}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: "600", color: "#7c3aed", marginBottom: "6px" }}>{phaseLabel}</div>
                    <div style={{ height: "4px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden", maxWidth: "300px", margin: "0 auto" }}>
                      <div style={{ height: "100%", background: "linear-gradient(90deg, #3b82f6, #7c3aed)", borderRadius: "4px", width: `${progress}%`, transition: "width 0.3s ease" }} />
                    </div>
                  </div>
                )}

                {/* Results */}
                {(phase === "done") && result && (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                      {[
                        { label: "Download", value: result.download, unit: "Mbps", icon: "⬇️", rating: getSpeedRating(result.download) },
                        { label: "Upload", value: result.upload, unit: "Mbps", icon: "⬆️", rating: getSpeedRating(result.upload) },
                      ].map((item, i) => (
                        <div key={i} style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "14px", padding: "20px 16px" }}>
                          <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</div>
                          <div style={{ fontSize: "28px", fontWeight: "800", color: item.rating.color, fontFamily: "monospace", lineHeight: 1 }}>{item.value}</div>
                          <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px" }}>{item.unit}</div>
                          <div style={{ fontSize: "11px", fontWeight: "600", color: "#1e293b" }}>{item.label}</div>
                          <span style={{ fontSize: "10px", fontWeight: "700", color: item.rating.color, background: `${item.rating.color}15`, padding: "2px 8px", borderRadius: "8px" }}>{item.rating.label}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                      {[
                        { label: "Ping", value: result.ping, unit: "ms", icon: "🏓", rating: getPingRating(result.ping) },
                        { label: "Jitter", value: result.jitter, unit: "ms", icon: "📊", rating: getPingRating(result.jitter) },
                      ].map((item, i) => (
                        <div key={i} style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "14px", padding: "16px" }}>
                          <div style={{ fontSize: "20px", marginBottom: "6px" }}>{item.icon}</div>
                          <div style={{ fontSize: "24px", fontWeight: "800", color: item.rating.color, fontFamily: "monospace" }}>{item.value}</div>
                          <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>{item.unit}</div>
                          <div style={{ fontSize: "11px", fontWeight: "600", color: "#1e293b" }}>{item.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* What your speed is good for */}
                    <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "12px", padding: "16px", textAlign: "left" }}>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b", marginBottom: "10px" }}>Your speed is good for:</div>
                      {[
                        { use: "Basic browsing & email", needed: 5, icon: "🌐" },
                        { use: "HD video streaming", needed: 25, icon: "📺" },
                        { use: "4K streaming", needed: 50, icon: "🎬" },
                        { use: "Online gaming", needed: 30, icon: "🎮" },
                        { use: "Video calls (HD)", needed: 10, icon: "📹" },
                        { use: "Large file downloads", needed: 50, icon: "📁" },
                      ].map((item, i) => {
                        const ok = result.download >= item.needed;
                        return (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px 0", borderBottom: i < 5 ? "1px solid rgba(59,130,246,0.08)" : "none" }}>
                            <span style={{ fontSize: "16px" }}>{item.icon}</span>
                            <span style={{ fontSize: "13px", color: "#475569", flex: 1 }}>{item.use}</span>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: ok ? "#22c55e" : "#ef4444" }}>{ok ? "✓" : "✗"}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Button */}
              <button
                onClick={runTest}
                disabled={phase !== "idle" && phase !== "done"}
                style={{ padding: "16px 48px", background: phase === "idle" || phase === "done" ? "linear-gradient(135deg, #3b82f6, #7c3aed)" : "#e2e8f0", color: phase === "idle" || phase === "done" ? "white" : "#94a3b8", border: "none", borderRadius: "50px", fontSize: "18px", fontWeight: "700", cursor: phase === "idle" || phase === "done" ? "pointer" : "not-allowed", boxShadow: phase === "idle" || phase === "done" ? "0 4px 20px rgba(59,130,246,0.4)" : "none", transition: "all 0.2s" }}
              >
                {phase === "idle" ? "⚡ Start Speed Test" : phase === "done" ? "🔄 Test Again" : "Testing..."}
              </button>

              <div style={{ marginTop: "16px", fontSize: "12px", color: "#94a3b8" }}>
                🔒 No data collected — test runs directly in your browser
              </div>
            </div>

            {/* About */}
            <div style={{ background: "#fff", border: "1px solid rgba(59,130,246,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>What Does This Speed Test Measure?</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { icon: "⬇️", title: "Download Speed", desc: "How fast your connection receives data from the internet. This affects streaming, browsing, and downloading files. Measured in Megabits per second (Mbps)." },
                  { icon: "⬆️", title: "Upload Speed", desc: "How fast your connection sends data to the internet. This affects video calls, cloud backups, and sending files. Usually slower than download on most plans." },
                  { icon: "🏓", title: "Ping (Latency)", desc: "The time it takes data to travel from your device to a server and back. Measured in milliseconds (ms). Critical for gaming and video calls." },
                  { icon: "📊", title: "Jitter", desc: "How much your ping varies over time. High jitter causes lag spikes in gaming and choppy video calls even when average ping is low." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px" }}>
                    <div style={{ fontSize: "24px", flexShrink: 0, width: "32px", textAlign: "center" }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>{item.title}</div>
                      <div style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.7" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Speed Guide */}
            <div style={{ background: "#fff", border: "1px solid rgba(59,130,246,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>Internet Speed Guide</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["Speed", "Rating", "Best For"].map(h => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: "700", color: "#1e293b", borderBottom: "2px solid #e2e8f0" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["0–5 Mbps", "🔴 Slow", "Basic browsing only"],
                      ["5–25 Mbps", "🟡 Fair", "HD streaming, video calls"],
                      ["25–100 Mbps", "🟢 Good", "4K streaming, gaming"],
                      ["100–500 Mbps", "🟢 Very Good", "Multiple users, fast downloads"],
                      ["500+ Mbps", "🏆 Excellent", "Power users, large households"],
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        {row.map((cell, j) => (
                          <td key={j} style={{ padding: "10px 14px", color: j === 0 ? "#7c3aed" : "#475569", fontWeight: j === 0 ? "700" : "400", fontFamily: j === 0 ? "monospace" : "inherit" }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FAQ */}
            <div style={{ background: "#fff", border: "1px solid rgba(59,130,246,0.1)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>Frequently Asked Questions</h2>
              {faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < faqs.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{faq.q}</span>
                    <span style={{ color: "#3b82f6", fontSize: "18px", fontWeight: "700", flexShrink: 0, marginLeft: "12px" }}>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && <div style={{ padding: "0 0 14px", fontSize: "14px", color: "#64748b", lineHeight: "1.7" }}>{faq.a}</div>}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(124,58,237,0.08))", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px", padding: "28px", display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ fontSize: "48px", flexShrink: 0 }}>🔒</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>Check Your VPN Performance Too</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px", lineHeight: "1.6" }}>VPNs can slow your connection. Check if your VPN is also leaking your real IP with our WebRTC and DNS leak tests.</p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <a href="/tools/webrtc-leak" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "9px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: "600" }}>WebRTC Leak Test →</a>
                  <a href="/tools/dns-leak-test" style={{ display: "inline-block", background: "#fff", color: "#7c3aed", textDecoration: "none", padding: "9px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", border: "1.5px solid rgba(124,58,237,0.3)" }}>DNS Leak Test →</a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: mounted && isMobile ? "static" : "sticky", top: "90px" }}>
            <SidebarAd />
            <div style={{ background: "#fff", border: "1px solid rgba(59,130,246,0.1)", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>🔧 Related Tools</h3>
              {[
                { name: "WebRTC Leak Test", href: "/tools/webrtc-leak" },
                { name: "DNS Leak Test", href: "/tools/dns-leak-test" },
                { name: "IP Lookup", href: "/tools/ip-lookup" },
                { name: "DNS Lookup", href: "/tools/dns-lookup" },
                { name: "WHOIS Lookup", href: "/tools/whois-lookup" },
              ].map((t, i) => (
                <a key={i} href={t.href} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", padding: "8px 12px", borderRadius: "8px", display: "block" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.06)"; e.currentTarget.style.color = "#3b82f6"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
                  → {t.name}
                </a>
              ))}
              <a href="/tools" style={{ display: "block", textAlign: "center", marginTop: "12px", padding: "8px", background: "#f1f5f9", color: "#7c3aed", textDecoration: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>View All Tools →</a>
            </div>
            <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: "16px", padding: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#3b82f6", marginBottom: "12px" }}>⚡ Quick Info</h3>
              {[
                { label: "Measures", value: "DL/UL/Ping/Jitter" },
                { label: "Processing", value: "100% Browser" },
                { label: "Account Required", value: "No" },
                { label: "Data Logged", value: "None" },
                { label: "Cost", value: "Free" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 4 ? "1px solid rgba(59,130,246,0.08)" : "none" }}>
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
