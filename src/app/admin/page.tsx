"use client";

import { useSupabase } from "@/contexts/supabase-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Container, Typography, Box, Grid, Skeleton } from "@mui/material";
import { PageContainer } from "@/components/styles/infrastructure/layout.styles";
import { ROLES } from "@/utils/constants";
import AdminDashboard from "@/components/admin/admin-dashboard";

const AdminPage = () => {
  const { user, userProfile, loading } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== ROLES.ADMIN)) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile, loading]);

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
                <Box p={2}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />
                  <Skeleton variant="rounded" width={80} height={32} />
                </Box>
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
        <AdminDashboard />
      </Container>
    </PageContainer>
  );
};

export default AdminPage;
