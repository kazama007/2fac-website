import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free 2FA Tools & Cybersecurity Tools Online | 2FA.ac",
  description: "14 free 2FA and security tools — 2FA code generator, QR generator for authenticator apps, password tools, JWT decoder, DNS lookup and more. No signup, no data collected.",
  keywords: "2FA tools, 2FA tool online, free 2FA tools, two factor authentication tools, cybersecurity tools, free security tools online",
  alternates: { canonical: "https://2fa.ac/tools" },
  openGraph: {
    title: "Free 2FA Tools & Cybersecurity Tools Online | 2FA.ac",
    description: "14 free 2FA and security tools — no signup, runs in your browser.",
    url: "https://2fa.ac/tools",
    siteName: "2FA.ac",
    type: "website",
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
