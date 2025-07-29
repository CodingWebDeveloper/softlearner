"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { HashLoader } from "react-spinners";
import { useSupabase } from "@/contexts/supabase-context";
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

const SignUpPage = () => {
  const { user, loading } = useSupabase();
  const router = useRouter();
  const theme = useTheme();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [loading, user]);

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
            <Typography color="text.primary">Sign Up</Typography>
          </BreadcrumbsStyled>
        </BreadcrumbsContainer>

        <HeaderPaper>
          <AuthTitle variant="h3" component="h1">
            Create Account
          </AuthTitle>
          <AuthSubtitle variant="h6">
            Join us and start your journey today
          </AuthSubtitle>
        </HeaderPaper>

        <AuthForm mode="signup" />

        <FooterContainer>
          <FooterText>
            Already have an account?{" "}
            <Link href="/signin" underline="hover">
              Sign in here
            </Link>
          </FooterText>
        </FooterContainer>
      </AuthContainer>
    </SignInPageContainer>
  );
};

export default SignUpPage;
