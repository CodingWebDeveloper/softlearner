"use client";

import { Button, Typography, Box } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";

const NotFoundContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundColor: theme.palette.custom.background.dark,
  padding: theme.spacing(3),
  textAlign: "center",
}));

const ErrorCode = styled(Typography)(({ theme }) => ({
  fontSize: "8rem",
  fontWeight: 700,
  color: theme.palette.custom.accent.teal,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    fontSize: "6rem",
  },
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  marginBottom: theme.spacing(4),
  maxWidth: "600px",
}));

const HomeButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.custom.accent.teal,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.tealDark,
  },
}));

export default function NotFound() {
  const router = useRouter();

  return (
    <NotFoundContainer>
      <ErrorCode variant="h1">404</ErrorCode>
      <ErrorMessage variant="h5" gutterBottom>
        Oops! Page Not Found
      </ErrorMessage>
      <ErrorMessage variant="body1" gutterBottom>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </ErrorMessage>
      <HomeButton
        variant="contained"
        startIcon={<HomeIcon />}
        onClick={() => router.push("/")}
        size="large"
      >
        Back to Home
      </HomeButton>
    </NotFoundContainer>
  );
}
