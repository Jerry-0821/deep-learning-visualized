"use client";

import { useEffect, useRef } from "react";

type PrototypeFrameProps = {
  src: string;
  title: string;
  fallbackHeight: number;
};

export function PrototypeFrame({ src, title, fallbackHeight }: PrototypeFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const stableHeight = Math.max(fallbackHeight, 720);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    const lockHeight = () => {
      iframe.style.height = `${stableHeight}px`;
    };

    lockHeight();
    iframe.addEventListener("load", lockHeight);
    window.addEventListener("resize", lockHeight);

    return () => {
      iframe.removeEventListener("load", lockHeight);
      window.removeEventListener("resize", lockHeight);
    };
  }, [stableHeight, src]);

  return (
    <iframe
      ref={iframeRef}
      className="prototype-frame"
      src={src}
      title={title}
      loading="eager"
      style={{ height: `${stableHeight}px` }}
    />
  );
}
