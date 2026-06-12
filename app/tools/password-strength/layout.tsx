import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Strength Checker — Test Your Password Online | 2FA.ac",
  description: "Check how strong your password is instantly. Get crack-time estimates and tips to improve it. Runs 100% in your browser — nothing is uploaded.",
  keywords: "password strength checker, password strength test, how strong is my password, check password strength online",
  alternates: { canonical: "https://2fa.ac/tools/password-strength" },
  openGraph: {
    title: "Password Strength Checker — Test Your Password Online | 2FA.ac",
    description: "Check how strong your password is instantly. Get crack-time estimates and tips to improve it. Runs 100% in your browser — nothing is uploaded.",
    url: "https://2fa.ac/tools/password-strength",
    siteName: "2FA.ac",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
