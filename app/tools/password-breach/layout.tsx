import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Breach Checker — Has My Password Been Leaked? | 2FA.ac",
  description: "Check if your password appeared in known data breaches using HaveIBeenPwned with k-anonymity. Your password never leaves your browser.",
  keywords: "password breach checker, pwned password check, has my password been leaked, data breach password check, haveibeenpwned",
  alternates: { canonical: "https://2fa.ac/tools/password-breach" },
  openGraph: {
    title: "Password Breach Checker — Has My Password Been Leaked? | 2FA.ac",
    description: "Check if your password appeared in known data breaches using HaveIBeenPwned with k-anonymity. Your password never leaves your browser.",
    url: "https://2fa.ac/tools/password-breach",
    siteName: "2FA.ac",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
