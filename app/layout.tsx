import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "2FA.ac — Free 2FA Code Generator & Security Tools",
  description: "Generate 2FA codes instantly, check passwords, decode JWT, lookup DNS & IP. 15+ free cybersecurity tools. No signup required.",
  keywords: "2FA generator, TOTP generator, password generator, JWT decoder, DNS lookup, IP lookup, cybersecurity tools, free security tools, two factor authentication",
  authors: [{ name: "2fa.ac" }],
  creator: "2fa.ac",
  publisher: "2fa.ac",
  robots: "index, follow",
  alternates: {
    canonical: "https://2fa.ac",
  },
  openGraph: {
    title: "2FA.ac — Free 2FA Code Generator & Security Tools",
    description: "Generate 2FA codes instantly. 15+ free cybersecurity tools. No signup required.",
    url: "https://2fa.ac",
    siteName: "2FA.ac",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://2fa.ac/logo.png",
        width: 1200,
        height: 630,
        alt: "2FA.ac — Free Security Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2FA.ac — Free 2FA Code Generator & Security Tools",
    description: "Generate 2FA codes instantly. 15+ free cybersecurity tools. No signup required.",
    images: ["https://2fa.ac/logo.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://2fa.ac" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "2FA.ac",
              "url": "https://2fa.ac",
              "description": "Free 2FA code generator and cybersecurity tools",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://2fa.ac/?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body>
        {children}
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,hi,zh-CN,ru,fr,de,es,pt,tr,ja,ko,ar',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
      </body>
    </html>
  );
}