import { styled } from "@mui/material/styles";
import { Typography, Button, Box, Alert } from "@mui/material";

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(4, 0),
}));

export const StatusHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

export const StatusDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const AdminNotesAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const ApplicationDetails = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const ContentTypeChips = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

export const ReapplyMessage = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const ApplyButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
}));
