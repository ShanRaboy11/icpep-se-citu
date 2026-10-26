"use client";

import { useEffect } from "react";

// Closes an open custom dropdown when the user presses anywhere outside it.
// The dropdown's wrapper carries `data-dropdown`. This replaces the invisible
// full-screen layers used before: a fixed full-screen layer hands scrolling to
// the page behind it, so a modal or container underneath couldn't scroll while
// a dropdown was open.
export function useDropdownDismiss(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target as Element).closest("[data-dropdown]")) close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);
}
