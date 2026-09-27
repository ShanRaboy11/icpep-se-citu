"use client";

import { useEffect } from "react";

// Below the lg breakpoint the manage list tables are collapsible cards (see globals.css).
// One listener flips a row open/closed when it is tapped, so none of the
// pages need per-row state.
export default function ResponsiveTableToggle() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!window.matchMedia("(max-width: 1023px)").matches) return;

      const target = event.target as HTMLElement;
      if (target.closest("button, a, input, select, textarea, label")) return;

      const row = target.closest(".responsive-table tr");
      if (!row || !row.querySelector("td")) return;

      row.setAttribute(
        "data-open",
        row.getAttribute("data-open") === "true" ? "false" : "true",
      );
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
