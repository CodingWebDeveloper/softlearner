"use client";

import { useSupabase } from "@/contexts/supabase-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import { PageContainer } from "@/components/styles/infrastructure/layout.styles";
import { ROLES } from "@/utils/constants";
import { HashLoader } from "react-spinners";

const CreatorEarningsPage = () => {
  const { user, userProfile, loading } = useSupabase();
  const router = useRouter();
  const theme = useTheme();
  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== ROLES.CREATOR)) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile, loading]);

  if (loading) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Box mb={4}>
            <HashLoader color={theme.palette.custom.accent.teal} size={50} />
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
            Earnings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your earnings and payments
          </Typography>
        </Box>
        {/* Earnings content will be implemented here */}
      </Container>
    </PageContainer>
  );
};

export default CreatorEarningsPage;
