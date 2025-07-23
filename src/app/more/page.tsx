"use client";

import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/contexts/supabase-context";
import { PageContainer } from "@/components/styles/infrastructure/layout.styles";

const MorePage = () => {
  const router = useRouter();
  const { signOut } = useSupabase();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const moreItems = [
    {
      label: "Profile",
      icon: <PersonIcon />,
      path: "/profile",
      onClick: () => handleNavigation("/profile"),
    },
    {
      label: "Settings",
      icon: <SettingsIcon />,
      path: "/settings",
      onClick: () => handleNavigation("/settings"),
    },
  ];

  return (
    <PageContainer>
      <List>
        {moreItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={item.onClick}
            aria-label={`Navigate to ${item.label}`}
            sx={{ color: "custom.text.white" }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                sx: { color: "inherit" },
              }}
            />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 2, borderColor: "custom.background.tertiary" }} />
        <ListItemButton
          onClick={handleSignOut}
          aria-label="Sign out"
          sx={{ color: "custom.accent.red" }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            primaryTypographyProps={{
              sx: { color: "inherit" },
            }}
          />
        </ListItemButton>
      </List>
    </PageContainer>
  );
};

export default MorePage;
