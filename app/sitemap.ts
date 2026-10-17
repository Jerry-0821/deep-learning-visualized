import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blogPosts";
import { formulaHubEntries } from "@/data/formulaHub";
import { SITE_URL } from "@/data/site";
import { topics } from "@/data/topics";

// Every public page a search engine should know about. Topic aliases, the saved-formulas
// page (per-reader) and module pages (they redirect to /topics) are left out on purpose.
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    page("/topics", 0.9, "weekly"),
    page("/formula-hub", 0.8, "weekly"),
    page("/blog", 0.8, "weekly"),
    page("/mindmap", 0.5),
    page("/about", 0.4),
    ...topics.map((topic) => page(`/topic/${topic.slug}`, 0.9)),
    ...blogPosts.map((post) => page(`/blog/${post.slug}`, 0.7)),
    ...formulaHubEntries.map((entry) => page(`/formula-hub/${entry.id}`, 0.6)),
  ];
}
