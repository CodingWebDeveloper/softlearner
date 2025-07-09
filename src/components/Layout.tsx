"use client";

import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useSupabase } from "@/contexts/supabase-context";
import ClientOnly from "./client-only";
import { LayoutContainer, MainContent, FallbackContainer, FallbackMain } from "@/components/styles/infrastructure/layout.styles";
import Navigation from "@/components/navigation";
interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <ClientOnly
      fallback={
        <FallbackContainer>
          <FallbackMain component="main">
            {children}
          </FallbackMain>
        </FallbackContainer>
      }
    >
      <LayoutContent>{children}</LayoutContent>
    </ClientOnly>
  );
};

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useSupabase();

  return (
    <LayoutContainer>
      {/* Navigation - only show for authenticated users */}
      <ClientOnly fallback={null}>{user && <Navigation />}</ClientOnly>

      {/* Main Content */}
      <MainContent
        component="main"
        isMobile={isMobile}
        hasUser={!!user}
      >
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
