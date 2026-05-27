"use client";
import { useEffect, useRef } from "react";
import { Navbar, Footer } from "../shared";
import AnimatedBackground from "../background";
import { HeaderAd, FooterAd } from "../adsense";



const sections = [
  {
    icon: "✅",
    title: "1. Acceptance of Terms",
    content: `By accessing or using 2FA.AC (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.

These terms apply to all visitors, users, and others who access or use the Service. We reserve the right to update these terms at any time, and your continued use of the Service constitutes acceptance of the updated terms.`
  },
  {
    icon: "🛠️",
    title: "2. Description of Service",
    content: `2FA.AC provides free, browser-based cybersecurity tools including but not limited to:

• **TOTP/2FA Code Generator** — Generate one-time passwords compatible with Google Authenticator and Authy.
• **QR Code Generator** — Create QR codes for 2FA setup and other uses.
• **Password Tools** — Generate, check strength, and verify breach status of passwords.
• **Developer Tools** — JWT decoder, hash generator, UUID generator, Base64 encoder, JSON formatter.
• **Network Tools** — DNS lookup, IP lookup, WHOIS lookup, link checker.

All tools are provided free of charge and operate entirely within your browser.`
  },
  {
    icon: "📌",
    title: "3. Acceptable Use",
    content: `You agree to use 2FA.AC only for lawful purposes. You must not use the Service to:

• Violate any applicable local, national, or international laws or regulations.
• Engage in any fraudulent, deceptive, or harmful activities.
• Attempt to gain unauthorized access to any systems or networks.
• Use the tools to facilitate hacking, phishing, or any malicious activity.
• Reverse engineer, decompile, or attempt to extract source code from the Service.
• Distribute malware, viruses, or any other harmful code.
• Scrape, crawl, or use automated means to access the Service in a way that places unreasonable load on our servers.

We reserve the right to terminate access for any user who violates these terms.`
  },
  {
    icon: "🆓",
    title: "4. Free Service & No Warranties",
    content: `2FA.AC is provided free of charge on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding:

• The accuracy, reliability, or completeness of any tool or result.
• The uninterrupted or error-free operation of the Service.
• The fitness of the Service for any particular purpose.

**Use all tools at your own risk.** While we strive to provide accurate and reliable tools, results should be verified independently for critical security decisions.`
  },
  {
    icon: "🔒",
    title: "5. Privacy & Data",
    content: `Your privacy is important to us. Key points:

• All cryptographic operations (2FA generation, password hashing, JWT decoding) occur entirely in your browser.
• We do not store your passwords, secret keys, or sensitive inputs on our servers.
• Some tools interact with third-party APIs (HaveIBeenPwned, Google DNS, ipapi.co). Your use of these tools is also subject to those services' terms.
• Please review our **Privacy Policy** at 2fa.ac/privacy for complete details on data handling.`
  },
  {
    icon: "⚠️",
    title: "6. Limitation of Liability",
    content: `To the maximum extent permitted by applicable law, 2FA.AC and its operators shall not be liable for:

• Any direct, indirect, incidental, special, or consequential damages arising from your use of the Service.
• Loss of data, profits, or business opportunities resulting from use of our tools.
• Any security breach or unauthorized access to your accounts or systems.
• Errors or inaccuracies in tool results, including but not limited to password strength assessments, breach checks, or DNS lookups.

Your sole remedy for dissatisfaction with the Service is to stop using it.`
  },
  {
    icon: "🧠",
    title: "7. Intellectual Property",
    content: `All content, design, logos, and code on 2FA.AC are the property of 2FA.AC or its licensors and are protected by applicable intellectual property laws.

You may not:
• Copy, reproduce, or distribute our content without prior written permission.
• Use our logo or branding in any way that implies endorsement or affiliation.
• Create derivative works based on our Service without permission.

You retain ownership of any data you input into our tools.`
  },
  {
    icon: "🔗",
    title: "8. Third-Party Links & Services",
    content: `Our Service may contain links to third-party websites or services that are not owned or controlled by 2FA.AC.

We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services. We strongly advise you to read the Terms and Privacy Policy of any third-party site you visit.

Third-party APIs used by our tools (HaveIBeenPwned, Google DNS, ipapi.co, RDAP.org, QR Server) operate under their own terms of service.`
  },
  {
    icon: "🔄",
    title: "9. Changes to Terms",
    content: `We reserve the right to modify or replace these Terms at any time. When we make significant changes:

• The "Last Updated" date at the top of this page will be revised.
• We may provide notice through the Service or via email if you have provided contact information.

Your continued use of the Service after any changes indicates your acceptance of the new Terms. If you do not agree to the revised terms, you must stop using the Service.`
  },
  {
    icon: "⚖️",
    title: "10. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.

Any disputes arising from these Terms or your use of the Service shall be resolved through good-faith negotiation. If negotiation fails, disputes shall be subject to binding arbitration or the jurisdiction of competent courts.`
  },
  {
    icon: "📧",
    title: "11. Contact Us",
    content: `If you have any questions about these Terms of Service, please contact us:

• **Email**: hello@2fa.ac
• **Website**: 2fa.ac

We will respond to your inquiry within 7 business days.`
  },
];

export default function TermsOfService() {
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", color: "#1a1a2e", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <AnimatedBackground />
      <Navbar />
      <HeaderAd />

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 20px 80px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-block", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "#7c3aed", marginBottom: "16px", fontWeight: "500" }}>
            ⚖️ Legal
          </div>
          <h1 style={{ fontSize: "40px", fontWeight: "800", marginBottom: "12px", background: "linear-gradient(135deg, #1e293b 0%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Terms of Service
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "8px" }}>
            Last updated: May 2025
          </p>
          <p style={{ color: "#64748b", fontSize: "15px", maxWidth: "600px", margin: "0 auto", lineHeight: "1.7" }}>
            Please read these Terms of Service carefully before using 2FA.AC. By using our Service, you agree to these terms.
          </p>
        </div>

        {/* Quick Summary */}
        <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "16px", padding: "20px 24px", marginBottom: "40px" }}>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "#2563eb", marginBottom: "12px" }}>📌 Quick Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              { icon: "✅", text: "Free to use, no account required" },
              { icon: "🔒", text: "All tools run in your browser" },
              { icon: "🚫", text: "No illegal or malicious use" },
              { icon: "⚠️", text: "Service provided as-is, no warranties" },
              { icon: "🆓", text: "No data sold to third parties" },
              { icon: "📧", text: "Contact us with any questions" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b" }}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
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

        {/* Bottom CTA */}
        <div style={{ marginTop: "40px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>Questions about our Terms?</h3>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>We are happy to clarify anything. Reach out anytime.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:hello@2fa.ac" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", textDecoration: "none", padding: "12px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}>
              Contact Us →
            </a>
            <a href="/privacy" style={{ display: "inline-block", background: "#f1f5f9", color: "#64748b", textDecoration: "none", padding: "12px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", border: "1.5px solid #e2e8f0" }}>
              Privacy Policy
            </a>
          </div>
        </div>
      </section>

      <FooterAd />
      <Footer />
    </main>
  );
}