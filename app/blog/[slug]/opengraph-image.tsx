import { renderShareCard, shareImageSize } from "@/components/share/ShareCard";
import { blogPosts, blogPostsBySlug } from "@/data/blogPosts";

export const alt = "Deep Learning Visualized blog";
export const size = shareImageSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPostsBySlug[slug];
  return renderShareCard({
    eyebrow: post ? `Deep dive · ${post.tag}` : "Deep Learning Blog",
    title: post?.title ?? "Deep Learning Blog",
    subtitle: post?.description ?? "Visual essays on modern deep learning.",
    badge: "Deep Learning Visualized",
  });
}
