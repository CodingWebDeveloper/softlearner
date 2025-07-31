import { styled } from "@mui/material/styles";
import { Card, CardContent, Typography, Box } from "@mui/material";

export const StatCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[3],
  },
}));

export const StatCardContent = styled(CardContent)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(2),
}));

export const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: 600,
  marginTop: theme.spacing(1),
}));

export const StatLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  marginBottom: theme.spacing(1),
}));

export const ApplicationsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

export const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const StatsGrid = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));
