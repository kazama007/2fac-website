import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free QR Code Generator for 2FA & Authenticator Apps | 2FA.ac",
  description: "Generate QR codes online for free — perfect for 2FA setup, authenticator apps, URLs and text. Runs 100% in your browser, no signup required.",
  keywords: "QR code generator, free QR code generator, 2FA QR code, authenticator QR code, generate QR code online",
  alternates: { canonical: "https://2fa.ac/tools/qr-generator" },
  openGraph: {
    title: "Free QR Code Generator for 2FA & Authenticator Apps | 2FA.ac",
    description: "Generate QR codes online for free — perfect for 2FA setup, authenticator apps, URLs and text. Runs 100% in your browser, no signup required.",
    url: "https://2fa.ac/tools/qr-generator",
    siteName: "2FA.ac",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
