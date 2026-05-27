"use client";
import { useState, useEffect, useRef } from "react";
import { Navbar, Footer } from "../shared";
import AnimatedBackground from "../background";
import { HeaderAd, FooterAd, InArticleAd } from "../adsense";



const topics = [
  { value: "bug", label: "🐛 Bug Report" },
  { value: "feature", label: "💡 Feature Request" },
  { value: "privacy", label: "🔒 Privacy Question" },
  { value: "partnership", label: "🤝 Partnership" },
  { value: "other", label: "💬 Other" },
];

const contactInfo = [
  { icon: "📧", title: "Email", value: "hello@2fa.ac", link: "mailto:hello@2fa.ac" },
  { icon: "🌐", title: "Website", value: "2fa.ac", link: "https://2fa.ac" },
  { icon: "⏱️", title: "Response Time", value: "Within 7 business days", link: null },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("bug");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name || !email || !message) return;
    const subject = `[2FA.AC] ${topics.find(t => t.value === topic)?.label} - from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nTopic: ${topics.find(t => t.value === topic)?.label}\n\nMessage:\n${message}`;
    window.location.href = `mailto:hello@2fa.ac?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", color: "#1a1a2e", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <AnimatedBackground />
      <Navbar />
      <HeaderAd />

      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px 60px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-block", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "#7c3aed", marginBottom: "16px", fontWeight: "500" }}>
            📬 Get in Touch
          </div>
          <h1 style={{ fontSize: "clamp(26px, 6vw, 40px)", fontWeight: "800", marginBottom: "12px", background: "linear-gradient(135deg, #1e293b 0%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Contact Us
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", maxWidth: "500px", margin: "0 auto", lineHeight: "1.7" }}>
            Have a question, bug report, or feedback? We would love to hear from you.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", alignItems: "start" }}>

          {/* Left — Contact Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Contact cards */}
            {contactInfo.map((info, i) => (
              <div key={i} style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>{info.icon}</div>
                <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600", letterSpacing: "1px", marginBottom: "4px" }}>{info.title.toUpperCase()}</div>
                {info.link ? (
                  <a href={info.link} style={{ fontSize: "15px", fontWeight: "600", color: "#7c3aed", textDecoration: "none" }}>{info.value}</a>
                ) : (
                  <div style={{ fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>{info.value}</div>
                )}
              </div>
            ))}

            {/* Quick links */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600", letterSpacing: "1px", marginBottom: "12px" }}>QUICK LINKS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "About Us", href: "/about" },
                ].map(link => (
                  <a key={link.href} href={link.href} style={{ fontSize: "14px", color: "#64748b", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#7c3aed"}
                    onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
                  >
                    → {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "clamp(20px, 4vw, 36px)", boxShadow: "0 8px 40px rgba(124,58,237,0.08)" }}>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div>
                <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>Email Client Opened!</h3>
                <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.7", marginBottom: "24px" }}>
                  Your email client should have opened with your message pre-filled. If it did not, please email us directly at <strong style={{ color: "#7c3aed" }}>hello@2fa.ac</strong>
                </p>
                <button onClick={() => setSubmitted(false)} style={{ background: "rgba(124,58,237,0.1)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.3)", padding: "10px 24px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "24px" }}>Send us a message</h2>

                {/* Name */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>Your Name *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    style={{ width: "100%", padding: "12px 16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                    onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
                    onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
                  />
                </div>

                {/* Email */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>Email Address *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    style={{ width: "100%", padding: "12px 16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                    onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
                    onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
                  />
                </div>

                {/* Topic */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>Topic</label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {topics.map(t => (
                      <button key={t.value} onClick={() => setTopic(t.value)}
                        style={{ padding: "7px 14px", background: topic === t.value ? "rgba(124,58,237,0.1)" : "#f8fafc", border: topic === t.value ? "1.5px solid #7c3aed" : "1.5px solid #e2e8f0", borderRadius: "8px", color: topic === t.value ? "#7c3aed" : "#64748b", cursor: "pointer", fontSize: "12px", fontWeight: topic === t.value ? "600" : "400" }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>Message *</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your question, bug, or feedback in detail..."
                    rows={5}
                    style={{ width: "100%", padding: "12px 16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "14px", boxSizing: "border-box", outline: "none", resize: "vertical", fontFamily: "Inter, sans-serif" }}
                    onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
                    onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
                  />
                </div>

                <button onClick={handleSubmit} disabled={!name || !email || !message}
                  style={{ width: "100%", padding: "14px", background: (!name || !email || !message) ? "#e2e8f0" : "linear-gradient(135deg, #7c3aed, #9f67ff)", color: (!name || !email || !message) ? "#94a3b8" : "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: (!name || !email || !message) ? "not-allowed" : "pointer", boxShadow: (!name || !email || !message) ? "none" : "0 4px 20px rgba(124,58,237,0.35)", transition: "all 0.2s" }}>
                  Send Message →
                </button>

                <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center", marginTop: "12px" }}>
                  This will open your email client with the message pre-filled.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <FooterAd />
      <Footer />
    </main>
  );
}