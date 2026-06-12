import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Safety Checker — Scan URLs for Phishing & Scams | 2FA.ac",
  description: "Check if a link is safe before clicking. Free URL checker that detects suspicious patterns, phishing tricks and scam domains.",
  keywords: "link checker, URL safety checker, is this link safe, phishing link checker, scam link detector, check URL safety",
  alternates: { canonical: "https://2fa.ac/tools/link-checker" },
  openGraph: {
    title: "Link Safety Checker — Scan URLs for Phishing & Scams | 2FA.ac",
    description: "Check if a link is safe before clicking. Free URL checker that detects suspicious patterns, phishing tricks and scam domains.",
    url: "https://2fa.ac/tools/link-checker",
    siteName: "2FA.ac",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
