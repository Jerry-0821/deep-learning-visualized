import { modules } from "@/data/modules";

export type TopicLookup = {
  slug: string;
  canonicalSlug: string;
  title: string;
  pageTitle?: string;
  subtitle: string;
  tag: string;
  moduleId: string;
  moduleTitle: string;
  moduleHref: string;
  topicIndex: number;
  optional?: boolean;
};

export const topics = modules.flatMap((module) =>
  module.topics.map((topic, index) => ({
    slug: topic.slug,
    canonicalSlug: topic.slug,
    title: topic.title,
    pageTitle: topic.pageTitle,
    subtitle: topic.subtitle,
    tag: topic.tag,
    moduleId: module.id,
    moduleTitle: module.fullTitle,
    moduleHref: `/module/${module.id}`,
    topicIndex: index + 1,
  })),
);

export const optionalTopics: TopicLookup[] = [];

export const topicAliases: TopicLookup[] = [
  {
    ...topics.find((topic) => topic.slug === "adam-vs-sgd")!,
    slug: "adam-optimizer-vs-sgd",
    canonicalSlug: "adam-vs-sgd",
  },
];

export const routableTopics = [...topics, ...optionalTopics, ...topicAliases];

export const topicsBySlug = Object.fromEntries(routableTopics.map((topic) => [topic.slug, topic])) as Record<
  string,
  TopicLookup
>;
