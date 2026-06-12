import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Hash Generator — MD5, SHA-256, SHA-512 Online | 2FA.ac",
  description: "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text instantly. Free online hash generator that runs entirely in your browser.",
  keywords: "hash generator, MD5 generator, SHA-256 generator, SHA-512 generator, online hash calculator, text to hash",
  alternates: { canonical: "https://2fa.ac/tools/hash-generator" },
  openGraph: {
    title: "Free Hash Generator — MD5, SHA-256, SHA-512 Online | 2FA.ac",
    description: "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text instantly. Free online hash generator that runs entirely in your browser.",
    url: "https://2fa.ac/tools/hash-generator",
    siteName: "2FA.ac",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
