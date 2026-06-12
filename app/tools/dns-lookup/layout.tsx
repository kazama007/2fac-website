import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free DNS Lookup Tool — Check A, MX, TXT, NS Records | 2FA.ac",
  description: "Look up DNS records for any domain — A, AAAA, MX, TXT, NS, CNAME and more. Fast, free online DNS checker with no signup.",
  keywords: "DNS lookup, DNS checker, check DNS records, MX record lookup, TXT record lookup, NS lookup online",
  alternates: { canonical: "https://2fa.ac/tools/dns-lookup" },
  openGraph: {
    title: "Free DNS Lookup Tool — Check A, MX, TXT, NS Records | 2FA.ac",
    description: "Look up DNS records for any domain — A, AAAA, MX, TXT, NS, CNAME and more. Fast, free online DNS checker with no signup.",
    url: "https://2fa.ac/tools/dns-lookup",
    siteName: "2FA.ac",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
