"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Typography, Link, Breadcrumbs, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { HashLoader } from "react-spinners";
import { useSupabase } from "@/contexts/SupabaseContext";
import AuthForm from "@/components/auth-form";
import {
  AuthContainer,
  BreadcrumbsContainer,
  HeaderPaper,
  AuthTitle,
  AuthSubtitle,
  FooterContainer,
  SignInPageContainer,
  LoadingContainer,
  BreadcrumbsStyled,
  FooterText,
} from "@/components/styles/auth/auth-pages.styles";

const SignInPage = () => {
  const { user, loading } = useSupabase();
  const router = useRouter();
  const theme = useTheme();

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
      <LoadingContainer>
        <HashLoader color={theme.palette.custom.accent.teal} size={50} />
      </LoadingContainer>
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <SignInPageContainer>
      <AuthContainer maxWidth="sm">
        <BreadcrumbsContainer>
          <BreadcrumbsStyled aria-label="breadcrumb">
            <Link href="/" color="inherit" underline="hover">
              Home
            </Link>
            <Typography color="text.primary">Sign In</Typography>
          </BreadcrumbsStyled>
        </BreadcrumbsContainer>

        <HeaderPaper>
          <AuthTitle variant="h3" component="h1">
            Welcome Back
          </AuthTitle>
          <AuthSubtitle variant="h6">
            Sign in to your account to continue
          </AuthSubtitle>
        </HeaderPaper>

        <AuthForm mode="signin" />

        <FooterContainer>
          <FooterText>
            Don&apos;t have an account?{" "}
            <Link href="/signup" underline="hover">
              Sign up here
            </Link>
          </FooterText>
        </FooterContainer>
      </AuthContainer>
    </SignInPageContainer>
  );
};

export default SignInPage;
