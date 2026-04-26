"use client";

import { useSupabase } from "@/contexts/supabase-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  useTheme,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { PageContainer } from "@/components/styles/infrastructure/layout.styles";
import { ROLES } from "@/utils/constants";
import { HashLoader } from "react-spinners";
import { trpc } from "@/lib/trpc/client";
import { useSnackbar } from "notistack";

const CreatorEarningsPage = () => {
  const { user, userProfile, loading } = useSupabase();
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== ROLES.CREATOR)) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile, loading]);

  const {
    data: connectStatus,
    isLoading: isStatusLoading,
    refetch: refetchStatus,
  } = trpc.stripeConnect.getStatus.useQuery(undefined, {
    enabled: !!user && userProfile?.role === ROLES.CREATOR,
  });

  const createAccountLink = trpc.stripeConnect.createAccountLink.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (error) => {
      enqueueSnackbar(`Failed to start onboarding: ${error.message}`, {
        variant: "error",
      });
    },
  });

  const getDashboardLink = trpc.stripeConnect.getDashboardLink.useMutation({
    onSuccess: ({ url }) => {
      window.open(url, "_blank");
    },
    onError: (error) => {
      enqueueSnackbar(`Failed to open dashboard: ${error.message}`, {
        variant: "error",
      });
    },
  });

  const handleStartOnboarding = () => {
    createAccountLink.mutate({
      refreshUrl: `${window.location.origin}/creator/earnings`,
      returnUrl: `${window.location.origin}/creator/earnings`,
    });
  };

  const handleOpenDashboard = () => {
    getDashboardLink.mutate();
  };

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

  const renderConnectStatus = () => {
    if (isStatusLoading) {
      return (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (!connectStatus?.hasAccount) {
      return (
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Connect with Stripe
              </Typography>
              <Chip label="Not connected" color="warning" size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary" mb={3}>
              To receive payments for your courses, you need to connect a Stripe
              account. Stripe will handle your payouts securely. The platform
              takes a 10% fee on each sale.
            </Typography>
            <Button
              variant="contained"
              onClick={handleStartOnboarding}
              disabled={createAccountLink.isPending}
              startIcon={
                createAccountLink.isPending ? (
                  <CircularProgress size={16} color="inherit" />
                ) : undefined
              }
            >
              Start Stripe Onboarding
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (!connectStatus.onboardingComplete) {
      return (
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Complete Your Stripe Setup
              </Typography>
              <Chip label="Pending" color="warning" size="small" />
            </Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Your Stripe account is not fully set up. You cannot create courses
              until you complete onboarding.
            </Alert>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Please complete your Stripe onboarding to start receiving
              payments. This usually takes just a few minutes.
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                onClick={handleStartOnboarding}
                disabled={createAccountLink.isPending}
                startIcon={
                  createAccountLink.isPending ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : undefined
                }
              >
                Continue Onboarding
              </Button>
              <Button variant="outlined" onClick={() => refetchStatus()}>
                Refresh Status
              </Button>
            </Box>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Stripe Payouts
            </Typography>
            <Chip label="Connected" color="success" size="small" />
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" mb={1}>
            Account ID: <strong>{connectStatus.accountId}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Charges enabled:{" "}
            <strong>{connectStatus.chargesEnabled ? "Yes" : "No"}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Platform fee: <strong>10%</strong> per sale
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenDashboard}
            disabled={getDashboardLink.isPending}
            startIcon={
              getDashboardLink.isPending ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            Open Stripe Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Earnings &amp; Payouts
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Manage your Stripe Connect account and track your course revenue.
          </Typography>
          {renderConnectStatus()}
        </Box>
      </Container>
    </PageContainer>
  );
};

export default CreatorEarningsPage;
