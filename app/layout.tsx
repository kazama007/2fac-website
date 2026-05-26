import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2FA.ac — Free 2FA Code Generator & Security Tools",
  description: "Generate 2FA codes instantly, check passwords, decode JWT, lookup DNS & IP. 15+ free cybersecurity tools. No signup required.",
  keywords: "2FA generator, TOTP generator, password generator, JWT decoder, DNS lookup, IP lookup, cybersecurity tools, free security tools, two factor authentication",
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
        {/* Preconnect for faster external requests */}
        <link rel="preconnect" href="https://ukyalnzbxdokqwmupdcq.supabase.co" />
        <link rel="preconnect" href="https://api.imgbb.com" />
        <link rel="dns-prefetch" href="https://ukyalnzbxdokqwmupdcq.supabase.co" />
        {/* Preload logo */}
        <link rel="preload" href="/logo2.png" as="image" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}