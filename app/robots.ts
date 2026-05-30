import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/saved-keys"],
    },
    sitemap: "https://2fa.ac/sitemap.xml",
  };
}