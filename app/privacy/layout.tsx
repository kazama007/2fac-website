import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | 2FA.ac",
  description: "How 2FA.ac handles your data: tools run in your browser, secret keys are never uploaded, and we collect minimal analytics. Read the full privacy policy.",
  alternates: { canonical: "https://2fa.ac/privacy" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
