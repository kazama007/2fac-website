import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://2fa.ac"),
  title: "2FA.ac — Free 2FA Code Generator & Security Tools",
  description: "Generate 2FA codes instantly, check passwords, decode JWT, lookup DNS & IP. 15+ free cybersecurity tools. No signup required.",
  keywords: "2FA generator, TOTP generator, password generator, JWT decoder, DNS lookup, IP lookup, cybersecurity tools, free security tools",
  authors: [{ name: "2fa.ac" }],
  creator: "2fa.ac",
  publisher: "2fa.ac",
  robots: "index, follow",
  openGraph: {
    title: "2FA.ac — Free 2FA Code Generator & Security Tools",
    description: "Generate 2FA codes instantly. 15+ free cybersecurity tools. No signup required.",
    url: "https://2fa.ac",
    siteName: "2FA.ac",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "2FA.ac — Free 2FA Code Generator & Security Tools",
    description: "Generate 2FA codes instantly. 15+ free cybersecurity tools. No signup required.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#7c3aed" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://ukyalnzbxdokqwmupdcq.supabase.co" />
        <link rel="dns-prefetch" href="https://ukyalnzbxdokqwmupdcq.supabase.co" />
        <link rel="preload" href="/logo2.png" as="image" />
      </head>
      <body suppressHydrationWarning>
        {children}

        {/* Google Analytics - sab pages pe */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J24856B8ZQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J24856B8ZQ');
          `}
        </Script>

        {/* Google AdSense - sirf non-admin pages pe */}
        <Script id="adsense-check" strategy="afterInteractive">
          {`
            if (!window.location.pathname.startsWith('/admin')) {
              var script = document.createElement('script');
              script.async = true;
              script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4107684422068090';
              script.crossOrigin = 'anonymous';
              document.head.appendChild(script);
            }
          `}
        </Script>
      </body>
    </html>
  );
}