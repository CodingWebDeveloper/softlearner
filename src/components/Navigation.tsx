"use client";

import {
  useTheme,
  useMediaQuery,
  Toolbar,
  IconButton,
  Typography,
  List,
} from "@mui/material";
import {
  Home as HomeIcon,
  School as SchoolIcon,
  Book as BookIcon,
  LocalLibrary as MyCoursesIcon,
  MoreHoriz as MoreIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Bookmark as BookmarkIcon,
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import { useSupabase } from "@/contexts/supabase-context";
import { User } from "@supabase/supabase-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ClientOnly from "./client-only";
import {
  BottomNavContainer,
  BottomNavAction,
  StyledBottomNavigation,
  UserAvatar,
  StyledAppBar,
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
} from "@/components/styles/infrastructure/navigation.styles";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSupabase();

  return (
    <ClientOnly fallback={null}>
      <NavigationContent pathname={pathname} user={user} router={router} />
    </ClientOnly>
  );
};

const NavigationContent = ({
  pathname,
  user,
  router,
}: {
  pathname: string;
  user: User | null;
  router: AppRouterInstance;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleNavigation = (path: string) => {
    router.push(path);
  };

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
  ];

  const mobileNavigationItems = [
    ...navigationItems,
    {
      label: "More",
      icon: <MoreIcon />,
      path: "/more",
      showWhenAuthenticated: true,
      showWhenUnauthenticated: false,
    },
  ];

  const desktopNavigationItems = [
    ...navigationItems,
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

  const filteredMobileItems = mobileNavigationItems.filter((item) => {
    if (user) {
      return item.showWhenAuthenticated;
    } else {
      return item.showWhenUnauthenticated;
    }
  });

  const filteredDesktopItems = desktopNavigationItems.filter((item) => {
    if (user) {
      return item.showWhenAuthenticated;
    } else {
      return item.showWhenUnauthenticated;
    }
  });

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
          {filteredDesktopItems.map((item) => (
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
              <UserEmail variant="body2">{user.email}</UserEmail>
            </UserInfoContainer>
          </UserInfo>
        </SidebarFooter>
      )}
    </SidebarContainer>
  );

  if (isMobile) {
    return (
      <>
        {/* Top App Bar */}
        <StyledAppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="logo">
              <SchoolIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              SoftLearner
            </Typography>
            {user && (
              <IconButton
                edge="end"
                color="inherit"
                aria-label="profile"
                onClick={() => handleNavigation("/profile")}
              >
                <UserAvatar>{user.email?.charAt(0).toUpperCase()}</UserAvatar>
              </IconButton>
            )}
          </Toolbar>
        </StyledAppBar>

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
            {filteredMobileItems.map((item) => (
              <BottomNavAction
                key={item.path}
                label={item.label}
                value={item.path}
                icon={item.icon}
                showLabel
              />
            ))}
          </StyledBottomNavigation>
        </BottomNavContainer>
      </>
    );
  }

  // Desktop Navigation
  return (
    <DesktopDrawer variant="permanent">
      <SidebarContent />
    </DesktopDrawer>
  );
};

export default Navigation;
