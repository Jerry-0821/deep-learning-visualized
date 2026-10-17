import { renderShareCard, shareImageSize } from "@/components/share/ShareCard";

export const alt = "Deep Learning Visualized: learn deep learning visually";
export const size = shareImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderShareCard({
    eyebrow: "Deep Learning Visualized",
    title: "Learn deep learning visually",
    subtitle: "Interactive lessons, formulas and essays, from single neurons to transformers.",
    badge: "18 interactive lessons",
  });
}
