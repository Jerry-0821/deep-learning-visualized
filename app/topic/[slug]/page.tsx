import type { Metadata } from "next";
import { EmbeddedPrototypePage } from "@/components/topic/EmbeddedPrototypePage";
import { prototypeMappings } from "@/data/prototypeMappings";
import { TopicPlaceholderPage } from "@/components/shared/TopicPlaceholderPage";
import { routableTopics, topicsBySlug } from "@/data/topics";
import { getTopicTeachingContent } from "@/data/topicTeachingContent";

type TopicRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return routableTopics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: TopicRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = topicsBySlug[slug];
  const prototype = topic ? prototypeMappings[topic.canonicalSlug] : prototypeMappings[slug];
  const teachingContent = getTopicTeachingContent(topic?.canonicalSlug ?? slug);

  return {
    title: topic ? `${topic.pageTitle ?? topic.title} | Deep Learning` : "Topic Placeholder | Deep Learning",
    description:
      topic && prototype
        ? teachingContent?.background[0] ?? topic.subtitle
        : teachingContent?.background[0] ?? "Placeholder route for future PAGE 3 teaching content.",
  };
}

export default async function TopicRoutePage({ params }: TopicRouteProps) {
  const { slug } = await params;
  const topic = topicsBySlug[slug];
  const prototype = topic ? prototypeMappings[topic.canonicalSlug] : prototypeMappings[slug];

  if (topic && prototype) {
    return <EmbeddedPrototypePage topic={topic} prototype={prototype} />;
  }

  return <TopicPlaceholderPage topic={topic} slug={slug} />;
}
