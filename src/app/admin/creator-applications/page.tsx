"use client";

import { useSupabase } from "@/contexts/supabase-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Skeleton,
} from "@mui/material";
import { PageContainer } from "@/components/styles/infrastructure/layout.styles";
import CreatorApplicationsList from "@/components/admin/creator-applications-list";
import { trpc } from "@/lib/trpc/client";
import {
  StatCard,
  StatCardContent,
  StatValue,
  StatLabel,
  ApplicationsContainer,
  PageHeader,
  StatsGrid,
} from "@/components/styles/admin/creator-applications.styles";
import { CREATOR_APPLICATIONS_PER_PAGE, ROLES } from "@/utils/constants";

const AdminCreatorApplicationsPage = () => {
  const { user, userProfile, loading } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== ROLES.ADMIN)) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile, loading]);

  const { data: applications } =
    trpc.creatorApplications.getApplications.useQuery(
      { page: 1, pageSize: CREATOR_APPLICATIONS_PER_PAGE },
      { refetchInterval: 30000 }
    );

  const getStatusCount = (status: string) => {
    if (!applications?.data) return 0;
    return applications.data.filter((app) => app.status === status).length;
  };

  if (loading) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          {/* Page Header Skeleton */}
          <Box mb={4}>
            <Skeleton variant="text" width="60%" height={48} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={24} />
          </Box>

          {/* Statistics Cards Skeleton */}
          <Box mb={4}>
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <StatCard>
                    <StatCardContent>
                      <Skeleton
                        variant="text"
                        width="70%"
                        height={20}
                        sx={{ mb: 1 }}
                      />
                      <Skeleton variant="text" width="40%" height={32} />
                    </StatCardContent>
                  </StatCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Applications List Skeleton */}
          <ApplicationsContainer>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
              <Box>
                {[1, 2, 3, 4, 5].map((index) => (
                  <Box key={index} mb={2}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Skeleton variant="text" width="80%" height={20} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Skeleton variant="text" width="60%" height={20} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <Skeleton variant="rounded" width={80} height={24} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <Skeleton variant="text" width="40%" height={20} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <Skeleton variant="rounded" width={80} height={36} />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Box>
            </Paper>
          </ApplicationsContainer>
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
        <PageHeader>
          <Typography variant="h4" component="h1" gutterBottom>
            Creator Applications Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review and manage creator applications for the platform
          </Typography>
        </PageHeader>

        {/* Statistics Cards */}
        <StatsGrid>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard>
                <StatCardContent>
                  <StatLabel gutterBottom>Total Applications</StatLabel>
                  <StatValue>{applications?.data?.length || 0}</StatValue>
                </StatCardContent>
              </StatCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard>
                <StatCardContent>
                  <StatLabel gutterBottom>Pending Review</StatLabel>
                  <StatValue color="warning.main">
                    {getStatusCount("pending")}
                  </StatValue>
                </StatCardContent>
              </StatCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard>
                <StatCardContent>
                  <StatLabel gutterBottom>Approved</StatLabel>
                  <StatValue color="success.main">
                    {getStatusCount("approved")}
                  </StatValue>
                </StatCardContent>
              </StatCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard>
                <StatCardContent>
                  <StatLabel gutterBottom>Rejected</StatLabel>
                  <StatValue color="error.main">
                    {getStatusCount("rejected")}
                  </StatValue>
                </StatCardContent>
              </StatCard>
            </Grid>
          </Grid>
        </StatsGrid>

        {/* Applications List */}
        <ApplicationsContainer>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Applications Overview
            </Typography>
            <CreatorApplicationsList />
          </Paper>
        </ApplicationsContainer>
      </Container>
    </PageContainer>
  );
};

export default AdminCreatorApplicationsPage;
