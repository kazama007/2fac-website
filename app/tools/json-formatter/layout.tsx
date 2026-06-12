import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free JSON Formatter & Validator Online | 2FA.ac",
  description: "Format, beautify, minify and validate JSON instantly. Free online JSON formatter that runs 100% in your browser — paste safely, nothing is uploaded.",
  keywords: "JSON formatter, JSON validator, JSON beautifier, format JSON online, JSON pretty print, JSON minify",
  alternates: { canonical: "https://2fa.ac/tools/json-formatter" },
  openGraph: {
    title: "Free JSON Formatter & Validator Online | 2FA.ac",
    description: "Format, beautify, minify and validate JSON instantly. Free online JSON formatter that runs 100% in your browser — paste safely, nothing is uploaded.",
    url: "https://2fa.ac/tools/json-formatter",
    siteName: "2FA.ac",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
