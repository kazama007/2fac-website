import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | 2FA.ac",
  description: "Terms of service for using 2FA.ac's free online security tools.",
  alternates: { canonical: "https://2fa.ac/terms" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
