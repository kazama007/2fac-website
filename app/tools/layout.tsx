import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Cybersecurity Tools — 14 Online Security Tools | 2FA.ac",
  description: "16 free online security tools — 2FA generator, WebRTC leak test, DNS leak test, password generator, JWT decoder, DNS lookup and more. No account required, no data collected.",
  alternates: { canonical: "https://2fa.ac/tools" },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
