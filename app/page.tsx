import type { Metadata } from "next";
import HomeClient from "./HomeClient";

// ─── SEO METADATA (server-side, crawlable) ──────────────────────────────────
export const metadata: Metadata = {
  title: "Free 2FA Code Generator Online — Instant TOTP Codes | 2FA.ac",
  description:
    "Free 2FA tool to generate TOTP codes online instantly from your secret key. Works like Google Authenticator — 100% in your browser, no signup, no data stored.",
  keywords:
    "2FA code generator, 2FA tool, 2FA tools online, 2FA generator online, TOTP generator, free 2FA code generator, two factor authentication tool, online authenticator, TOTP code online",
  alternates: {
    canonical: "https://2fa.ac",
  },
  openGraph: {
    title: "Free 2FA Code Generator Online — Instant TOTP Codes | 2FA.ac",
    description:
      "Generate 2FA codes instantly from your secret key. Works like Google Authenticator, right in your browser. Free forever, no signup.",
    url: "https://2fa.ac",
    siteName: "2FA.ac",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free 2FA Code Generator Online | 2FA.ac",
    description:
      "Generate 2FA codes instantly from your secret key — 100% in your browser, no signup required.",
  },
};

// ─── FAQ DATA (shared between visible HTML & FAQPage schema) ────────────────
const faqs = [
  {
    q: "What is a 2FA code generator?",
    a: "A 2FA code generator creates 6-digit time-based one-time passwords (TOTP) from a secret key. These codes refresh every 30 seconds and are used as a second layer of security when logging into websites and apps — the same codes apps like Google Authenticator produce.",
  },
  {
    q: "Is it safe to enter my secret key on 2FA.ac?",
    a: "Yes. The entire TOTP calculation runs locally in your browser using the Web Crypto API. Your secret key is never sent to our servers, never logged, and never stored — unless you choose to save it, in which case it stays only in your own browser's local storage.",
  },
  {
    q: "Can I use this instead of Google Authenticator?",
    a: "Yes. 2FA.ac uses the same open TOTP standard (RFC 6238) as Google Authenticator, Authy, and Microsoft Authenticator. Enter the same secret key and you will get the same codes. It is handy as a backup when you do not have your phone nearby.",
  },
  {
    q: "Where do I find my 2FA secret key?",
    a: "When a website asks you to set up two-factor authentication, it shows a QR code along with a link like 'can't scan the code?' or 'enter key manually'. Clicking that reveals a Base32 secret key (e.g. JBSWY3DPEHPK3PXP). Paste that key here to generate your codes.",
  },
  {
    q: "Why does my 2FA code change every 30 seconds?",
    a: "TOTP codes are calculated from your secret key combined with the current time, in 30-second windows. This means a stolen code becomes useless within seconds, which is exactly what makes time-based 2FA so much safer than passwords alone.",
  },
  {
    q: "Is 2FA.ac really free?",
    a: "Yes — every tool on 2FA.ac is completely free with no account, no signup, and no hidden limits. The site is supported by non-intrusive ads.",
  },
];

