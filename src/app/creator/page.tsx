"use client";

import { useSupabase } from "@/contexts/supabase-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Container, Typography, Box, Grid, Skeleton } from "@mui/material";
import { PageContainer } from "@/components/styles/infrastructure/layout.styles";
import { useRouter as useNextRouter } from "next/navigation";
import {
  OndemandVideo as VideoIcon,
  Analytics as AnalyticsIcon,
  Payments as PaymentsIcon,
} from "@mui/icons-material";
import {
  AdminActionCard,
  AdminActionCardContent,
  AdminActionIcon,
} from "@/components/styles/admin/admin-dashboard.styles";
import { ROLES } from "@/utils/constants";

const CreatorDashboard = () => {
  const { user, userProfile, loading } = useSupabase();
  const router = useRouter();
  const nextRouter = useNextRouter();

  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== ROLES.CREATOR)) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile, loading]);

  const creatorActions = [
    {
      title: "My Courses",
      description: "Manage your created courses",
      icon: <VideoIcon sx={{ fontSize: 40 }} />,
      path: "/creator/courses",
      color: "primary.main",
    },
    {
      title: "Analytics",
      description: "View course performance and statistics",
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      path: "/creator/analytics",
      color: "warning.main",
    },
    {
      title: "Earnings",
      description: "Track your earnings and payments",
      icon: <PaymentsIcon sx={{ fontSize: 40 }} />,
      path: "/creator/earnings",
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

          {/* Creator Action Cards Skeleton */}
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

  if (!user || userProfile?.role !== ROLES.CREATOR) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <Typography>Access denied. Creator privileges required.</Typography>
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
            Creator Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your courses, content, and track performance
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {creatorActions.map((action) => (
            <Grid key={action.path} size={{ xs: 12, sm: 6, md: 4 }}>
              <AdminActionCard onClick={() => nextRouter.push(action.path)}>
                <AdminActionCardContent>
                  <AdminActionIcon sx={{ color: action.color }}>
                    {action.icon}
                  </AdminActionIcon>
                  <Typography variant="h6" gutterBottom>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </AdminActionCardContent>
              </AdminActionCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </PageContainer>
  );
};

export default CreatorDashboard;
