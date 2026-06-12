import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About 2FA.ac — Free Browser-Based Security Tools",
  description: "2FA.ac offers 14 free cybersecurity tools that run entirely in your browser — 2FA codes, passwords, JWT, DNS and more. Learn about our privacy-first approach.",
  alternates: { canonical: "https://2fa.ac/about" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
