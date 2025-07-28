"use client";

import { useTheme, useMediaQuery } from "@mui/material";
import { User } from "@supabase/supabase-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { MobileNavigation } from "./mobile-navigation";
import { DesktopNavigation } from "./desktop-navigation";

interface NavigationContentProps {
  pathname: string;
  user: User | null;
  router: AppRouterInstance;
}

export const NavigationContent = ({
  pathname,
  user,
  router,
}: NavigationContentProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (isMobile) {
    return (
      <MobileNavigation
        pathname={pathname}
        user={user}
        onNavigation={handleNavigation}
      />
    );
  }

  return (
    <DesktopNavigation
      pathname={pathname}
      user={user}
      onNavigation={handleNavigation}
    />
  );
};
