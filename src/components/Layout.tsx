"use client";

import { Box, useTheme, useMediaQuery } from "@mui/material";
import Navigation from "./Navigation";
import { useSupabase } from "@/contexts/SupabaseContext";
import ClientOnly from "./ClientOnly";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <ClientOnly
      fallback={
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              backgroundColor: "#1a1b23",
              minHeight: "100vh",
            }}
          >
            {children}
          </Box>
        </Box>
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
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Navigation - only show for authenticated users */}
      <ClientOnly fallback={null}>{user && <Navigation />}</ClientOnly>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#1a1b23",
          minHeight: "100vh",
          // Add margin for mobile bottom navigation
          ...(isMobile &&
            user && {
              paddingBottom: "80px", // Height of bottom navigation
            }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
