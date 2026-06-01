import type { Metadata } from "next";
import Script from "next/script";

const criticalCSS = `
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
img{max-width:100%;height:auto;display:block}
.adsbygoogle{display:block;min-height:90px}
@media(max-width:768px){.grid-2{grid-template-columns:1fr!important}.grid-3{grid-template-columns:1fr!important}.grid-4{grid-template-columns:1fr 1fr!important}.blog-sidebar{display:none!important}.blog-content{grid-template-columns:1fr!important}.tools-grid{grid-template-columns:1fr 1fr!important}.mobile-pad{padding:16px!important}.mobile-pad-sm{padding:12px!important}.mobile-h1{font-size:28px!important}.mobile-h2{font-size:22px!important}.desktop-only{display:none!important}.mobile-full{width:100%!important;max-width:100%!important}.mobile-col{flex-direction:column!important}}
@media(max-width:480px){.grid-4{grid-template-columns:1fr!important}.tools-grid{grid-template-columns:1fr!important}}
a{transition:color .15s,background .15s}button{transition:all .15s}
::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:#f1f5f9}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}::-webkit-scrollbar-thumb:hover{background:#94a3b8}
input:focus,textarea:focus,select:focus{outline:none}
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://2fa.ac"),
  title: "2FA.ac — Free 2FA Code Generator & Security Tools",
  description: "Generate 2FA codes instantly, check passwords, decode JWT, lookup DNS & IP. 15+ free cybersecurity tools. No signup required.",
  keywords: "2FA code generator, 2FA generator, TOTP generator, free 2FA code generator, two factor authentication code generator, TOTP 2FA, password generator, JWT decoder, DNS lookup, IP lookup, cybersecurity tools, free security tools",
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
        {/* Inline critical CSS — eliminates render-blocking request */}
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        {/* Only preconnect to Supabase (used for page data) */}
        <link rel="preconnect" href="https://ukyalnzbxdokqwmupdcq.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ukyalnzbxdokqwmupdcq.supabase.co" />
      </head>
      <body suppressHydrationWarning>
        {children}

        {/* Google Analytics — lazyOnload: loads after page is idle */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J24856B8ZQ"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-J24856B8ZQ');`}
        </Script>

        {/* AdSense — lazyOnload: loads after page is idle, won't block FCP/LCP */}
        <Script id="adsense-check" strategy="lazyOnload">
          {`if(!window.location.pathname.startsWith('/admin')){var s=document.createElement('script');s.async=true;s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4107684422068090';s.crossOrigin='anonymous';document.head.appendChild(s);}`}
        </Script>
      </body>
    </html>
  );
}
