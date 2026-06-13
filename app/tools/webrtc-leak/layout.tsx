import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "WebRTC Leak Test — Check If Your VPN Is Leaking Your IP | 2FA.ac",
  description: "Free WebRTC leak test. Check if your browser is exposing your real IP address through WebRTC even with a VPN. Instant, 100% browser-based, no signup.",
  keywords: "WebRTC leak test, WebRTC IP leak, VPN leak test, WebRTC leak checker, browser IP leak, WebRTC leak fix, VPN WebRTC leak",
  alternates: { canonical: "https://2fa.ac/tools/webrtc-leak" },
  openGraph: { title: "WebRTC Leak Test — Is Your VPN Leaking? | 2FA.ac", description: "Check if your browser is exposing your real IP through WebRTC. Free, instant, browser-based test.", url: "https://2fa.ac/tools/webrtc-leak", siteName: "2FA.ac", type: "website" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
