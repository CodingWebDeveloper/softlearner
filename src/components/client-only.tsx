"use client";

import { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  ssr?: boolean;
}

export default function ClientOnly({
  children,
  fallback = null,
  ssr = false,
}: ClientOnlyProps) {
  const [mounted, setMounted] = useState(ssr);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
