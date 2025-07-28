"use client";

import { useRouter, usePathname } from "next/navigation";
import { useSupabase } from "@/contexts/supabase-context";
import ClientOnly from "../client-only";
import { NavigationContent } from "./navigation-content";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSupabase();

  return (
    <ClientOnly fallback={null}>
      <NavigationContent pathname={pathname} user={user} router={router} />
    </ClientOnly>
  );
};

export default Navigation;
