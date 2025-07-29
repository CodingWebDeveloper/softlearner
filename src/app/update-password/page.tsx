"use client";

import { useEffect, useState } from "react";
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
  SignInPageContainer,
  LoadingContainer,
  BreadcrumbsStyled,
} from "@/components/styles/auth/auth-pages.styles";
import UpdatePasswordForm from "@/components/update-password-form";

const UpdatePasswordPage = () => {
  const { loading, setRecoveryMode } = useSupabase();
  const theme = useTheme();
  const [isValidSession, setIsValidSession] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    setSessionLoading(false);
    setIsValidSession(true);
    setRecoveryMode(true);

    return () => {
      setRecoveryMode(false);
    };
  }, [setRecoveryMode]);

  if (loading || sessionLoading) {
    return (
      <LoadingContainer>
        <HashLoader color={theme.palette.custom.accent.teal} size={50} />
      </LoadingContainer>
    );
  }

  if (!isValidSession) {
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
            <Typography color="text.primary">Update Password</Typography>
          </BreadcrumbsStyled>
        </BreadcrumbsContainer>

        <HeaderPaper>
          <AuthTitle variant="h3" component="h1">
            Update Your Password
          </AuthTitle>
          <AuthSubtitle variant="h6">
            Enter your new password below
          </AuthSubtitle>
        </HeaderPaper>

        <UpdatePasswordForm />
      </AuthContainer>
    </SignInPageContainer>
  );
};

export default UpdatePasswordPage;
