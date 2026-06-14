import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Internet Speed Test — Check Download, Upload & Ping | 2FA.ac",
  description: "Free internet speed test. Check your download speed, upload speed, ping and jitter instantly. No signup, no app — runs 100% in your browser.",
  keywords: "internet speed test, speed test, wifi speed test, broadband speed test, check internet speed, download speed test, upload speed test, ping test online",
  alternates: { canonical: "https://2fa.ac/tools/speed-test" },
  openGraph: { title: "Internet Speed Test — Check Your Connection Speed | 2FA.ac", description: "Test your download, upload, ping and jitter for free. Instant results, no signup required.", url: "https://2fa.ac/tools/speed-test", siteName: "2FA.ac", type: "website" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
