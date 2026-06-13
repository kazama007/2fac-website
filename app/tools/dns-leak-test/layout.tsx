import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DNS Leak Test — Check If Your VPN Is Leaking DNS Queries | 2FA.ac",
  description: "Free DNS leak test. Check if your VPN is leaking DNS queries to your ISP. Instant results, no account required, 100% free.",
  keywords: "DNS leak test, DNS leak checker, VPN DNS leak, DNS leak fix, DNS privacy test, is my VPN leaking DNS, DNS over HTTPS test",
  alternates: { canonical: "https://2fa.ac/tools/dns-leak-test" },
  openGraph: { title: "DNS Leak Test — Is Your VPN Leaking DNS? | 2FA.ac", description: "Check if your VPN is leaking DNS queries to your ISP. Free, instant, no signup required.", url: "https://2fa.ac/tools/dns-leak-test", siteName: "2FA.ac", type: "website" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
