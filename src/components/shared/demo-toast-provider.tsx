"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { DEMO_BLOCK_MESSAGE, DEMO_REPO_URL } from "@/lib/demo/constants";

type DemoToastContextValue = {
  showDemoToast: () => void;
};

const DemoToastContext = createContext<DemoToastContextValue | null>(null);

export function DemoToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  const showDemoToast = useCallback(() => {
    setVisible(true);
    window.setTimeout(() => setVisible(false), 5000);
  }, []);

  const value = useMemo(() => ({ showDemoToast }), [showDemoToast]);

  return (
    <DemoToastContext.Provider value={value}>
      {children}
      {visible ? (
        <div className="fixed bottom-4 right-4 z-[70] max-w-sm rounded-xl border bg-white p-4 text-sm shadow-lg">
          <p className="font-medium">{DEMO_BLOCK_MESSAGE}</p>
          <Link href={DEMO_REPO_URL} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm underline">
            Fork on GitHub
          </Link>
        </div>
      ) : null}
    </DemoToastContext.Provider>
  );
}

export function useDemoToast() {
  const context = useContext(DemoToastContext);

  if (!context) {
    throw new Error("useDemoToast must be used within DemoToastProvider");
  }

  return context;
}
