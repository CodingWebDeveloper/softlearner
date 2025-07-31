"use client";

import { useTheme, useMediaQuery } from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { MobileNavigation } from "./mobile-navigation";
import { DesktopNavigation } from "./desktop-navigation";

interface NavigationContentProps {
  pathname: string;
  router: AppRouterInstance;
}

export const NavigationContent = ({
  pathname,
  router,
}: NavigationContentProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (isMobile) {
    return (
      <MobileNavigation pathname={pathname} onNavigation={handleNavigation} />
    );
  }

  return (
    <DesktopNavigation pathname={pathname} onNavigation={handleNavigation} />
  );
};
