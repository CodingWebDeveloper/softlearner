"use client";

import { ReactNode } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useSupabase } from "@/contexts/supabase-context";
import {
  LayoutContainer,
  MainContent,
} from "@/components/styles/infrastructure/layout.styles";
import Navigation from "./navigation/navigation";
import { HashLoader } from "react-spinners";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: LayoutProps) => {
  const theme = useTheme();
  const pathname = usePathname();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, userProfile, isRecoveryMode } = useSupabase();

  const isAuthRoute =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/update-password" ||
    pathname === "/reset-password";
  if (!user && !isAuthRoute) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.custom.background.dark,
        }}
      >
        <HashLoader color={theme.palette.custom.accent.teal} />
      </div>
    );
  }
  return (
    <LayoutContainer>
      {user && userProfile && !isRecoveryMode && <Navigation />}

      <MainContent
        component="main"
        isMobile={isMobile}
        hasUser={Boolean(user) && Boolean(userProfile)}
      >
        {}
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default LayoutWrapper;
