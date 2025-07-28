"use client";

import { List } from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import { User } from "@supabase/supabase-js";
import {
  Home as HomeIcon,
  Book as BookIcon,
  LocalLibrary as MyCoursesIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Bookmark as BookmarkIcon,
} from "@mui/icons-material";
import {
  SidebarContainer,
  SidebarHeader,
  SidebarContent as StyledSidebarContent,
  SidebarFooter,
  HeaderLogoContainer,
  HeaderLogoIcon,
  HeaderLogoText,
  UserInfo,
  UserInfoContainer,
  UserName,
  UserEmail,
  SidebarListItem,
  SidebarListItemButton,
  SidebarListItemIcon,
  SidebarListItemText,
  FooterDivider,
  DesktopDrawer,
  UserAvatar,
} from "@/components/styles/infrastructure/navigation.styles";
import { useSupabase } from "@/contexts/supabase-context";
import { useRouter } from "next/navigation";

interface DesktopNavigationProps {
  pathname: string;
  user: User | null;
  onNavigation: (path: string) => void;
}

export const DesktopNavigation = ({
  pathname,
  user,
  onNavigation,
}: DesktopNavigationProps) => {
  // General Hooks
  const router = useRouter();
  const { signOut } = useSupabase();

  const navigationItems = [
    {
      label: "Home",
      icon: <HomeIcon />,
      path: "/",
      showWhenAuthenticated: true,
      showWhenUnauthenticated: false,
    },
    {
      label: "My Courses",
      icon: <MyCoursesIcon />,
      path: "/my-courses",
      showWhenAuthenticated: true,
      showWhenUnauthenticated: false,
    },
    {
      label: "Courses",
      icon: <BookIcon />,
      path: "/courses",
      showWhenAuthenticated: true,
      showWhenUnauthenticated: true,
    },
    {
      label: "Bookmarks",
      icon: <BookmarkIcon />,
      path: "/bookmarks",
      showWhenAuthenticated: true,
      showWhenUnauthenticated: false,
    },
    {
      label: "Profile",
      icon: <PersonIcon />,
      path: "/profile",
      showWhenAuthenticated: true,
      showWhenUnauthenticated: false,
    },
    {
      label: "Settings",
      icon: <SettingsIcon />,
      path: "/settings",
      showWhenAuthenticated: true,
      showWhenUnauthenticated: false,
    },
  ];

  const filteredItems = navigationItems.filter((item) => {
    if (user) {
      return item.showWhenAuthenticated;
    } else {
      return item.showWhenUnauthenticated;
    }
  });

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const SidebarContent = () => (
    <SidebarContainer>
      <SidebarHeader>
        <HeaderLogoContainer>
          <HeaderLogoIcon>
            <SchoolIcon />
          </HeaderLogoIcon>
          <HeaderLogoText variant="h6">SoftLearner</HeaderLogoText>
        </HeaderLogoContainer>
      </SidebarHeader>

      <StyledSidebarContent>
        <List>
          {filteredItems.map((item) => (
            <SidebarListItem key={item.path} disablePadding>
              <SidebarListItemButton
                selected={pathname === item.path}
                onClick={() => onNavigation(item.path)}
                aria-label={item.label}
              >
                <SidebarListItemIcon>{item.icon}</SidebarListItemIcon>
                <SidebarListItemText primary={item.label} />
              </SidebarListItemButton>
            </SidebarListItem>
          ))}
        </List>
      </StyledSidebarContent>

      {user && (
        <SidebarFooter>
          <FooterDivider />
          <UserInfo>
            <UserAvatar>{user.email?.charAt(0).toUpperCase()}</UserAvatar>
            <UserInfoContainer>
              <UserName variant="body2">
                {user.user_metadata?.full_name || "User"}
              </UserName>
              <UserEmail variant="body2">{user.email}</UserEmail>
            </UserInfoContainer>
          </UserInfo>
          <FooterDivider />
          <SidebarListItem disablePadding>
            <SidebarListItemButton
              onClick={handleSignOut}
              aria-label="Sign out"
            >
              <SidebarListItemIcon>
                <SettingsIcon />
              </SidebarListItemIcon>
              <SidebarListItemText primary="Sign out" />
            </SidebarListItemButton>
          </SidebarListItem>
        </SidebarFooter>
      )}
    </SidebarContainer>
  );

  return (
    <DesktopDrawer variant="permanent">
      <SidebarContent />
    </DesktopDrawer>
  );
};
