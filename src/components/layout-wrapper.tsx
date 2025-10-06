"use client";

import { ReactNode } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useSupabase } from "@/contexts/supabase-context";
import ClientOnly from "./client-only";
import {
  LayoutContainer,
  MainContent,
} from "@/components/styles/infrastructure/layout.styles";
import Navigation from "./navigation/navigation";

interface LayoutProps {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: LayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, userProfile, isRecoveryMode } = useSupabase();

  return (
    <LayoutContainer>
      <ClientOnly fallback={null}>
        {user && userProfile && !isRecoveryMode && <Navigation />}
      </ClientOnly>

      <MainContent
        component="main"
        isMobile={isMobile}
        hasUser={Boolean(user) && Boolean(userProfile)}
      >
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default LayoutWrapper;
