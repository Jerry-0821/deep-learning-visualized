"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type EditionMenuLink = { href: string; label: string; active: boolean };

export function EditionMenu({ links, startLearningHref }: { links: EditionMenuLink[]; startLearningHref: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="edition-nav-icon edition-menu-button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="edition-menu-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {open ? <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" /> : <path d="M4.75 7.5h14.5M4.75 12h14.5M4.75 16.5h14.5" />}
        </svg>
      </button>
      {open ? (
        <>
          <div className="edition-menu-backdrop" aria-hidden="true" onClick={() => setOpen(false)} />
          <div className="edition-menu-panel" id="edition-menu-panel">
            <nav aria-label="Site menu">
              {links.map((link) => (
                <Link
                  key={link.href}
                  className={`edition-menu-link ${link.active ? "active" : ""}`}
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link className="edition-menu-cta" href={startLearningHref} onClick={() => setOpen(false)}>
              Start learning {"→"}
            </Link>
          </div>
        </>
      ) : null}
    </>
  );
}
