import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Saved formulas live in each reader's browser, so the page has nothing to index.
      disallow: ["/formula-hub/saved"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
