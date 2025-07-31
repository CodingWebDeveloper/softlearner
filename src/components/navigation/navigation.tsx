"use client";

import { useRouter, usePathname } from "next/navigation";
import ClientOnly from "../client-only";
import { NavigationContent } from "./navigation-content";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <ClientOnly fallback={null}>
      <NavigationContent pathname={pathname} router={router} />
    </ClientOnly>
  );
};

export default Navigation;
