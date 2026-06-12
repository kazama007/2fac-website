import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved 2FA Keys | 2FA.ac",
  description: "View and manage the 2FA secret keys saved locally in your browser. Keys never leave your device.",
  alternates: { canonical: "https://2fa.ac/saved-keys" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
