"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "crm-density";

export function DensityToggle() {
  const [density, setDensity] = useState<"comfortable" | "compact">(() => {
    if (typeof window === "undefined") {
      return "comfortable";
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "compact" ? "compact" : "comfortable";
  });

  useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  const toggle = () => {
    const next = density === "comfortable" ? "compact" : "comfortable";
    setDensity(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.dataset.density = next;
  };

  return (
    <button type="button" onClick={toggle} className="h-9 rounded-md border px-3 text-sm">
      Density: {density}
    </button>
  );
}
