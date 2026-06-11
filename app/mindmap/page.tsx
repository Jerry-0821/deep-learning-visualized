import type { Metadata } from "next";
import { EditionBackdrop, EditionNav } from "@/components/edition/EditionChrome";

export const metadata: Metadata = {
  title: "Training Pipeline Mindmap | Deep Learning Visualized",
  description:
    "Explore the deep learning training pipeline as an interactive mindmap from setup and initialization through forward pass, loss, backward pass, and updates.",
};

export default function MindmapPage() {
  return (
    <main className="edition-root mindmap-route-root">
      <EditionBackdrop />
      <EditionNav active="mindmap" />
      <iframe
        className="mindmap-route-frame"
        src="/mindmap/training-pipeline-mindmap.html"
        title="Training Pipeline Mindmap"
      />
    </main>
  );
}
