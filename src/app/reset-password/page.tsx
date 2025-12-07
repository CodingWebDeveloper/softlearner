"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { HashLoader } from "react-spinners";
import { useSupabase } from "@/contexts/supabase-context";
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
import ResetPasswordForm from "@/components/reset-password-form";

const ResetPasswordPage = () => {
  const { user, loading, setRecoveryMode } = useSupabase();
  const router = useRouter();
  const theme = useTheme();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  // Ensure recovery mode is false on reset password page
  useEffect(() => {
    setRecoveryMode(false);
  }, [setRecoveryMode]);

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
            <Link href="/signin" color="inherit" underline="hover">
              Sign In
            </Link>
            <Typography color="text.primary">Reset Password</Typography>
          </BreadcrumbsStyled>
        </BreadcrumbsContainer>

        <HeaderPaper>
          <AuthTitle variant="h3" component="h1">
            Reset Your Password
          </AuthTitle>
          <AuthSubtitle variant="h6">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </AuthSubtitle>
        </HeaderPaper>

        <ResetPasswordForm />

        <FooterContainer>
          <FooterText>
            Remember your password?{" "}
            <Link href="/signin" underline="hover">
              Sign in here
            </Link>
          </FooterText>
        </FooterContainer>
      </AuthContainer>
    </SignInPageContainer>
  );
};

export default ResetPasswordPage;
