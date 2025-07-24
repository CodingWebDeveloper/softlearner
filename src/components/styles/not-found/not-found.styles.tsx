import { styled } from "@mui/material/styles";
import { Box, Typography, Button } from "@mui/material";

export const NotFoundContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundColor: theme.palette.custom.background.dark,
  padding: theme.spacing(3),
  textAlign: "center",
}));

export const ErrorCode = styled(Typography)(({ theme }) => ({
  fontSize: "8rem",
  fontWeight: 700,
  color: theme.palette.custom.accent.teal,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    fontSize: "6rem",
  },
}));

export const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  marginBottom: theme.spacing(4),
  maxWidth: "600px",
}));

export const HomeButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.custom.accent.teal,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.tealDark,
  },
}));
