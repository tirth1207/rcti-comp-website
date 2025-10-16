"use client";

import { useEffect } from "react";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  // Disable right-click globally
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return <>{children}</>;
}
