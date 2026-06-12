import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact 2FA.ac — Get in Touch",
  description: "Questions, feedback or feature requests about 2FA.ac's free security tools? Contact us here.",
  alternates: { canonical: "https://2fa.ac/contact" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
