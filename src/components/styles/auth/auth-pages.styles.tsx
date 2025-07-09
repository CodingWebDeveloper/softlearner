import { styled } from "@mui/material/styles";
import {
  Container,
  Box,
  Paper,
  Typography,
  TypographyProps,
  Breadcrumbs,
} from "@mui/material";

export const AuthContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

export const BreadcrumbsContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const HeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  backgroundColor: theme.palette.custom.background.secondary,
}));

export const AuthTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.custom.text.white,

}));

export const AuthSubtitle = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    marginBottom: theme.spacing(2),
    color: theme.palette.custom.text.light,
  })
);

export const FooterContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  textAlign: "center",
}));

export const SignInPageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.dark,
  minHeight: "100vh",
  color: theme.palette.custom.text.white,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.dark,
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const BreadcrumbsStyled = styled(Breadcrumbs)(({ theme }) => ({
  "& .MuiBreadcrumbs-ol": {
    color: theme.palette.custom.text.light,
  },
  "& .MuiLink-root": {
    color: theme.palette.custom.accent.teal,
    "&:hover": {
      color: theme.palette.custom.accent.tealDark,
    },
  },
  "& .MuiTypography-root": {
    color: theme.palette.custom.text.white,
  },
}));

export const FooterText = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  textAlign: "center",
  "& .MuiLink-root": {
    color: theme.palette.custom.accent.teal,
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.custom.accent.tealDark,
      textDecoration: "underline",
    },
  },
}));
