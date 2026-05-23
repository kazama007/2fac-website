"use client";
import { useState, useEffect } from "react";

interface SavedKey {
  name: string;
  secret: string;
  addedAt: string;
  addedTime: string;
}

export default function SavedKeys() {
  const [savedKeys, setSavedKeys] = useState<SavedKey[]>([]);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const keys = localStorage.getItem("2fa-saved-keys");
    if (keys) setSavedKeys(JSON.parse(keys));
  }, []);

  const handleDelete = (index: number) => {
    const updated = savedKeys.filter((_, i) => i !== index);
    setSavedKeys(updated);
    localStorage.setItem("2fa-saved-keys", JSON.stringify(updated));
  };

  const handleCopy = (secret: string, name: string) => {
    navigator.clipboard.writeText(secret);
    setCopied(name);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all saved keys?")) {
      setSavedKeys([]);
      localStorage.removeItem("2fa-saved-keys");
    }
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
        padding: "22px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(17,24,39,0.9)",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo.png" alt="2fa.ac" style={{ height: "30px" }} />
        </a>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <a href="/" style={{ color: "#a0a0b0", textDecoration: "none" }}>Generator</a>
          <a href="/tools" style={{ color: "#a0a0b0", textDecoration: "none" }}>Tools</a>
          <a href="/saved-keys" style={{
            background: "rgba(124,58,237,0.2)",
            border: "1px solid #7c3aed",
            color: "#7c3aed",
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
          }}>
            🔑 2FA History
          </a>
        </div>
      </nav>

      <section style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: "20px",
            padding: "4px 12px",
            fontSize: "12px",
            color: "#22c55e",
            marginBottom: "16px",
          }}>
            <span style={{ width: "6px", height: "6px", background: "#22c55e", borderRadius: "50%", display: "inline-block" }}></span>
            LOCAL ONLY • THIS BROWSER & DEVICE
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>
            Saved 2FA Secret Key History
          </h1>
          <p style={{ color: "#a0a0b0", fontSize: "14px", lineHeight: "1.6", maxWidth: "600px" }}>
            All your TOTP secrets are stored locally in this browser. If you ever forget a key, you can recover it from here — unless you clear site data.
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
            {["💾 Stored in localStorage", "🚫 No server, no sync", "⚠️ Clearing cache wipes history"].map(tag => (
              <span key={tag} style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "4px 12px",
                fontSize: "12px",
                color: "#a0a0b0",
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          overflow: "hidden",
        }}>
          {/* Card Header */}
          <div style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
                2FA accounts on this browser
              </h2>
              <p style={{ fontSize: "13px", color: "#a0a0b0", margin: "4px 0 0" }}>
                {savedKeys.length} account(s) saved
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <span style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.3)",
                color: "#22c55e",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "13px",
              }}>
                🔒 Local-only, per-browser
              </span>
              <a href="/" style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                padding: "6px 14px",
                fontSize: "13px",
              }}>
                ← Back to Generator
              </a>
              {savedKeys.length > 0 && (
                <button
                  onClick={handleClearAll}
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#ef4444",
                    borderRadius: "8px",
                    padding: "6px 14px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}>
                  🗑 Clear all history
                </button>
              )}
            </div>
          </div>

          {/* Warning */}
          <div style={{
            margin: "16px 24px",
            background: "rgba(234,179,8,0.08)",
            border: "1px solid rgba(234,179,8,0.2)",
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "13px",
            color: "#fbbf24",
            lineHeight: "1.6",
          }}>
            <strong>Important:</strong> These secrets are stored only in this browser's localStorage. If you clear cookies/site data, use incognito mode, or switch devices, this history will not be available. Always store your keys in a secure password manager as well.
          </div>

          {/* Table */}
          {savedKeys.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔐</div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                No saved keys found
              </h3>
              <p style={{ color: "#a0a0b0", marginBottom: "20px", fontSize: "14px" }}>
                Go to the homepage, enter a secret key, generate a code — it will be saved automatically.
              </p>
              <a href="/" style={{
                background: "#7c3aed",
                color: "white",
                padding: "12px 24px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
              }}>
                ← Go to Generator
              </a>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {["#", "ACCOUNT", "SECRET KEY", "DATE & TIME", "ACTIONS"].map(h => (
                      <th key={h} style={{
                        padding: "12px 24px",
                        textAlign: "left",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#6b7280",
                        letterSpacing: "1px",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {savedKeys.map((key, index) => (
                    <tr key={index} style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}>
                      <td style={{ padding: "16px 24px", color: "#6b7280", fontSize: "14px" }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>{key.name}</div>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <code style={{
                          background: "rgba(255,255,255,0.06)",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          color: "#7c3aed",
                          fontFamily: "monospace",
                        }}>
                          {key.secret}
                        </code>
                      </td>
                      <td style={{ padding: "16px 24px", fontSize: "13px", color: "#a0a0b0" }}>
                        {key.addedAt}<br />
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>{key.addedTime}</span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleCopy(key.secret, key.name)}
                            style={{
                              background: copied === key.name ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: copied === key.name ? "#22c55e" : "white",
                              borderRadius: "6px",
                              padding: "6px 14px",
                              fontSize: "13px",
                              cursor: "pointer",
                            }}>
                            {copied === key.name ? "✓ Copied" : "Copy"}
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            style={{
                              background: "rgba(239,68,68,0.1)",
                              border: "1px solid rgba(239,68,68,0.2)",
                              color: "#ef4444",
                              borderRadius: "6px",
                              padding: "6px 14px",
                              fontSize: "13px",
                              cursor: "pointer",
                            }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "30px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        color: "#6b7280",
        fontSize: "13px",
        marginTop: "40px",
      }}>
        © 2025 2fa.ac — History is stored locally in your browser. We never see your secrets.
      </footer>
    </main>
  );
}