// ─── JSON-LD STRUCTURED DATA ────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://2fa.ac/#webapp",
      name: "2FA Code Generator",
      url: "https://2fa.ac",
      description:
        "Free online 2FA code generator. Generate TOTP authentication codes from your secret key instantly — runs 100% in your browser.",
      applicationCategory: "SecurityApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": "https://2fa.ac/#org" },
    },
    {
      "@type": "Organization",
      "@id": "https://2fa.ac/#org",
      name: "2FA.ac",
      url: "https://2fa.ac",
      logo: "https://2fa.ac/logo2.png",
    },
    {
      "@type": "WebSite",
      "@id": "https://2fa.ac/#website",
      name: "2FA.ac",
      url: "https://2fa.ac",
      publisher: { "@id": "https://2fa.ac/#org" },
    },
    {
      "@type": "HowTo",
      name: "How to generate a 2FA code online",
      description:
        "Generate a TOTP two-factor authentication code from your secret key in three steps.",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Find your secret key",
          text: "During 2FA setup on any website, choose 'enter key manually' instead of scanning the QR code, and copy the Base32 secret key.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Paste the key",
          text: "Paste the secret key into the generator on 2FA.ac.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Copy your code",
          text: "Click Generate Code and copy the 6-digit code before it refreshes in 30 seconds.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

// ─── SERVER-RENDERED SEO CONTENT (crawlable by Google) ──────────────────────
function SeoContent() {
  const card: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid rgba(124,58,237,0.12)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  };
  const h2: React.CSSProperties = {
    fontSize: "clamp(22px, 4vw, 30px)",
    fontWeight: 800,
    color: "#1e293b",
    marginBottom: "16px",
    textAlign: "center",
  };
  const p: React.CSSProperties = {
    fontSize: "15px",
    color: "#475569",
    lineHeight: 1.8,
    marginBottom: "14px",
  };

  return (
    <>
      {/* How it works */}
      <section
        aria-labelledby="how-it-works"
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 20px", position: "relative", zIndex: 1 }}
      >
        <h2 id="how-it-works" style={h2}>
          How to Generate a 2FA Code Online
        </h2>
        <p style={{ ...p, textAlign: "center", maxWidth: "640px", margin: "0 auto 32px" }}>
          Three steps, under ten seconds — no app install, no account.
        </p>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {[
            { step: "1", title: "Find your secret key", desc: "During 2FA setup on any site, click \u201ccan\u2019t scan QR code?\u201d / \u201center key manually\u201d and copy the Base32 key (e.g. JBSWY3DPEHPK3PXP)." },
            { step: "2", title: "Paste it above", desc: "Paste the secret key into the generator at the top of this page. Everything is computed locally in your browser." },
            { step: "3", title: "Copy your 6-digit code", desc: "Click Generate Code, copy the code, and paste it into the website asking for it. A fresh code appears every 30 seconds." },
          ].map((item) => (
            <div key={item.step} style={card}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "16px", marginBottom: "12px" }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "8px" }}>{item.title}</h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What is a 2FA code generator — content for ranking */}
      <section
        aria-labelledby="what-is-2fa"
        style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}
      >
        <h2 id="what-is-2fa" style={h2}>
          What Is a 2FA Code Generator?
        </h2>
        <p style={p}>
          A <strong>2FA code generator</strong> (also called a TOTP generator or online authenticator) turns a secret
          key into a 6-digit one-time password that changes every 30 seconds. Websites use these codes as a second
          step after your password, so even if someone steals your password, they cannot log in without the live code.
        </p>
        <p style={p}>
          2FA.ac implements the open <strong>TOTP standard (RFC 6238)</strong> — the same algorithm used by Google
          Authenticator, Authy, and Microsoft Authenticator. That means the codes generated here are identical to the
          ones your phone app would show for the same secret key. It works for Gmail, Instagram, Facebook, Amazon,
          GitHub, Discord, banking portals, and any other service that supports authenticator apps.
        </p>
        <p style={p}>
          Unlike most online generators, <strong>your secret key never leaves your device</strong>. The cryptographic
          calculation (HMAC-SHA1 via the Web Crypto API) runs entirely inside your browser — nothing is uploaded,
          logged, or stored on our servers. You can verify this yourself: the generator keeps working even if you
          disconnect from the internet after the page loads.
        </p>
      </section>

      {/* FAQ — visible HTML matches FAQPage schema */}
      <section
        aria-labelledby="faq-heading"
        style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 20px 56px", position: "relative", zIndex: 1 }}
      >
        <h2 id="faq-heading" style={h2}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqs.map((f) => (
            <details key={f.q} style={{ ...card, padding: "18px 22px" }}>
              <summary style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", cursor: "pointer" }}>
                {f.q}
              </summary>
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.8, margin: "12px 0 0" }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient seoContent={<SeoContent />} />
    </>
  );
}
