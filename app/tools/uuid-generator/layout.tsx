import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free UUID Generator Online — UUID v4 | 2FA.ac",
  description: "Generate random UUID v4 identifiers instantly — single or in bulk. Free online UUID/GUID generator, no signup required.",
  keywords: "UUID generator, UUID v4 generator, GUID generator, generate UUID online, random UUID",
  alternates: { canonical: "https://2fa.ac/tools/uuid-generator" },
  openGraph: {
    title: "Free UUID Generator Online — UUID v4 | 2FA.ac",
    description: "Generate random UUID v4 identifiers instantly — single or in bulk. Free online UUID/GUID generator, no signup required.",
    url: "https://2fa.ac/tools/uuid-generator",
    siteName: "2FA.ac",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
