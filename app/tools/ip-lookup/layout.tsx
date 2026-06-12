import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free IP Address Lookup — Location, ISP & Network Info | 2FA.ac",
  description: "Find the location, ISP, timezone and network details of any IP address. Free IP lookup tool — check your own IP or any other.",
  keywords: "IP lookup, IP address lookup, IP location finder, what is my IP, IP geolocation, find IP address location",
  alternates: { canonical: "https://2fa.ac/tools/ip-lookup" },
  openGraph: {
    title: "Free IP Address Lookup — Location, ISP & Network Info | 2FA.ac",
    description: "Find the location, ISP, timezone and network details of any IP address. Free IP lookup tool — check your own IP or any other.",
    url: "https://2fa.ac/tools/ip-lookup",
    siteName: "2FA.ac",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
