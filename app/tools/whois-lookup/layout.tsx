import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free WHOIS Lookup — Domain Owner & Registration Info | 2FA.ac",
  description: "Check WHOIS data for any domain — registrar, registration date, expiry and name servers. Free online WHOIS lookup tool.",
  keywords: "WHOIS lookup, domain WHOIS, domain owner lookup, check domain registration, WHOIS search, domain age checker",
  alternates: { canonical: "https://2fa.ac/tools/whois-lookup" },
  openGraph: {
    title: "Free WHOIS Lookup — Domain Owner & Registration Info | 2FA.ac",
    description: "Check WHOIS data for any domain — registrar, registration date, expiry and name servers. Free online WHOIS lookup tool.",
    url: "https://2fa.ac/tools/whois-lookup",
    siteName: "2FA.ac",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
