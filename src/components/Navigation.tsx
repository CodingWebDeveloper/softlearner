"use client";

import { useState } from "react";
import { List, useTheme, useMediaQuery, Tooltip } from "@mui/material";
import {
  Home as HomeIcon,
  School as SchoolIcon,
  Bookmark as BookmarkIcon,
  Book as BookIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import { useSupabase } from "@/contexts/supabase-context";
import { User } from "@supabase/supabase-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ClientOnly from "./client-only";
import {
  SidebarContainer,
  SidebarHeader,
  SidebarContent as StyledSidebarContent,
  SidebarFooter,
  UserInfo,
  UserName,
  UserEmail,
  SidebarListItem,
  SidebarListItemButton,
  SidebarListItemIcon,
  SidebarListItemText,
  BottomNavContainer,
  BottomNavAction,
  HeaderLogoContainer,
  HeaderLogoIcon,
  HeaderLogoText,
  CloseButton,
  UserInfoContainer,
  UserAvatar,
  FooterDivider,
  SignOutListItem,
  MobileDrawer,
  StyledBottomNavigation,
  MobileMenuButton,
  DesktopDrawer,
} from "@/components/styles/infrastructure/navigation.styles";

const Navigation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useSupabase();

  return (
    <ClientOnly fallback={null}>
      <NavigationContent
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        pathname={pathname}
        user={user}
        signOut={signOut}
        router={router}
      />
    </ClientOnly>
  );
};

const NavigationContent = ({
  sidebarOpen,
  setSidebarOpen,
  pathname,
  user,
  signOut,
  router,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  pathname: string;
  user: User | null;
  signOut: () => Promise<void>;
  router: AppRouterInstance;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigationItems = [
    {
      label: "Home",
      icon: <HomeIcon />,
      path: "/",
      showWhenAuthenticated: true,
      showWhenUnauthenticated: false,
    },
    {
      label: "Bookmarks",
      icon: <BookmarkIcon />,
      path: "/bookmarks",
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

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

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
        {isMobile && (
          <CloseButton onClick={() => setSidebarOpen(false)}>
            <CloseIcon />
          </CloseButton>
        )}
      </SidebarHeader>

      <StyledSidebarContent>
        <List>
          {filteredItems.map((item) => (
            <SidebarListItem key={item.path} disablePadding>
              <SidebarListItemButton
                selected={pathname === item.path}
                onClick={() => handleNavigation(item.path)}
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
              <Tooltip title={user.email} placement="top">
                <UserEmail variant="body2">{user.email}</UserEmail>
              </Tooltip>
            </UserInfoContainer>
          </UserInfo>
          <SignOutListItem disablePadding>
            <SidebarListItemButton
              onClick={handleSignOut}
              aria-label="Sign out"
            >
              <SidebarListItemIcon>
                <SettingsIcon />
              </SidebarListItemIcon>
              <SidebarListItemText primary="Sign Out" />
            </SidebarListItemButton>
          </SignOutListItem>
        </SidebarFooter>
      )}
    </SidebarContainer>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Sidebar */}
        <MobileDrawer
          anchor="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        >
          <SidebarContent />
        </MobileDrawer>

        {/* Mobile Bottom Navigation */}
        <BottomNavContainer>
          <StyledBottomNavigation
            value={pathname}
            onChange={(event, newValue) => {
              if (newValue) {
                handleNavigation(newValue);
              }
            }}
          >
            <BottomNavAction
              label="Home"
              value="/"
              icon={<HomeIcon />}
              showLabel
            />
            <BottomNavAction
              label="Bookmarks"
              value="/bookmarks"
              icon={<BookmarkIcon />}
              showLabel
            />
            <BottomNavAction
              label="Courses"
              value="/courses"
              icon={<BookIcon />}
              showLabel
            />
            <BottomNavAction
              label="Profile"
              value="/profile"
              icon={<PersonIcon />}
              showLabel
            />
          </StyledBottomNavigation>
        </BottomNavContainer>

        {/* Mobile Menu Button */}
        <MobileMenuButton
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <MenuIcon />
        </MobileMenuButton>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <DesktopDrawer variant="permanent">
      <SidebarContent />
    </DesktopDrawer>
  );
};

export default Navigation;
