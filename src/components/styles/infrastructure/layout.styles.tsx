import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const LayoutContainer = styled(Box)(() => ({
  display: "flex",
  minHeight: "100vh",
}));

export const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isMobile" && prop !== "hasUser",
})<{
  isMobile?: boolean;
  hasUser?: boolean;
}>(({ isMobile, hasUser }) => ({
  flexGrow: 1,
  backgroundColor: "#1a1b23",
  minHeight: "100vh",
  // Add margin for mobile navigation
  ...(isMobile &&
    hasUser && {
      paddingBottom: "80px", // Height of bottom navigation
      paddingTop: "56px", // Height of top AppBar
    }),
}));

export const FallbackContainer = styled(Box)(() => ({
  display: "flex",
  minHeight: "100vh",
}));

export const FallbackMain = styled(Box)(() => ({
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

// Reusable Text Components
export const LightText = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light,
}));

export const WhiteText = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
}));

export const BlackText = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.black,
}));

export const AccentText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "accentColor",
})<{ accentColor?: "blue" | "gray" | "teal" | "green" | "orange" | "red" }>(
  ({ theme, accentColor = "blue" }) => ({
    color: theme.palette.custom.accent[accentColor],
  })
);
