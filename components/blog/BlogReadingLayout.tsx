"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export type BlogNavigationItem = {
  id: string;
  label: string;
};

export function BlogReadingLayout({
  children,
  items,
}: {
  children: ReactNode;
  items: BlogNavigationItem[];
}) {
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [narrowLayout, setNarrowLayout] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 980px)");
    const syncViewport = () => {
      setNarrowLayout(media.matches);
      setNavigationOpen(!media.matches);
    };

    syncViewport();
    media.addEventListener("change", syncViewport);
    return () => media.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && narrowLayout && navigationOpen) {
        setNavigationOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [narrowLayout, navigationOpen]);

  return (
    <div
      className={`blog-reading-layout ${navigationOpen ? "" : "navigation-collapsed"} ${
        narrowLayout && navigationOpen ? "navigation-mobile-open" : ""
      }`}
    >
      <div className="blog-reading-rail">
        <button
          type="button"
          className="blog-reading-navigation-toggle"
          aria-label="Toggle article navigation"
          aria-expanded={navigationOpen}
          onClick={() => setNavigationOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <aside
          className="blog-reading-navigation"
          aria-hidden={!navigationOpen}
          inert={!navigationOpen ? true : undefined}
        >
          <p className="blog-reading-navigation-title">On This Page</p>
          <nav aria-label="Article sections">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => {
                  if (narrowLayout) setNavigationOpen(false);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
      </div>

      <button
        type="button"
        className="blog-reading-navigation-backdrop"
        aria-label="Close article navigation"
        onClick={() => setNavigationOpen(false)}
      />

      {children}
    </div>
  );
}
