import { renderShareCard, shareImageSize } from "@/components/share/ShareCard";
import { routableTopics, topicsBySlug } from "@/data/topics";

export const alt = "Deep Learning Visualized interactive lesson";
export const size = shareImageSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return routableTopics.map((topic) => ({ slug: topic.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = topicsBySlug[slug];
  return renderShareCard({
    eyebrow: topic ? `Module ${topic.moduleId.padStart(2, "0")} · Interactive lesson` : "Deep Learning Visualized",
    title: topic ? topic.pageTitle ?? topic.title : "Interactive lesson",
    subtitle: topic?.subtitle ?? "Learn deep learning visually, step by step.",
    badge: "Deep Learning Visualized",
  });
}
