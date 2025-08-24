"use client";

import { useState } from "react";
import { List, Collapse, ListSubheader } from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import {
  Home as HomeIcon,
  Book as BookIcon,
  LocalLibrary as MyCoursesIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Bookmark as BookmarkIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  ExpandLess,
  ExpandMore,
  People as PeopleIcon,
  Category as CategoryIcon,
  LocalOffer as TagIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  OndemandVideo as VideoIcon,
  Analytics as AnalyticsIcon,
  Payments as PaymentsIcon,
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
import {
  AdminActionButton,
  AdminActionIcon,
  AdminActionText,
  AdminSubItemButton,
  AdminSubItemText,
} from "@/components/styles/admin/admin-navigation.styles";
import { useSupabase } from "@/contexts/supabase-context";
import { useRouter } from "next/navigation";
import { ROLES } from "@/utils/constants";

interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  showWhenAuthenticated: boolean;
  showWhenUnauthenticated: boolean;
  adminOnly?: boolean;
}

interface AdminActionItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  description?: string;
}

interface CreatorActionItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  description?: string;
}

interface DesktopNavigationProps {
  pathname: string;
  onNavigation: (path: string) => void;
}

export const DesktopNavigation = ({
  pathname,
  onNavigation,
}: DesktopNavigationProps) => {
  // General Hooks
  const router = useRouter();
  const { signOut, user, userProfile } = useSupabase();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
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

  const adminActionItems: AdminActionItem[] = [
    {
      label: "Dashboard",
      icon: <AdminIcon />,
      path: "/admin",
      description: "Main admin dashboard",
    },
    {
      label: "Creator Applications",
      icon: <PeopleIcon />,
      path: "/admin/creator-applications",
      description: "Review creator applications",
    },
    {
      label: "User Management",
      icon: <PeopleIcon />,
      path: "/admin/users",
      description: "Manage platform users",
    },
    {
      label: "Categories",
      icon: <CategoryIcon />,
      path: "/admin/categories",
      description: "Manage course categories",
    },
    {
      label: "Tags",
      icon: <TagIcon />,
      path: "/admin/tags",
      description: "Manage course tags",
    },
    {
      label: "Analytics",
      icon: <AssessmentIcon />,
      path: "/admin/analytics",
      description: "Platform analytics and reports",
    },
    {
      label: "Security",
      icon: <SecurityIcon />,
      path: "/admin/security",
      description: "Security settings and logs",
    },
  ];

  const creatorActionItems: CreatorActionItem[] = [
    {
      label: "My Courses",
      icon: <VideoIcon />,
      path: "/creator/courses",
      description: "Manage your created courses",
    },
    {
      label: "Analytics",
      icon: <AnalyticsIcon />,
      path: "/creator/analytics",
      description: "View course performance",
    },
    {
      label: "Earnings",
      icon: <PaymentsIcon />,
      path: "/creator/earnings",
      description: "Track your earnings",
    },
  ];

  const filteredItems = navigationItems.filter((item) => {
    if (user) {
      return item.showWhenAuthenticated;
    } else {
      return item.showWhenUnauthenticated;
    }
  });

  const isAdmin = userProfile?.role === ROLES.ADMIN;
  const isCreator = userProfile?.role === ROLES.CREATOR;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleAdminMenuToggle = () => {
    setAdminMenuOpen(!adminMenuOpen);
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

          {/* Creator Actions Section */}
          {isCreator && (
            <>
              <FooterDivider />
              <List
                component="nav"
                aria-labelledby="creator-actions-subheader"
                subheader={
                  <ListSubheader
                    component="div"
                    id="creator-actions-subheader"
                    sx={{ bgcolor: "transparent", color: "text.secondary" }}
                  >
                    Creator Actions
                  </ListSubheader>
                }
              >
                {creatorActionItems.map((item) => (
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
            </>
          )}

          {/* Admin Actions Section */}
          {isAdmin && (
            <>
              <SidebarListItem disablePadding>
                <AdminActionButton
                  onClick={handleAdminMenuToggle}
                  aria-label="Admin Actions"
                >
                  <AdminActionIcon>
                    <AdminIcon />
                  </AdminActionIcon>
                  <AdminActionText primary="Admin Actions" />
                  {adminMenuOpen ? <ExpandLess /> : <ExpandMore />}
                </AdminActionButton>
              </SidebarListItem>

              <Collapse in={adminMenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {adminActionItems.map((item) => (
                    <SidebarListItem key={item.path} disablePadding>
                      <AdminSubItemButton
                        selected={pathname === item.path}
                        onClick={() => onNavigation(item.path)}
                        aria-label={item.label}
                      >
                        <SidebarListItemIcon>{item.icon}</SidebarListItemIcon>
                        <AdminSubItemText
                          primary={item.label}
                          secondary={item.description}
                        />
                      </AdminSubItemButton>
                    </SidebarListItem>
                  ))}
                </List>
              </Collapse>
            </>
          )}
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
                <LogoutIcon />
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
