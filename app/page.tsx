"use client";
import { useState, useEffect } from "react";
import { generateTOTP } from "./totp";

export default function Home() {
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setInterval(async () => {
      const seconds = 30 - (Math.floor(Date.now() / 1000) % 30);
      setTimeLeft(seconds);
      if (generated && secret) {
        try {
          setCode(await generateTOTP(secret));
        } catch {
          setError("Invalid secret key!");
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [generated, secret]);

  const handleGenerate = async () => {
    if (!secret) return;
    try {
      const newCode = await generateTOTP(secret);
      setCode(newCode);
      setGenerated(true);
      setError("");
    } catch {
      setError("Invalid secret key! Base32 format mein daalo.");
      setGenerated(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#111827",
      color: "#ffffff",
      fontFamily: "Inter, sans-serif",
      backgroundImage: "radial-gradient(circle, #1f2937 1px, transparent 1px)",
      backgroundSize: "30px 30px",
    }}>

      {/* Navbar */}
      <nav style={{
        padding: "14px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "transparent",
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/logo.png" alt="2fa.ac logo" style={{ height: "30px", width: "auto" }} />
        </div>
        <div style={{ display: "flex", gap: "30px" }}>
          <a href="/tools" style={{ color: "#a0a0b0", textDecoration: "none" }}>Tools</a>
          <a href="/blog" style={{ color: "#a0a0b0", textDecoration: "none" }}>Blog</a>
          <a href="/about" style={{ color: "#a0a0b0", textDecoration: "none" }}>About</a>
        </div>
      </nav>

      {/* Hero Text */}
      <section style={{
        textAlign: "center",
        padding: "30px 20px 16px",
        maxWidth: "800px",
        margin: "0 auto",
      }}>
        <div style={{
          display: "inline-block",
          background: "rgba(124,58,237,0.15)",
          border: "1px solid #7c3aed",
          borderRadius: "20px",
          padding: "6px 16px",
          fontSize: "13px",
          color: "#7c3aed",
          marginBottom: "16px",
        }}>
          300+ daily users trust 2fa.ac
        </div>
        <h1 style={{
          fontSize: "28px",
          fontWeight: "800",
          lineHeight: "1.2",
          marginBottom: "10px",
          background: "linear-gradient(135deg, #ffffff 0%, #7c3aed 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Free Security Tools for Everyone
        </h1>
        <p style={{ fontSize: "14px", color: "#a0a0b0", lineHeight: "1.6" }}>
          20+ free cybersecurity tools. Bilkul free, koi signup nahi.
        </p>
      </section>

      {/* 2FA Tool */}
      <section style={{ maxWidth: "1200px", margin: "20px auto 60px", padding: "0 20px" }}>
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(124,58,237,0.5)",
          borderRadius: "20px",
          padding: "80px 120px",
          textAlign: "center",
        }}>
          <div style={{
            width: "56px", height: "56px",
            background: "rgba(124,58,237,0.2)",
            borderRadius: "14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "28px",
          }}>🔐</div>

          <h2 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "8px", color: "#fff" }}>
            2FA Code Generator
          </h2>
          <p style={{ color: "#a0a0b0", fontSize: "15px", marginBottom: "32px" }}>
            Secret key daalo — OTP turant generate hoga
          </p>

          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value.toUpperCase().trim())}
            placeholder="Secret Key daalo (jaise: JBSWY3DPEHPK3PXP)"
            style={{
              width: "100%",
              padding: "16px 20px",
              background: "rgba(255,255,255,0.06)",
              border: error ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              color: "white",
              fontSize: "15px",
              marginBottom: "12px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />

          {error && (
            <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>
          )}

          <button
            onClick={handleGenerate}
            style={{
              width: "100%",
              padding: "16px",
              background: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "17px",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: generated ? "24px" : "0",
            }}>
            Generate Code
          </button>

          {generated && (
            <div style={{
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: "14px",
              padding: "30px",
            }}>
              <p style={{ fontSize: "12px", color: "#a0a0b0", marginBottom: "12px", letterSpacing: "2px" }}>
                YOUR 2FA CODE
              </p>
              <div style={{
                fontSize: "80px",
                fontWeight: "800",
                letterSpacing: "14px",
                color: "#7c3aed",
                fontFamily: "monospace",
                marginBottom: "20px",
              }}>
                {code.slice(0, 3)} {code.slice(3)}
              </div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  height: "6px",
                  overflow: "hidden",
                  maxWidth: "300px",
                  margin: "0 auto 8px",
                }}>
                  <div style={{
                    width: `${(timeLeft / 30) * 100}%`,
                    height: "100%",
                    background: timeLeft > 10 ? "#7c3aed" : "#ef4444",
                    borderRadius: "4px",
                    transition: "width 1s linear",
                  }} />
                </div>
                <span style={{ fontSize: "13px", color: "#a0a0b0" }}>
                  {timeLeft} seconds mein expire hoga
                </span>
              </div>
              <button
                onClick={handleCopy}
                style={{
                  padding: "12px 36px",
                  background: copied ? "#22c55e" : "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}>
                {copied ? "✓ Copied!" : "Copy Code"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Trust Metrics */}
      <section style={{
        display: "flex",
        justifyContent: "center",
        gap: "60px",
        padding: "40px 20px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        flexWrap: "wrap",
      }}>
        {[
          { num: "20+", label: "Security Tools" },
          { num: "300+", label: "Daily Users" },
          { num: "99.9%", label: "Uptime" },
          { num: "100%", label: "Free Forever" },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#7c3aed" }}>{item.num}</div>
            <div style={{ fontSize: "14px", color: "#a0a0b0", marginTop: "4px" }}>{item.label}</div>
          </div>
        ))}
      </section>

      {/* Tools Grid */}
      <section style={{ padding: "80px 40px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "36px", fontWeight: "700", marginBottom: "12px" }}>
          All Tools — 100% Free
        </h2>
        <p style={{ textAlign: "center", color: "#a0a0b0", marginBottom: "50px" }}>
          Koi account nahi, koi payment nahi — bas use karo
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "20px",
        }}>
          {[
            { icon: "🔐", name: "TOTP Generator", desc: "Google Authenticator jaise OTP banao", tag: "Auth", href: "/" },
            { icon: "🔑", name: "Password Generator", desc: "Strong secure password banao", tag: "Password", href: "/tools/password-generator" },
            { icon: "💪", name: "Password Strength", desc: "Password kitna strong hai check karo", tag: "Password", href: "/tools/password-strength" },
            { icon: "🔓", name: "Backup Code Generator", desc: "2FA backup codes generate karo", tag: "Auth", href: "/tools/backup-codes" },
            { icon: "📱", name: "QR Code Generator", desc: "Authenticator ke liye QR banao", tag: "Auth", href: "/tools/qr-generator" },
            { icon: "🔍", name: "JWT Decoder", desc: "JWT token decode karo", tag: "Developer", href: "/tools/jwt-decoder" },
            { icon: "#️⃣", name: "Hash Generator", desc: "MD5, SHA-256, SHA-512 hash banao", tag: "Developer", href: "/tools/hash-generator" },
            { icon: "🆔", name: "UUID Generator", desc: "Unique ID generate karo", tag: "Developer", href: "/tools/uuid-generator" },
            { icon: "📝", name: "Base64 Encoder", desc: "Text ko Base64 mein convert karo", tag: "Developer", href: "/tools/base64" },
            { icon: "🔗", name: "Link Checker", desc: "Scam links check karo", tag: "Security", href: "/tools/link-checker" },
            { icon: "🌐", name: "DNS Lookup", desc: "Domain DNS records dekho", tag: "Security", href: "/tools/dns-lookup" },
            { icon: "📍", name: "IP Lookup", desc: "IP address ki location dekho", tag: "Security", href: "/tools/ip-lookup" },
          ].map((tool) => (
            <a key={tool.name} href={tool.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "24px",
                cursor: "pointer",
                height: "100%",
              }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{tool.icon}</div>
                <div style={{
                  display: "inline-block",
                  background: "rgba(124,58,237,0.15)",
                  color: "#7c3aed",
                  fontSize: "11px",
                  padding: "2px 10px",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}>
                  {tool.tag}
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#fff" }}>{tool.name}</h3>
                <p style={{ fontSize: "13px", color: "#a0a0b0", lineHeight: "1.5", margin: 0 }}>{tool.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "40px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        color: "#a0a0b0",
        fontSize: "14px",
      }}>
        © 2025 2fa.ac — Free Cybersecurity Tools for Everyone
      </footer>
    </main>
  );
}