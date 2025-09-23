import { styled } from "@mui/material/styles";
import { Box, Typography, Button } from "@mui/material";

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

export const Subtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light,
}));

export const PageHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.custom.background.secondary,
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  marginBottom: theme.spacing(4),
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

export const ProfilePageDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light,
}));

export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: theme.spacing(8, 2),
  minHeight: "60vh",
}));

export const EmptyStateIllustration = styled(Box)(({ theme }) => ({
  width: 200,
  height: 200,
  marginBottom: theme.spacing(4),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${theme.palette.custom.accent.teal}20, ${theme.palette.custom.accent.blue}20)`,
  border: `2px dashed ${theme.palette.custom.accent.teal}40`,
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${theme.palette.custom.accent.teal}, ${theme.palette.custom.accent.blue})`,
    opacity: 0.1,
  },
}));

export const EmptyStateTitle = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: 700,
  color: theme.palette.custom.text.white,
  marginBottom: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.custom.text.white}, ${theme.palette.custom.text.light})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
}));

export const EmptyStateDescription = styled(Typography)(({ theme }) => ({
  fontSize: "1.125rem",
  color: theme.palette.custom.text.light,
  marginBottom: theme.spacing(4),
  maxWidth: 500,
  lineHeight: 1.6,
}));

export const EmptyStateButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.custom.accent.teal,
  color: theme.palette.custom.text.white,
  padding: theme.spacing(1.5, 3),
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: theme.spacing(2),
  boxShadow: `0 4px 12px ${theme.palette.custom.accent.teal}40`,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.teal + "dd",
    transform: "translateY(-2px)",
    boxShadow: `0 6px 16px ${theme.palette.custom.accent.teal}60`,
  },
}));

export const EmptyStateIcon = styled(Box)(({ theme }) => ({
  fontSize: "4rem",
  color: theme.palette.custom.accent.teal,
  marginBottom: theme.spacing(2),
  opacity: 0.8,
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  padding: theme.spacing(1, 3),
  borderRadius: 2,
  backgroundColor: theme.palette.custom.accent.teal,
  color: theme.palette.custom.text.white,
  "&:hover": {
    borderColor: theme.palette.custom.accent.tealDark,
    backgroundColor: `${theme.palette.custom.accent.teal}10`,
  },
  "&.MuiButton-text": {
    backgroundColor: "transparent",
    color: theme.palette.custom.text.white,
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  "&:disabled": {
    backgroundColor: theme.palette.action.disabled,
  },
}));
