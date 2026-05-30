"use client";
import { Navbar, Footer } from "../shared";
import AnimatedBackground from "../background";
import { HeaderAd, FooterAd } from "../adsense";

const sections = [
  {
    icon: "📋",
    title: "1. Information We Collect",
    content: `2FA.AC is designed with privacy at its core. We collect minimal information to operate the website:

• **No Account Data**: We do not require you to create an account or provide personal information to use any tool.
• **No Passwords or Keys**: All 2FA secret keys, passwords, and sensitive inputs are processed entirely in your browser. They are never transmitted to our servers.
• **Basic Analytics**: We may collect anonymous usage data such as page views and browser type to improve our service. This data does not identify you personally.
• **LocalStorage**: Some tools (like 2FA History) store data locally in your browser using localStorage. This data never leaves your device.`
  },
  {
    icon: "🔒",
    title: "2. How We Use Your Information",
    content: `The limited information we collect is used solely to:

• Operate and maintain the website
• Analyze aggregate usage patterns to improve our tools
• Detect and prevent technical issues or abuse
• Ensure the security and stability of the service

We do not sell, trade, or rent your information to third parties under any circumstances.`
  },
  {
    icon: "🌐",
    title: "3. Browser-Based Processing",
    content: `All cryptographic operations on 2FA.AC run entirely in your browser:

• **TOTP Code Generation**: Uses the Web Crypto API locally — your secret key never leaves your device.
• **Password Breach Check**: Uses k-anonymity — only a partial SHA-1 hash prefix is sent to HaveIBeenPwned API. Your actual password is never transmitted.
• **Hash Generation**: MD5, SHA-256, SHA-512 are all computed locally in your browser.
• **JWT Decoding**: JWT tokens are decoded client-side — nothing is sent to our servers.
• **Base64 Encoding**: Processed entirely in your browser using native JavaScript.`
  },
  {
    icon: "🍪",
    title: "4. Cookies",
    content: `2FA.AC uses minimal cookies:

• **No Tracking Cookies**: We do not use advertising or behavioral tracking cookies.
• **Session Data**: We may use essential session cookies required for website functionality.
• **Third-Party APIs**: Some tools use third-party APIs (Google DNS, HaveIBeenPwned, ipapi.co) which may have their own privacy policies. We recommend reviewing their policies.

You can disable cookies in your browser settings, though this may affect some functionality.`
  },
  {
    icon: "🔗",
    title: "5. Third-Party Services",
    content: `Some tools on 2FA.AC make requests to third-party APIs to provide their functionality:

• **Google DNS API** (dns.google): Used by the DNS Lookup tool to query DNS records.
• **HaveIBeenPwned** (api.pwnedpasswords.com): Used by the Password Breach Checker with k-anonymity protection.
• **ipapi.co**: Used by the IP Lookup tool to retrieve geolocation data for IP addresses.
• **RDAP.org**: Used by the WHOIS Lookup tool to retrieve domain registration information.
• **QR Server** (api.qrserver.com): Used by the QR Code Generator to create QR code images.

Each of these services has its own privacy policy. We encourage you to review them.`
  },
  {
    icon: "🛡️",
    title: "6. Data Security",
    content: `We take the security of our platform seriously:

• All pages are served over HTTPS to encrypt data in transit.
• We do not store any user-generated data on our servers.
• Sensitive operations (password checking, 2FA generation) are handled client-side only.
• We regularly review our tools and practices to maintain security standards.

Despite our best efforts, no internet transmission is 100% secure. We cannot guarantee absolute security of data transmitted to third-party APIs.`
  },
  {
    icon: "👶",
    title: "7. Children's Privacy",
    content: `2FA.AC is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided personal information to us, please contact us and we will take steps to remove that information.`
  },
  {
    icon: "✏️",
    title: "8. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we do:

• The "Last Updated" date at the top of this page will be revised.
• For significant changes, we may provide a more prominent notice.
• Your continued use of 2FA.AC after changes constitutes acceptance of the updated policy.

We encourage you to review this page periodically for any changes.`
  },
  {
    icon: "📧",
    title: "9. Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

• **Email**: hello@2fa.ac
• **Website**: 2fa.ac

We will respond to your inquiry within 7 business days.`
  },
];

export default function PrivacyPolicy() {
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", color: "#1a1a2e", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <AnimatedBackground />
      <Navbar />
      <HeaderAd />

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 20px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-block", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "#7c3aed", marginBottom: "16px", fontWeight: "500" }}>🔒 Legal</div>
          <h1 style={{ fontSize: "40px", fontWeight: "800", marginBottom: "12px", background: "linear-gradient(135deg, #1e293b 0%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Privacy Policy</h1>
          <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "8px" }}>Last updated: May 2025</p>
          <p style={{ color: "#64748b", fontSize: "15px", maxWidth: "600px", margin: "0 auto", lineHeight: "1.7" }}>At 2FA.AC, your privacy is our priority. This policy explains what data we collect, how we use it, and how we protect it.</p>
        </div>

        <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "16px", padding: "20px 24px", marginBottom: "40px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <span style={{ fontSize: "28px", flexShrink: 0 }}>✅</span>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#16a34a", marginBottom: "6px" }}>Our Privacy Commitment</div>
            <div style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.7" }}>All tools on 2FA.AC process data locally in your browser. We do not collect passwords, secret keys, or any sensitive inputs. No account required. No data sold. Ever.</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {sections.map((section, i) => (
            <div key={i} style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span style={{ fontSize: "24px" }}>{section.icon}</span>
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 }}>{section.title}</h2>
              </div>
              <div style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.8" }}>
                {section.content.split("\n").map((line, j) => {
                  if (line.trim() === "") return <br key={j} />;
                  const parts = line.split(/\*\*(.*?)\*\*/g);
                  return (
                    <p key={j} style={{ margin: "4px 0" }}>
                      {parts.map((part, k) =>
                        k % 2 === 1
                          ? <strong key={k} style={{ color: "#1e293b", fontWeight: "600" }}>{part}</strong>
                          : part
                      )}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "40px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>Questions about your privacy?</h3>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>We are happy to clarify anything in this policy.</p>
          <a href="mailto:hello@2fa.ac" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "12px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "600" }}>Contact Us →</a>
        </div>
      </section>

      <FooterAd />
      <Footer />
    </main>
  );
}