"use client";

import { ReactNode } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useSupabase } from "@/contexts/supabase-context";
import ClientOnly from "./client-only";
import {
  LayoutContainer,
  MainContent,
  FallbackContainer,
  FallbackMain,
} from "@/components/styles/infrastructure/layout.styles";
import Navigation from "./navigation/navigation";

interface LayoutProps {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: LayoutProps) => {
  return (
    <ClientOnly
      fallback={
        <FallbackContainer>
          <FallbackMain component="main">{children}</FallbackMain>
        </FallbackContainer>
      }
    >
      <LayoutContent>{children}</LayoutContent>
    </ClientOnly>
  );
};

const LayoutContent = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, isRecoveryMode } = useSupabase();

  return (
    <LayoutContainer>
      <ClientOnly fallback={null}>
        {user && !isRecoveryMode && <Navigation />}
      </ClientOnly>

      <MainContent component="main" isMobile={isMobile} hasUser={!!user}>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default LayoutWrapper;
