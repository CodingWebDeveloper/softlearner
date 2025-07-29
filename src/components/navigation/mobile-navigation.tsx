"use client";

import { Toolbar, IconButton, Typography } from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import { User } from "@supabase/supabase-js";
import {
  Home as HomeIcon,
  Book as BookIcon,
  LocalLibrary as MyCoursesIcon,
  MoreHoriz as MoreIcon,
  Bookmark as BookmarkIcon,
} from "@mui/icons-material";
import {
  BottomNavContainer,
  BottomNavAction,
  StyledBottomNavigation,
  UserAvatar,
  StyledAppBar,
} from "@/components/styles/infrastructure/navigation.styles";

interface MobileNavigationProps {
  pathname: string;
  user: User | null;
  onNavigation: (path: string) => void;
}

export const MobileNavigation = ({
  pathname,
  user,
  onNavigation,
}: MobileNavigationProps) => {
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
      label: "More",
      icon: <MoreIcon />,
      path: "/more",
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
              onClick={() => onNavigation("/profile")}
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
              onNavigation(newValue);
            }
          }}
        >
          {filteredItems.map((item) => (
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
};
