import { styled } from "@mui/material/styles";
import {
  Container,
  Box,
  Paper,
  Typography,
  TypographyProps,
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
}));

export const AuthTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const AuthSubtitle = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    marginBottom: theme.spacing(2),
  })
);

export const FooterContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  textAlign: "center",
}));
