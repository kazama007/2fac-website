"use client";
import { useState, useEffect } from "react";
import { generateTOTP } from "./totp";
import AnimatedBackground from "./background";

interface SavedKey {
  name: string;
  secret: string;
  addedAt: string;
  addedTime: string;
}

export default function Home() {
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [savedKeys, setSavedKeys] = useState<SavedKey[]>([]);

  useEffect(() => {
    const keys = localStorage.getItem("2fa-saved-keys");
    if (keys) setSavedKeys(JSON.parse(keys));
  }, []);

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
      const now = new Date();
      const alreadyExists = savedKeys.find(k => k.secret === secret);
      if (!alreadyExists) {
        const newKey: SavedKey = {
          name: "Account " + (savedKeys.length + 1),
          secret: secret,
          addedAt: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
          addedTime: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        };
        const updated = [...savedKeys, newKey];
        setSavedKeys(updated);
        localStorage.setItem("2fa-saved-keys", JSON.stringify(updated));
      }
    } catch {
      setError("Invalid secret key! Please enter a valid Base32 key.");
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
      background: "#080c18",
      color: "#ffffff",
      fontFamily: "Inter, sans-serif",
      position: "relative",
    }}>
      <AnimatedBackground />

      <nav style={{
        padding: "22px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(8,12,24,0.85)",
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/logo.png" alt="2fa.ac logo" style={{ height: "30px", width: "auto" }} />
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <a href="/tools" style={{ color: "#a0a0b0", textDecoration: "none" }}>Tools</a>
          <a href="/blog" style={{ color: "#a0a0b0", textDecoration: "none" }}>Blog</a>
          <a href="/about" style={{ color: "#a0a0b0", textDecoration: "none" }}>About</a>
        </div>
      </nav>

      <section style={{ maxWidth: "1200px", margin: "30px auto 20px", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
          <a href="/saved-keys" style={{
            background: "rgba(124,58,237,0.2)",
            border: "1px solid #7c3aed",
            color: "#7c3aed",
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}>
            🔑 2FA History
          </a>
        </div>

        <div style={{
          background: "rgba(8,12,24,0.7)",
          border: "1px solid rgba(124,58,237,0.5)",
          borderRadius: "20px",
          padding: "20px 60px",
          textAlign: "center",
          backdropFilter: "blur(20px)",
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
          <p style={{ color: "#a0a0b0", fontSize: "15px", marginBottom: "24px" }}>
            Enter your secret key to instantly generate a 2FA code
          </p>

          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value.toUpperCase().trim())}
            placeholder="Enter Secret Key (e.g. JBSWY3DPEHPK3PXP)"
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
              padding: "16px",
            }}>
              <p style={{ fontSize: "12px", color: "#a0a0b0", marginBottom: "8px", letterSpacing: "2px" }}>
                YOUR 2FA CODE
              </p>
              <div style={{
                fontSize: "60px",
                fontWeight: "800",
                letterSpacing: "14px",
                color: "#7c3aed",
                fontFamily: "monospace",
                marginBottom: "12px",
              }}>
                {code.slice(0, 3)} {code.slice(3)}
              </div>
              <div style={{ marginBottom: "12px" }}>
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
                  Expires in {timeLeft} seconds
                </span>
              </div>
              <button
                onClick={handleCopy}
                style={{
                  padding: "10px 30px",
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

      <section style={{
        textAlign: "center",
        padding: "30px 20px",
        maxWidth: "800px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
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
          Trusted by 300+ daily users
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
          20+ free cybersecurity tools. Completely free, no signup required.
        </p>
      </section>

      <section style={{
        display: "flex",
        justifyContent: "center",
        gap: "60px",
        padding: "40px 20px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        flexWrap: "wrap",
        position: "relative",
        zIndex: 1,
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

      <section style={{ padding: "60px 40px", maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h2 style={{ textAlign: "center", fontSize: "36px", fontWeight: "700", marginBottom: "12px" }}>
          All Tools — 100% Free
        </h2>
        <p style={{ textAlign: "center", color: "#a0a0b0", marginBottom: "50px" }}>
          No account required, no payment — just use it
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}>
          {[
            { icon: "🔐", name: "TOTP Generator", desc: "Generate OTP codes like Google Authenticator", tag: "Auth", href: "/" },
            { icon: "🔑", name: "Password Generator", desc: "Generate strong secure passwords", tag: "Password", href: "/tools/password-generator" },
            { icon: "💪", name: "Password Strength", desc: "Check how strong your password is", tag: "Password", href: "/tools/password-strength" },
            { icon: "🔓", name: "Backup Code Generator", desc: "Generate 2FA backup codes", tag: "Auth", href: "/tools/backup-codes" },
            { icon: "📱", name: "QR Code Generator", desc: "Generate QR codes for authenticator apps", tag: "Auth", href: "/tools/qr-generator" },
            { icon: "🔍", name: "JWT Decoder", desc: "Decode and verify JWT tokens", tag: "Developer", href: "/tools/jwt-decoder" },
            { icon: "#️⃣", name: "Hash Generator", desc: "Generate MD5, SHA-256, SHA-512 hashes", tag: "Developer", href: "/tools/hash-generator" },
            { icon: "🆔", name: "UUID Generator", desc: "Generate unique IDs instantly", tag: "Developer", href: "/tools/uuid-generator" },
            { icon: "📝", name: "Base64 Encoder", desc: "Encode and decode Base64 text", tag: "Developer", href: "/tools/base64" },
            { icon: "🔗", name: "Link Checker", desc: "Check links for scams and phishing", tag: "Security", href: "/tools/link-checker" },
            { icon: "🌐", name: "DNS Lookup", desc: "Check domain DNS records", tag: "Security", href: "/tools/dns-lookup" },
            { icon: "📍", name: "IP Lookup", desc: "Find location of any IP address", tag: "Security", href: "/tools/ip-lookup" },
          ].map((tool) => (
            <a key={tool.name} href={tool.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "rgba(8,12,24,0.6)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "24px",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
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

      <footer style={{
        textAlign: "center",
        padding: "40px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        color: "#a0a0b0",
        fontSize: "14px",
        position: "relative",
        zIndex: 1,
      }}>
        © 2025 2fa.ac — Free Cybersecurity Tools for Everyone
      </footer>
    </main>
  );
}