"use client";

import { useEffect, useRef } from "react";

type PrototypeFrameProps = {
  src: string;
  title: string;
  fallbackHeight: number;
};

export function PrototypeFrame({ src, title, fallbackHeight }: PrototypeFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const initialHeight = Math.min(fallbackHeight, 1200);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    let cancelled = false;
    iframe.style.height = `${initialHeight}px`;
    let lastAppliedHeight = initialHeight;
    const timeoutIds: number[] = [];

    const restorePageScroll = (scrollX: number, scrollY: number) => {
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;

      root.style.scrollBehavior = "auto";
      window.scrollTo(scrollX, scrollY);
      root.style.scrollBehavior = previousScrollBehavior;
    };

    const updateHeight = (resetViewport = false) => {
      if (cancelled || !iframe) {
        return;
      }

      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      try {
        const doc = iframe.contentDocument;
        if (!doc) {
          return;
        }

        if (resetViewport) {
          // Collapse only during the initial stabilization pass so inner 100vh
          // layouts can be measured without permanently stretching the page.
          iframe.style.height = "1px";
        }

        const html = doc.documentElement;
        const body = doc.body;
        const htmlHeight = html?.scrollHeight ?? 0;
        const bodyHeight = body?.scrollHeight ?? 0;
        const htmlOffsetHeight = html?.offsetHeight ?? 0;
        const bodyOffsetHeight = body?.offsetHeight ?? 0;
        const bodyTop = body?.getBoundingClientRect().top ?? 0;
        const childHeights = body
          ? Array.from(body.children).map((child) =>
              Math.ceil(child.getBoundingClientRect().bottom - bodyTop),
            )
          : [];
        const measuredHeight = Math.max(
          htmlHeight,
          bodyHeight,
          htmlOffsetHeight,
          bodyOffsetHeight,
          ...childHeights,
        );
        const nextHeight = measuredHeight > 0 ? measuredHeight : fallbackHeight;

        if (Math.abs(nextHeight - lastAppliedHeight) > 1) {
          iframe.style.height = `${nextHeight}px`;
          lastAppliedHeight = nextHeight;
        } else if (resetViewport) {
          iframe.style.height = `${lastAppliedHeight}px`;
        }

        restorePageScroll(scrollX, scrollY);
      } catch {
        iframe.style.height = `${fallbackHeight}px`;
        lastAppliedHeight = fallbackHeight;
        restorePageScroll(scrollX, scrollY);
      }
    };

    const handleLoad = () => {
      updateHeight(true);
      timeoutIds.push(window.setTimeout(() => updateHeight(true), 120));
      timeoutIds.push(window.setTimeout(() => updateHeight(true), 360));
      timeoutIds.push(window.setTimeout(() => updateHeight(false), 900));
    };

    iframe.addEventListener("load", handleLoad);
    window.addEventListener("resize", handleLoad);

    return () => {
      cancelled = true;
      iframe.removeEventListener("load", handleLoad);
      window.removeEventListener("resize", handleLoad);
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [fallbackHeight, initialHeight, src]);

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
