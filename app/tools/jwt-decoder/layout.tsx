import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free JWT Decoder Online — Decode JSON Web Tokens | 2FA.ac",
  description: "Decode JWT tokens instantly — view header, payload and expiry. 100% client-side JWT decoder, your token never leaves your browser. No signup.",
  keywords: "JWT decoder, decode JWT online, JWT decoder online, JSON web token decoder, JWT parser, JWT debugger",
  alternates: { canonical: "https://2fa.ac/tools/jwt-decoder" },
  openGraph: {
    title: "Free JWT Decoder Online — Decode JSON Web Tokens | 2FA.ac",
    description: "Decode JWT tokens instantly — view header, payload and expiry. 100% client-side JWT decoder, your token never leaves your browser. No signup.",
    url: "https://2fa.ac/tools/jwt-decoder",
    siteName: "2FA.ac",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
