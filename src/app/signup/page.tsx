"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Typography, Link, Breadcrumbs, Box } from "@mui/material";
import { HashLoader } from "react-spinners";
import { useSupabase } from "@/contexts/SupabaseContext";
import AuthForm from "@/components/AuthForm";
import {
  AuthContainer,
  BreadcrumbsContainer,
  HeaderPaper,
  AuthTitle,
  AuthSubtitle,
  FooterContainer,
} from "@/components/styled/AuthPages.styled";

const SignUpPage = () => {
  const { user, loading } = useSupabase();
  const router = useRouter();

  const handleRedirect = useCallback(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [loading, user, router]);

  // Redirect if already authenticated
  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: "#1a1b23",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <HashLoader color="#4ecdc4" size={50} />
      </Box>
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: "#1a1b23",
        minHeight: "100vh",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <AuthContainer maxWidth="sm">
        <BreadcrumbsContainer>
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              "& .MuiBreadcrumbs-ol": {
                color: "#9ca3af",
              },
              "& .MuiLink-root": {
                color: "#4ecdc4",
                "&:hover": {
                  color: "#45b7af",
                },
              },
              "& .MuiTypography-root": {
                color: "#ffffff",
              },
            }}
          >
            <Link href="/" color="inherit" underline="hover">
              Home
            </Link>
            <Typography color="text.primary">Sign Up</Typography>
          </Breadcrumbs>
        </BreadcrumbsContainer>

        <HeaderPaper
          sx={{
            backgroundColor: "#252730",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "32px",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          <AuthTitle
            variant="h3"
            component="h1"
            sx={{
              color: "#ffffff",
              fontSize: "2.5rem",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "16px",
            }}
          >
            Create Account
          </AuthTitle>
          <AuthSubtitle
            variant="h6"
            sx={{
              color: "#9ca3af",
              fontSize: "1.125rem",
              fontWeight: 400,
            }}
          >
            Join us and start your journey today
          </AuthSubtitle>
        </HeaderPaper>

        <AuthForm mode="signup" />

        <FooterContainer>
          <Typography
            variant="body2"
            sx={{
              color: "#9ca3af",
              textAlign: "center",
              "& .MuiLink-root": {
                color: "#4ecdc4",
                textDecoration: "none",
                "&:hover": {
                  color: "#45b7af",
                  textDecoration: "underline",
                },
              },
            }}
          >
            Already have an account?{" "}
            <Link href="/signin" underline="hover">
              Sign in here
            </Link>
          </Typography>
        </FooterContainer>
      </AuthContainer>
    </Box>
  );
};

export default SignUpPage;
