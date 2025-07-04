import { styled } from "@mui/material/styles";
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  BottomNavigationAction,
  Typography,
  TypographyProps,
  Avatar,
  Divider,
  Drawer,
  BottomNavigation,
} from "@mui/material";

export const SidebarContainer = styled(Box)(() => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#1a1b23",
  color: "#ffffff",
  overflow: "hidden",
  width: "100%",
}));

export const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

export const SidebarContent = styled(Box)(() => ({
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  padding: "16px 0",
  width: "100%",
}));

export const SidebarFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderTop: "1px solid rgba(255,255,255,0.1)",

}));

export const UserInfo = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "16px",
  width: "100%",
  minWidth: 0,
}));

export const UserName = styled(Typography)<TypographyProps>(() => ({
  color: "#ffffff",
  fontWeight: 500,
  fontSize: "0.875rem",
  lineHeight: 1.2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  minWidth: 0,
}));

export const UserEmail = styled(Typography)<TypographyProps>(() => ({
  color: "#9ca3af",
  fontSize: "0.75rem",
  lineHeight: 1.2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  minWidth: 0,
}));

export const SidebarListItem = styled(ListItem)(() => ({
  margin: "4px 16px",
  borderRadius: "8px",
  width: "calc(100% - 32px)",
  maxWidth: "calc(100% - 32px)",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
}));

export const SidebarListItemButton = styled(ListItemButton)(() => ({
  borderRadius: "8px",
  padding: "12px 16px",
  color: "#9ca3af",
  width: "100%",
  minWidth: 0,
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  "&.Mui-selected": {
    backgroundColor: "rgba(78, 205, 196, 0.1)",
    color: "#4ecdc4",
    "&:hover": {
      backgroundColor: "rgba(78, 205, 196, 0.15)",
    },
  },
}));

export const SidebarListItemIcon = styled(ListItemIcon)(() => ({
  color: "inherit",
  minWidth: "40px",
  "& .MuiSvgIcon-root": {
    fontSize: "20px",
  },
}));

export const SidebarListItemText = styled(ListItemText)(() => ({
  minWidth: 0,
  "& .MuiListItemText-primary": {
    fontSize: "0.875rem",
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
}));

export const BottomNavContainer = styled(Box)(() => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1300,
  background: "#252730",
  boxShadow: "0 -2px 8px rgba(0,0,0,0.12)",
  pointerEvents: "auto",
  paddingBottom: "env(safe-area-inset-bottom)",
}));

export const BottomNavAction = styled(BottomNavigationAction)(() => ({
  "& .MuiBottomNavigationAction-label": {
    fontSize: "0.75rem",
    fontWeight: 500,
  },
  "& .MuiSvgIcon-root": {
    fontSize: "20px",
  },
}));

// New styled components for inline styles
export const HeaderLogoContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 16,
}));

export const HeaderLogoIcon = styled("div")(() => ({
  fontSize: 32,
  color: "#4ecdc4",
}));

export const HeaderLogoText = styled(Typography)(() => ({
  color: "#ffffff",
  fontWeight: 600,
}));

export const CloseButton = styled("button")(() => ({
  background: "none",
  border: "none",
  color: "#9ca3af",
  cursor: "pointer",
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const UserInfoContainer = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
}));

export const UserAvatar = styled(Avatar)(() => ({
  width: 40,
  height: 40,
  backgroundColor: "#4ecdc4",
  fontSize: "1rem",
}));

export const FooterDivider = styled(Divider)(() => ({
  borderColor: "rgba(255,255,255,0.1)",
  marginBottom: 16,
}));

export const SignOutListItem = styled(SidebarListItem)(() => ({
  marginTop: 8,
}));

export const MobileDrawer = styled(Drawer)(() => ({
  "& .MuiDrawer-paper": {
    width: 280,
    backgroundColor: "#1a1b23",
    border: "none",
  },
  zIndex: 1400,
}));

export const StyledBottomNavigation = styled(BottomNavigation)(() => ({
  backgroundColor: "#252730",
  borderTop: "1px solid rgba(255,255,255,0.1)",
  "& .MuiBottomNavigationAction-root": {
    color: "#9ca3af",
    "&.Mui-selected": {
      color: "#4ecdc4",
    },
  },
}));

export const MobileMenuButton = styled("button")(() => ({
  position: "fixed",
  top: 16,
  left: 16,
  zIndex: 1200,
  background: "#252730",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  padding: "8px",
  color: "#ffffff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const DesktopDrawer = styled(Drawer)(() => ({
  width: 240,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 240,
    boxSizing: "border-box",
    backgroundColor: "#1a1b23",
    border: "none",
    borderRight: "1px solid rgba(255,255,255,0.1)",
  },
}));

export const MobileNavBar = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  width: '100vw',
  zIndex: 1200,
  boxSizing: 'border-box',
  margin: 0,
  paddingLeft: 0,
  paddingRight: 0,
}));
