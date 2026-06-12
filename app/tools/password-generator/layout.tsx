import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Strong Password Generator Online | 2FA.ac",
  description: "Generate strong, random, secure passwords instantly. Customize length, symbols, numbers and case. 100% browser-based — passwords are never sent to any server.",
  keywords: "password generator, strong password generator, random password generator, secure password generator online, free password generator",
  alternates: { canonical: "https://2fa.ac/tools/password-generator" },
  openGraph: {
    title: "Free Strong Password Generator Online | 2FA.ac",
    description: "Generate strong, random, secure passwords instantly. Customize length, symbols, numbers and case. 100% browser-based — passwords are never sent to any server.",
    url: "https://2fa.ac/tools/password-generator",
    siteName: "2FA.ac",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
