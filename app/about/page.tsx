"use client";
import { Navbar, Footer } from "../shared";
import AnimatedBackground from "../background";
import { HeaderAd, FooterAd } from "../adsense";
import { TOOLS, TOOL_COUNT } from "../lib/tools-list";



const stats = [
  { num: `${TOOL_COUNT}+`, label: "Free Security Tools" },
  { num: "300+", label: "Daily Users" },
  { num: "100%", label: "Browser-Based" },
  { num: "0", label: "Data Collected" },
];

const values = [
  { icon: "🔒", title: "Privacy First", desc: "Every tool runs entirely in your browser. No data is ever sent to our servers. What you do stays with you." },
  { icon: "🆓", title: "Always Free", desc: "All tools are completely free with no hidden fees, no subscriptions, and no signup required. Ever." },
  { icon: "⚡", title: "Fast & Simple", desc: "We believe security tools should be simple to use. No complex setup, no learning curve — just open and use." },
  { icon: "🌐", title: "Open & Transparent", desc: "We are transparent about how our tools work. No black boxes, no tracking, no ads influencing our tools." },
];

// Tools from central list
const tools = TOOLS.map(t => ({ icon: t.icon, name: t.name, desc: t.desc }));

export default function AboutPage() {
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", color: "#1a1a2e", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <AnimatedBackground />
      <Navbar />
      <HeaderAd />

      {/* Hero */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 16px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-block", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "#7c3aed", marginBottom: "20px", fontWeight: "500" }}>
          About 2FA.AC
        </div>
        <h1 style={{ fontSize: "clamp(26px, 6vw, 42px)", fontWeight: "800", lineHeight: "1.2", marginBottom: "16px", background: "linear-gradient(135deg, #1e293b 0%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Free Security Tools for Everyone
        </h1>
        <p style={{ fontSize: "16px", color: "#64748b", lineHeight: "1.8", maxWidth: "600px", margin: "0 auto" }}>
          2FA.AC is a free, browser-based security toolkit built to help individuals and developers protect their digital lives — no signup, no tracking, no cost.
        </p>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: "900px", margin: "0 auto 60px", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "16px", padding: "28px 20px", textAlign: "center", boxShadow: "0 4px 20px rgba(124,58,237,0.06)" }}>
              <div style={{ fontSize: "32px", fontWeight: "800", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.num}</div>
              <div style={{ fontSize: "13px", color: "#64748b", marginTop: "6px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ maxWidth: "900px", margin: "0 auto 60px", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "clamp(20px, 5vw, 48px)", boxShadow: "0 8px 40px rgba(124,58,237,0.08)" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>Our Mission</h2>
          <p style={{ fontSize: "15px", color: "#64748b", lineHeight: "1.8", marginBottom: "16px" }}>
            Cybersecurity tools are often expensive, complicated, or require creating accounts. We believe that is wrong. Basic security tools should be free, easy to use, and accessible to everyone — from developers to everyday users.
          </p>
          <p style={{ fontSize: "15px", color: "#64748b", lineHeight: "1.8" }}>
            2FA.AC was built with one simple idea: <strong style={{ color: "#7c3aed" }}>security should not be a privilege.</strong> Every tool on this platform is free, runs entirely in your browser, and collects absolutely no data.
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ maxWidth: "900px", margin: "0 auto 60px", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "24px", textAlign: "center" }}>Our Values</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {values.map(v => (
            <div key={v.title} style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "16px", padding: "28px", boxShadow: "0 4px 20px rgba(124,58,237,0.06)" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>{v.icon}</div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>{v.title}</h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7", margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools List */}
      <section style={{ maxWidth: "900px", margin: "0 auto 60px", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "8px", textAlign: "center" }}>All Our Tools</h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "28px", fontSize: "14px" }}>{`${TOOL_COUNT} free tools — no account required`}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
          {tools.map(t => (
            <div key={t.name} style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "12px", padding: "18px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ fontSize: "24px", flexShrink: 0 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "4px" }}>{t.name}</div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section style={{ maxWidth: "700px", margin: "0 auto 80px", padding: "0 20px", position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(159,103,255,0.08))", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "20px", padding: "clamp(20px, 5vw, 48px)" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>Have Questions or Feedback?</h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px", lineHeight: "1.7" }}>
            We would love to hear from you. Whether it is a bug report, feature request, or just a hello — reach out anytime.
          </p>
          <a href="mailto:hello@2fa.ac" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "14px 32px", borderRadius: "12px", fontSize: "15px", fontWeight: "600", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
            Contact Us →
          </a>
        </div>
      </section>

      <FooterAd />
      <Footer />
    </main>
  );
}