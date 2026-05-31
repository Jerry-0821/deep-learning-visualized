import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Pipeline Mindmap | Deep Learning Visualized",
  description:
    "Explore the deep learning training pipeline as an interactive mindmap from setup and initialization through forward pass, loss, backward pass, and updates.",
};

export default function MindmapPage() {
  return (
    <main className="mindmap-route-root">
      <iframe
        className="mindmap-route-frame"
        src="/mindmap/training-pipeline-mindmap.html"
        title="Training Pipeline Mindmap"
      />
    </main>
  );
}
