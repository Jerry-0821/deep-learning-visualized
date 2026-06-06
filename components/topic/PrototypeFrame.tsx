"use client";

import { useEffect, useRef } from "react";

type PrototypeFrameProps = {
  src: string;
  title: string;
  fallbackHeight: number;
};

export function PrototypeFrame({ src, title, fallbackHeight }: PrototypeFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const initialHeight = Math.max(fallbackHeight, 720);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    const lockHeight = () => {
      let measuredHeight = 0;
      try {
        const doc = iframe.contentDocument;
        const body = doc?.body;
        if (doc && body) {
          const bodyTop = body.getBoundingClientRect().top;
          measuredHeight = Array.from(body.children).reduce((maxBottom, child) => {
            const rect = child.getBoundingClientRect();
            const style = doc.defaultView?.getComputedStyle(child);
            const marginBottom = style ? Number.parseFloat(style.marginBottom) || 0 : 0;
            return Math.max(maxBottom, rect.bottom - bodyTop + marginBottom);
          }, 0);
        }
      } catch {
        measuredHeight = 0;
      }
      const nextHeight = Math.max(720, Math.ceil(measuredHeight || initialHeight));
      iframe.style.height = `${nextHeight}px`;
    };

    lockHeight();
    iframe.addEventListener("load", lockHeight);
    window.addEventListener("resize", lockHeight);

    return () => {
      iframe.removeEventListener("load", lockHeight);
      window.removeEventListener("resize", lockHeight);
    };
  }, [initialHeight, src]);

  return (
    <iframe
      ref={iframeRef}
      className="prototype-frame"
      src={src}
      title={title}
      loading="eager"
      style={{ height: `${initialHeight}px` }}
    />
  );
}
