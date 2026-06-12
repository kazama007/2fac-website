import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encode & Decode Online — Free Tool | 2FA.ac",
  description: "Encode text to Base64 or decode Base64 to text instantly. Free browser-based Base64 converter — your data never leaves your device.",
  keywords: "Base64 encoder, Base64 decoder, Base64 encode online, Base64 decode online, Base64 converter",
  alternates: { canonical: "https://2fa.ac/tools/base64" },
  openGraph: {
    title: "Base64 Encode & Decode Online — Free Tool | 2FA.ac",
    description: "Encode text to Base64 or decode Base64 to text instantly. Free browser-based Base64 converter — your data never leaves your device.",
    url: "https://2fa.ac/tools/base64",
    siteName: "2FA.ac",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
