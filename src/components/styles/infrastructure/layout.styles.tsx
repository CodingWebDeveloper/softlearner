import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const LayoutContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
}));

export const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isMobile" && prop !== "hasUser",
})<{
  isMobile?: boolean;
  hasUser?: boolean;
}>(({ isMobile, hasUser, theme }) => ({
  flexGrow: 1,
  backgroundColor: "#1a1b23",
  minHeight: "100vh",
  // Add margin for mobile bottom navigation
  ...(isMobile &&
    hasUser && {
      paddingBottom: "80px", // Height of bottom navigation
    }),
}));

export const FallbackContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
}));

export const FallbackMain = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: "#1a1b23",
  minHeight: "100vh",
}));

export const PageContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  margin: "0 auto",
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  background: theme.palette.custom.background.dark,
  minHeight: "100vh",
  overflowX: "hidden",
}));

export const PageTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.custom.text.white,
}));
