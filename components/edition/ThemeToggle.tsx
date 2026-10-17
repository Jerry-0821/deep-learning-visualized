"use client";

import { useEffect, useState } from "react";

type SiteTheme = "light" | "dark";

const STORAGE_KEY = "dlv-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<SiteTheme>("light");

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }, []);

  const nextTheme: SiteTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="edition-nav-icon edition-theme-toggle"
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      onClick={() => {
        setTheme(nextTheme);
        if (nextTheme === "dark") {
          document.documentElement.setAttribute("data-theme", "dark");
        } else {
          document.documentElement.removeAttribute("data-theme");
        }
        try {
          window.localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch {
          // Storage can be unavailable (private mode); the theme still applies for this page view.
        }
      }}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.75v2M12 19.25v2M4.75 12h-2M21.25 12h-2M6.87 6.87 5.46 5.46M18.54 18.54l-1.41-1.41M6.87 17.13l-1.41 1.41M18.54 5.46l-1.41 1.41" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.25 14.6A8.25 8.25 0 0 1 9.4 3.75a8.25 8.25 0 1 0 10.85 10.85Z" />
        </svg>
      )}
    </button>
  );
}
