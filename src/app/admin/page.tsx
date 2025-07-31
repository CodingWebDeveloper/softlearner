"use client";

import { useSupabase } from "@/contexts/supabase-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Container, Typography, Box, Grid, Skeleton } from "@mui/material";
import { PageContainer } from "@/components/styles/infrastructure/layout.styles";
import { useRouter as useNextRouter } from "next/navigation";
import {
  People as PeopleIcon,
  Category as CategoryIcon,
  LocalOffer as TagIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import {
  AdminActionCard,
  AdminActionCardContent,
  AdminActionIcon,
  AdminActionButton,
} from "@/components/styles/admin/admin-dashboard.styles";
import { ROLES } from "@/utils/constants";

const AdminDashboard = () => {
  const { user, userProfile, loading } = useSupabase();
  const router = useRouter();
  const nextRouter = useNextRouter();

  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== ROLES.ADMIN)) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile, loading]);

  const adminActions = [
    {
      title: "Creator Applications",
      description: "Review and manage creator applications",
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      path: "/admin/creator-applications",
      color: "primary.main",
    },
    {
      title: "User Management",
      description: "Manage platform users and roles",
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      path: "/admin/users",
      color: "secondary.main",
    },
    {
      title: "Categories",
      description: "Manage course categories",
      icon: <CategoryIcon sx={{ fontSize: 40 }} />,
      path: "/admin/categories",
      color: "success.main",
    },
    {
      title: "Tags",
      description: "Manage course tags",
      icon: <TagIcon sx={{ fontSize: 40 }} />,
      path: "/admin/tags",
      color: "info.main",
    },
    {
      title: "Analytics",
      description: "View platform statistics and reports",
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      path: "/admin/analytics",
      color: "warning.main",
    },
    {
      title: "Security",
      description: "Monitor security and system logs",
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      path: "/admin/security",
      color: "error.main",
    },
  ];

  if (loading) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          {/* Page Header Skeleton */}
          <Box mb={4}>
            <Skeleton variant="text" width="40%" height={48} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={24} />
          </Box>

          {/* Admin Action Cards Skeleton */}
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                <AdminActionCard>
                  <AdminActionCardContent>
                    <Skeleton
                      variant="circular"
                      width={40}
                      height={40}
                      sx={{ mb: 2 }}
                    />
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={28}
                      sx={{ mb: 1 }}
                    />
                    <Skeleton
                      variant="text"
                      width="90%"
                      height={20}
                      sx={{ mb: 2 }}
                    />
                    <Skeleton variant="rounded" width={80} height={32} />
                  </AdminActionCardContent>
                </AdminActionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </PageContainer>
    );
  }

  if (!user || userProfile?.role !== ROLES.ADMIN) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <Typography>Access denied. Admin privileges required.</Typography>
          </Box>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage creator applications and platform content
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {adminActions.map((action) => (
            <Grid key={action.path} size={{ xs: 12, sm: 6, md: 4 }}>
              <AdminActionCard onClick={() => nextRouter.push(action.path)}>
                <AdminActionCardContent>
                  <AdminActionIcon sx={{ color: action.color }}>
                    {action.icon}
                  </AdminActionIcon>
                  <Typography variant="h6" gutterBottom>
                    {action.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {action.description}
                  </Typography>
                  <AdminActionButton
                    variant="outlined"
                    size="small"
                    sx={{ color: action.color, borderColor: action.color }}
                  >
                    Access
                  </AdminActionButton>
                </AdminActionCardContent>
              </AdminActionCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </PageContainer>
  );
};

export default AdminDashboard;
