import { TopicRouteBar } from "@/components/topic/TopicRouteBar";
import type { TopicLookup } from "@/data/topics";

export function RedesignedTopicPage({ topic, src }: { topic: TopicLookup; src: string }) {
  const displayTitle = topic.pageTitle ?? topic.title;

  return (
    <main className="redesigned-topic-route">
      <TopicRouteBar topic={topic} />
      <iframe className="redesigned-topic-frame" src={src} title={`${displayTitle} lesson`} />
    </main>
  );
}
