"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    MathJax?: {
      typesetClear?: () => void;
      typesetPromise?: () => Promise<void>;
    };
  }
}

export function MathJaxRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    const typeset = () => {
      if (!window.MathJax?.typesetPromise) {
        return false;
      }

      window.MathJax.typesetClear?.();
      void window.MathJax.typesetPromise();
      return true;
    };

    if (typeset()) {
      return;
    }

    let attempts = 0;
    const intervalId = window.setInterval(() => {
      attempts += 1;
      if (typeset() || attempts >= 12) {
        window.clearInterval(intervalId);
      }
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [pathname]);

  return null;
}
